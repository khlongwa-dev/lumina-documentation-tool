import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import TerminalLine from "./TerminalLine";

export default function Terminal({ lines }) {
  const { density } = useTheme();
  const bottomRef = useRef(null);
  const prevLen = useRef(lines.length);

  useEffect(() => {
    if (lines.length > prevLen.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLen.current = lines.length;
  }, [lines.length]);

  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: density === "compact" ? "0.6rem 1rem" : "1rem 1.5rem",
      paddingBottom: "1.5rem",
    }}>
      {lines.map((entry, i) => (
        <TerminalLine key={i} entry={entry} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}