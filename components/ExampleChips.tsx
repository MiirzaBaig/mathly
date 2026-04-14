"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  { label: "x\u00B2 + 5x + 6 = 0", value: "Solve x\u00B2 + 5x + 6 = 0" },
  { label: "d/dx sin(x)\u00B7cos(x)", value: "Find the derivative of sin(x)\u00B7cos(x)" },
  { label: "\u222B 1/x dx", value: "What is the integral of 1/x dx?" },
  { label: "(3x\u00B2 + 6x) / 3x", value: "Simplify (3x\u00B2 + 6x) / 3x" },
  { label: "lim (x\u00B2-1)/(x-1)", value: "Find the limit of (x\u00B2-1)/(x-1) as x\u21921" },
  { label: "Expand (a+b)\u00B3", value: "Expand (a + b)\u00B3" },
];

interface ExampleChipsProps {
  onSelect: (value: string) => void;
}

export default function ExampleChips({ onSelect }: ExampleChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {EXAMPLES.map((ex, i) => {
        return (
          <motion.button
            key={ex.value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * i + 0.1, duration: 0.2 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(ex.value)}
            className="px-4 py-2 text-sm font-medium rounded-full"
            style={{
              color: "var(--text-primary)",
              fontFamily: "ui-monospace, 'Cascadia Code', monospace",
              fontSize: "0.82rem",
              background: "transparent",
              border: "1px solid #2a2a2e",
              transition: "background 150ms, border-color 150ms, color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a3e";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2e";
            }}
          >
            {ex.label}
          </motion.button>
        );
      })}
    </div>
  );
}
