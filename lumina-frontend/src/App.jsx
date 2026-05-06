import { useState, useRef } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import TopBar from "./components/TopBar";
import Terminal from "./components/Terminal";
import InputBar from "./components/InputBar";
import { api } from "./services/api";

const HELP_TEXT = `
╔══════════════════════════════════════════╗
║        LUMINA — COMMAND REFERENCE        ║
╚══════════════════════════════════════════╝

  GENERATION
  ──────────────────────────────────────────
  readme          Generate a professional README file
  comment         Add inline comments and docstrings
  docstring       Generate Google-style docstrings only
  changelog       Generate a CHANGELOG entry
  review          Audit code for documentation gaps

  HISTORY
  ──────────────────────────────────────────
  history         List all transactions
  return          Show latest transaction
  return {id}     Show transaction by ID
  log             Show latest log entry
  log {id}        Show log entry by ID

  INTERFACE
  ──────────────────────────────────────────
  clear           Clear terminal view
  help            Show this reference
`;

const GENERATION_COMMANDS = ["readme", "comment", "docstring", "changelog", "review"];

const COMMAND_PROMPTS = {
  readme:    "● Paste your code or project description below.\n  Press Enter to generate.",
  comment:   "● Paste your code below. Inline comments and docstrings will be added.\n  Press Enter to generate.",
  docstring: "● Paste your code below. Google-style docstrings will be generated.\n  Press Enter to generate.",
  changelog: "● Describe what changed, or paste a diff/code below.\n  Press Enter to generate.",
  review:    "● Paste your code below. A documentation audit report will be generated.\n  Press Enter to generate.",
};

function LuminaApp() {
  const { colors, fontFamily } = useTheme();
  const [lines, setLines] = useState([
    { type: "output", content: "Lumina v1.0.0 — Technical Documentation Tool\nType 'help' to see available commands.\n" },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState(null);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const push = (...entries) => setLines(prev => [...prev, ...entries]);

  const processCommand = async (raw) => {
    const trimmed = raw.trim();
    if (!trimmed || loading) return;

    push({ type: "input", content: trimmed });

    // Awaiting code/description after a generation command
    if (awaitingInput && mode) {
      setAwaitingInput(false);
      setLoading(true);
      push({ type: "loading", content: `Generating ${mode} documentation...` });
      try {
        const result = await api.generate(mode, trimmed);
        setLines(prev => prev.filter(l => l.type !== "loading"));
        push(
          { type: "document", meta: result },
          { type: "success", content: `Done — ${result.title} · ID: ${result.id.slice(0, 8)}` }
        );
      } catch (err) {
        setLines(prev => prev.filter(l => l.type !== "loading"));
        push({ type: "error", content: err.message || "Generation failed." });
      } finally {
        setLoading(false);
        setMode(null);
      }
      return;
    }

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").trim();

    if (cmd === "clear") { setLines([]); return; }

    if (cmd === "help") { push({ type: "output", content: HELP_TEXT }); return; }

    // All 5 generation commands handled uniformly
    if (GENERATION_COMMANDS.includes(cmd)) {
      setMode(cmd);
      setAwaitingInput(true);
      push({ type: "output", content: COMMAND_PROMPTS[cmd] });
      return;
    }

    if (cmd === "history") {
      setLoading(true);
      try {
        const rows = await api.history();
        push(rows.length === 0
          ? { type: "output", content: "No transactions found." }
          : { type: "table", rows });
      } catch (err) {
        push({ type: "error", content: err.message });
      } finally { setLoading(false); }
      return;
    }

    if (cmd === "return") {
      setLoading(true);
      try {
        const tx = arg ? await api.returnById(arg) : await api.returnLatest();
        push({ type: "return", meta: tx });
      } catch (err) {
        push({ type: "error", content: err.message });
      } finally { setLoading(false); }
      return;
    }

    if (cmd === "log") {
      setLoading(true);
      try {
        const tx = arg ? await api.logById(arg) : await api.logLatest();
        push({ type: "log", meta: tx });
      } catch (err) {
        push({ type: "error", content: err.message });
      } finally { setLoading(false); }
      return;
    }

    push({ type: "error", content: `Unknown command: '${cmd}'. Type 'help' for commands.` });
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        height: "100dvh", display: "flex", flexDirection: "column",
        background: colors.bg, fontFamily, fontSize: "0.88rem",
        color: colors.text, overflow: "hidden",
      }}
    >
      <TopBar />
      <Terminal lines={lines} />
      <InputBar
        inputRef={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            processCommand(input);
            setInput("");
          }
        }}
        mode={mode}
        awaitingInput={awaitingInput}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LuminaApp />
    </ThemeProvider>
  );
}