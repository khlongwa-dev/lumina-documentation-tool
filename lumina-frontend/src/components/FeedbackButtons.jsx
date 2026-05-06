import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function FeedbackButtons() {
  const [vote, setVote] = useState(null);
  const { colors } = useTheme();

  return (
    <div style={{ display: "flex", gap: "0.35rem" }}>
      {[["👍", "up"], ["👎", "down"]].map(([emoji, val]) => (
        <button
          key={val}
          onClick={(e) => { e.stopPropagation(); setVote(vote === val ? null : val); }}
          style={{
            background: vote === val ? colors.altRow : "transparent",
            border: `1px solid ${vote === val ? colors.faint : colors.border}`,
            borderRadius: "4px",
            padding: "0.2rem 0.45rem",
            fontSize: "0.78rem",
            cursor: "pointer",
            opacity: vote && vote !== val ? 0.3 : 1,
            transition: "all 0.15s",
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}