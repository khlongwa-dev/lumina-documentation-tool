import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const { colors } = useTheme();

  const handle = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handle} style={{
      background: "transparent",
      border: `1px solid ${colors.border}`,
      color: copied ? colors.prompt : colors.subtle,
      padding: "0.2rem 0.6rem",
      borderRadius: "4px",
      fontSize: "0.72rem",
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.05em",
      transition: "all 0.15s",
      flexShrink: 0,
    }}>
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}