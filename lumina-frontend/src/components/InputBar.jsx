import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function InputBar({ inputRef, value, onChange, onKeyDown, mode, awaitingInput }) {
  const { colors } = useTheme();

  // Auto-expand textarea height based on content
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div style={{
      flexShrink: 0,
      padding: "0.75rem 1.25rem",
      background: colors.barBg,
      borderTop: `1px solid ${colors.barBorder}`,
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.5rem",
    }}>
      {/* Prompt label — aligned to top so it stays put as textarea grows */}
      <span style={{
        color: colors.prompt,
        flexShrink: 0,
        userSelect: "none",
        paddingTop: "0.1rem",
        lineHeight: "1.5",
      }}>
        lumina ❯
      </span>

      {/* Textarea — expands with content, scrolls after max height */}
      <textarea
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={awaitingInput ? `paste your ${mode} input here...` : "type a command..."}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          color: colors.text,
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "1.5",
          caretColor: colors.prompt, // native caret styled green — blinking follows cursor naturally
          minWidth: 0,
          minHeight: "1.5em",
          maxHeight: "10rem",
          overflowY: "auto",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      />

      {awaitingInput && (
        <span style={{
          color: colors.faint,
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          flexShrink: 0,
          paddingTop: "0.15rem",
        }}>
          {mode?.toUpperCase()} MODE
        </span>
      )}
    </div>
  );
}