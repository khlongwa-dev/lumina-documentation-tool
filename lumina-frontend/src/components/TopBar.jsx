import { useRef, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import SettingsPanel from "./SettingsPanel";

export default function TopBar() {
  const { colors } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.6rem 1.25rem",
      borderBottom: `1px solid ${colors.barBorder}`,
      background: colors.barBg,
      backdropFilter: "blur(8px)",
      flexShrink: 0,
      position: "relative",
      zIndex: 20,
    }}>
      {/* Left — window dots + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => (
            <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: colors.faint, fontSize: "0.75rem" }}>─────</span>
        <span style={{ color: colors.prompt, fontSize: "0.78rem", fontWeight: "700", letterSpacing: "0.2em" }}>
          LUMINA
        </span>
        <span style={{ color: colors.barBorder, fontSize: "0.72rem" }}>v1.0.0</span>
      </div>

      {/* Right — settings */}
      <div ref={settingsRef} style={{ position: "relative" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setSettingsOpen(o => !o); }}
          style={{
            background: settingsOpen ? colors.altRow : "transparent",
            border: `1px solid ${settingsOpen ? colors.faint : colors.barBorder}`,
            color: colors.muted,
            padding: "0.3rem 0.75rem",
            borderRadius: "5px",
            fontSize: "0.78rem",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "0.08em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.15s",
          }}
        >
          <span>⚙</span>
          <span>settings</span>
        </button>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </div>
    </div>
  );
}