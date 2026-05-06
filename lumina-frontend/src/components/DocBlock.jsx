import { useTheme } from "../context/ThemeContext";
import CopyButton from "./CopyButton";
import FeedbackButtons from "./FeedbackButtons";

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DocBlock({ meta }) {
  const { colors } = useTheme();

  return (
    <div style={{
      marginBottom: "0.5rem",
      background: colors.docBg,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 0.85rem",
        background: colors.docHeader,
        borderBottom: `1px solid ${colors.border}`,
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: colors.prompt, fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em" }}>
            {meta.command?.toUpperCase()} OUTPUT
          </span>
          {meta.tokens_used && <>
            <span style={{ color: colors.faint }}>·</span>
            <span style={{ color: colors.subtle, fontSize: "0.72rem" }}>{meta.tokens_used} tokens</span>
          </>}
          {meta.gen_time_ms && <>
            <span style={{ color: colors.faint }}>·</span>
            <span style={{ color: colors.subtle, fontSize: "0.72rem" }}>{(meta.gen_time_ms / 1000).toFixed(2)}s</span>
          </>}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <FeedbackButtons />
          <CopyButton text={meta.output || ""} />
        </div>
      </div>

      {/* Output content */}
      <div style={{
        padding: "1rem",
        color: colors.muted,
        whiteSpace: "pre-wrap",
        fontSize: "0.82rem",
        lineHeight: "1.75",
        overflowX: "auto",
        touchAction: "pan-x",
      }}>
        {meta.output}
      </div>
    </div>
  );
}

export { formatTime };