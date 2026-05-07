import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import DocBlock, { formatTime } from "./DocBlock";

export default function TerminalLine({ entry }) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(5px)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
    marginBottom: "0.15rem",
  };

  if (entry.type === "input") return (
    <div style={fadeStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
        <span style={{ color: colors.prompt, userSelect: "none", flexShrink: 0 }}>lumina ❯</span>
        <span style={{ color: colors.text, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{entry.content}</span>
      </div>
    </div>
  );

  if (entry.type === "output") return (
    <div style={fadeStyle}>
      <div style={{
        color: colors.muted, paddingLeft: "1.5rem", whiteSpace: "pre-wrap",
        lineHeight: "1.7", borderLeft: `2px solid ${colors.border}`,
        marginLeft: "0.25rem", marginTop: "0.25rem", marginBottom: "0.5rem",
        wordBreak: "break-word",
      }}>
        {entry.content}
      </div>
    </div>
  );

  if (entry.type === "error") return (
    <div style={fadeStyle}>
      <div style={{ color: "#f87171", paddingLeft: "1.5rem", marginBottom: "0.5rem" }}>
        ✗ {entry.content}
      </div>
    </div>
  );

  if (entry.type === "success") return (
    <div style={fadeStyle}>
      <div style={{ color: colors.prompt, paddingLeft: "1.5rem", marginBottom: "0.25rem", fontSize: "0.8rem" }}>
        ✓ {entry.content}
      </div>
    </div>
  );

  if (entry.type === "loading") return (
    <div style={fadeStyle}>
      <div style={{ color: colors.subtle, paddingLeft: "1.5rem", marginBottom: "0.25rem", fontSize: "0.8rem" }}>
        ⟳ {entry.content}
      </div>
    </div>
  );

  if (entry.type === "document") return (
    <div style={{ ...fadeStyle, paddingLeft: "1.5rem" }}>
      <DocBlock meta={entry.meta} />
    </div>
  );

  if (entry.type === "return") return (
    <div style={{ ...fadeStyle, paddingLeft: "1.5rem", marginBottom: "1rem" }}>
      {/* Prompt section */}
      <div style={{
        padding: "0.6rem 0.85rem",
        background: colors.docHeader,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px 6px 0 0",
        borderBottom: "none",
      }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.3rem" }}>
          <span style={{ color: colors.subtle, fontSize: "0.7rem", letterSpacing: "0.1em" }}>PROMPT</span>
          <span style={{ color: colors.prompt, fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.1em" }}>
            {entry.meta.command?.toUpperCase()}
          </span>
        </div>
        <div style={{ color: colors.muted, fontSize: "0.82rem", wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{entry.meta.input}</div>
      </div>
      <DocBlock meta={entry.meta} />
    </div>
  );

  if (entry.type === "log") return (
    <div style={{ ...fadeStyle, paddingLeft: "1.5rem", marginBottom: "1rem" }}>
      <div style={{
        background: colors.docBg,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "0.5rem 0.85rem",
          background: colors.docHeader,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <span style={{ color: "#818cf8", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em" }}>
            TRANSACTION LOG
          </span>
        </div>
        <div style={{ padding: "0.75rem 1rem" }}>
          {[
            ["ID", entry.meta.id],
            ["Command", entry.meta.command],
            ["Title", entry.meta.title],
            ["Status", entry.meta.status],
            ["Tokens", entry.meta.tokens_used],
            ["Gen time", `${(entry.meta.gen_time_ms / 1000).toFixed(2)}s`],
            ["Created", formatTime(entry.meta.created_at)],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: "grid", gridTemplateColumns: "6rem 1fr",
              gap: "1rem", padding: "0.25rem 0", fontSize: "0.82rem",
            }}>
              <span style={{ color: colors.subtle }}>{label}</span>
              <span style={{
                color: label === "Status"
                  ? (val === "success" ? "#4ade80" : "#f87171")
                  : colors.text,
                wordBreak: "break-all",
              }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (entry.type === "table") return (
    <div style={{ ...fadeStyle, paddingLeft: "1rem", marginBottom: "0.75rem", overflowX: "auto" }}>
      {entry.rows.map((row, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "7rem 5rem 1fr 8rem",
          gap: "0.75rem", padding: "0.4rem 0.75rem",
          background: i % 2 === 0 ? colors.altRow : "transparent",
          borderRadius: "4px", fontSize: "0.8rem",
          alignItems: "center", minWidth: "480px",
        }}>
          <span
            title={row.id}
            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(row.id); }}
            style={{ color: colors.subtle, letterSpacing: "0.05em", cursor: "pointer" }}
          >
            {row.id.slice(0, 8)}
          </span>
          <span style={{
            color: row.command === "readme" ? "#818cf8" : "#fb923c",
            fontSize: "0.72rem", fontWeight: "600",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>{row.command}</span>
          <span style={{ color: colors.text, wordBreak: "break-word" }}>{row.title}</span>
          <span style={{ color: colors.subtle, fontSize: "0.72rem" }}>{formatTime(row.created_at)}</span>
        </div>
      ))}
    </div>
  );

  return null;
}