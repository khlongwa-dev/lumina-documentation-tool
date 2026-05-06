import { useTheme } from "../context/ThemeContext";

function Opt({ active, onClick, children }) {
  const { colors } = useTheme();
  return (
    <button onClick={onClick} style={{
      background: active ? colors.altRow : "transparent",
      border: `1px solid ${active ? colors.faint : colors.border}`,
      color: active ? colors.text : colors.subtle,
      padding: "0.3rem 0.75rem", borderRadius: "4px",
      fontSize: "0.78rem", cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    }}>{children}</button>
  );
}

export default function SettingsPanel({ onClose }) {
  const { colors, isDark, theme, setTheme, font, setFont, density, setDensity } = useTheme();

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 0.5rem)", right: 0,
      background: isDark ? "#0f172a" : "#ffffff",
      border: `1px solid ${colors.border}`,
      borderRadius: "8px", padding: "1rem",
      zIndex: 100, minWidth: "240px",
      boxShadow: colors.shadow,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ color: colors.text, fontSize: "0.82rem", fontWeight: "600", letterSpacing: "0.1em" }}>
          SETTINGS
        </span>
        <button onClick={onClose} style={{
          background: "transparent", border: "none",
          color: colors.subtle, cursor: "pointer", fontSize: "1rem",
        }}>✕</button>
      </div>

      {/* Theme */}
      <div style={{ marginBottom: "0.85rem" }}>
        <div style={{ color: colors.subtle, fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>THEME</div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <Opt active={theme === "dark"} onClick={() => setTheme("dark")}>dark</Opt>
          <Opt active={theme === "light"} onClick={() => setTheme("light")}>light</Opt>
        </div>
      </div>

      {/* Font */}
      <div style={{ marginBottom: "0.85rem" }}>
        <div style={{ color: colors.subtle, fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>FONT</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {["mono", "sans", "serif"].map(f => (
            <Opt key={f} active={font === f} onClick={() => setFont(f)}>{f}</Opt>
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <div style={{ color: colors.subtle, fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>VIEW</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <Opt active={density === "compact"} onClick={() => setDensity("compact")}>compact</Opt>
          <Opt active={density === "comfortable"} onClick={() => setDensity("comfortable")}>comfortable</Opt>
        </div>
      </div>
    </div>
  );
}