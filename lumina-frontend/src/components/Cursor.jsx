import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Cursor() {
  const [on, setOn] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <span style={{
      display: "inline-block",
      width: "0.5em",
      height: "1em",
      background: on ? colors.prompt : "transparent",
      verticalAlign: "middle",
      transition: "background 0.08s",
      flexShrink: 0,
    }} />
  );
}