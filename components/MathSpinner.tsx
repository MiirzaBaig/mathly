"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SYMBOLS = ["÷", "×", "+", "=", "∫", "Σ"];
const PHRASES = ["crunching numbers...", "doing the math...", "working through it...", "almost there..."];

interface MathSpinnerProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function MathSpinner({ size = "md", showText = false }: MathSpinnerProps) {
  const [symbolIndex, setSymbolIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSymbolIndex((i) => (i + 1) % SYMBOLS.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showText) return;
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [showText]);

  const dim = size === "sm" ? 20 : size === "md" ? 32 : 48;
  const fontSize = size === "sm" ? "0.7rem" : size === "md" ? "1rem" : "1.5rem";
  const ringSize = dim + 8;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        {/* Gradient ring that rotates */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 60%, #8b5cf6 80%, #06b6d4 95%, transparent 100%)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center symbol */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={symbolIndex}
              initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize,
                fontWeight: 700,
                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "var(--font-display)",
              }}
            >
              {SYMBOLS[symbolIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Animated phrases */}
      {showText && (
        <div className="h-5 overflow-hidden relative" style={{ minWidth: 160 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="text-xs text-center absolute inset-0"
              style={{ color: "var(--text-secondary)" }}
            >
              {PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Inline spinner for buttons / small contexts.
 * Thin gradient ring only, no symbol morph.
 */
export function InlineSpinner({ size = 16 }: { size?: number }) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "conic-gradient(from 0deg, transparent 60%, #8b5cf6 80%, #06b6d4 95%, transparent 100%)",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
