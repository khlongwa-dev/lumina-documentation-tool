import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [font, setFont] = useState("mono");
  const [density, setDensity] = useState("comfortable");

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#020817" : "#f8fafc",
    barBg: isDark ? "rgba(2,8,23,0.97)" : "rgba(248,250,252,0.97)",
    barBorder: isDark ? "#0f172a" : "#e2e8f0",
    border: isDark ? "#1e293b" : "#e2e8f0",
    text: isDark ? "#e2e8f0" : "#1e293b",
    muted: isDark ? "#94a3b8" : "#64748b",
    subtle: isDark ? "#475569" : "#94a3b8",
    faint: isDark ? "#334155" : "#cbd5e1",
    prompt: isDark ? "#4ade80" : "#16a34a",
    altRow: isDark ? "#0f172a" : "#f1f5f9",
    docBg: isDark ? "#0a0f1a" : "#f8fafc",
    docHeader: isDark ? "#0f172a" : "#f1f5f9",
    shadow: isDark ? "0 20px 40px rgba(0,0,0,0.6)" : "0 20px 40px rgba(0,0,0,0.1)",
  };

  const fonts = {
    mono: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
    sans: "'IBM Plex Sans',system-ui,sans-serif",
    serif: "'Courier New',monospace",
  };

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      font, setFont,
      density, setDensity,
      isDark, colors,
      fontFamily: fonts[font],
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);