"use client";

import { motion } from "framer-motion";

export type AppMode = "solve" | "practice";

interface ModeSwitcherProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div
      className="inline-flex items-center p-1 rounded-full"
      style={{
        background: "transparent",
        border: "1px solid #2a2a2e",
        boxShadow: "none",
      }}
    >
      {(["solve", "practice"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="relative px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full transition-colors"
          style={{
            color: mode === m ? "white" : "var(--text-muted)",
            zIndex: 1,
          }}
        >
          {mode === m && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 rounded-full"
              style={{
                background: "var(--accent-solid)",
                boxShadow: "none",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{m}</span>
        </button>
      ))}
    </div>
  );
}
