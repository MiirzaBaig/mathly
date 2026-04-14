"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DropZone from "./DropZone";
import InputBar from "./InputBar";
import ExampleChips from "./ExampleChips";
import DrawPad from "./DrawPad";

interface HeroZoneProps {
  onSubmit: (text: string, imageBase64?: string) => void;
  onExampleSelect: (text: string) => void;
  isLoading: boolean;
  isExhausted: boolean;
  onError: (msg: string) => void;
  selectedExample: string;
  onAutoSubmitDone: () => void;
}

const blurUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function Subtext({ text }: { text: string }) {
  return (
    <motion.p
      variants={blurUp}
      className="text-base sm:text-lg max-w-md mx-auto"
      style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}
    >
      {text}
    </motion.p>
  );
}

// Small sketch star doodle
function SketchStar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.2, duration: 0.4, type: "spring" }}
      className="absolute hidden sm:block"
      style={{ left: "-40px", top: "10px" }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <motion.path
          d="M10 2 L11.5 7.5 L17 8 L12.5 11.5 L14 17 L10 13.5 L6 17 L7.5 11.5 L3 8 L8.5 7.5 Z"
          stroke="rgba(6,182,212,0.35)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

export default function HeroZone({
  onSubmit,
  onExampleSelect,
  isLoading,
  isExhausted,
  onError,
  selectedExample,
  onAutoSubmitDone,
}: HeroZoneProps) {
  const [inputMode, setInputMode] = useState<"photo" | "draw">("photo");

  return (
    <div className="flex flex-col items-center px-4 pt-32 pb-10 min-h-dvh">
      {/* Headline */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
        }}
        className="text-center mb-12 relative"
      >
        <h1
          className="font-bold mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.75rem, 7.5vw, 4.5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {["Snap it.", "Solve it.", "Get it."].map((word, i) => (
            <motion.span
              key={i}
              variants={blurUp}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block"
              style={i === 1 ? { color: "var(--accent-solid)" } : undefined}
            >
              {word}
              {i < 2 && "\u00A0"}
            </motion.span>
          ))}
        </h1>

        <Subtext text="Photo or text. Clean steps. No fluff." />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg relative mb-8"
      >
        {/* Input mode */}
        <div className="flex justify-center mb-4">
          <div
            className="inline-flex items-center p-1 rounded-full"
            style={{
              background: "transparent",
              border: "1px solid #2a2a2e",
              boxShadow: "none",
            }}
          >
            {([
              ["photo", "PHOTO"],
              ["draw", "DRAW"],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setInputMode(mode)}
                className="relative px-4 sm:px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full transition-colors"
                style={{
                  color: inputMode === mode ? "white" : "var(--text-muted)",
                  zIndex: 1,
                }}
              >
                {inputMode === mode && (
                  <motion.div
                    layoutId="hero-mode-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--accent-solid)", boxShadow: "none" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo / Draw content */}
        <AnimatePresence mode="wait" initial={false}>
          {inputMode === "photo" ? (
            <motion.div
              key="photo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-6"
            >
              <DropZone onImage={(b64) => onSubmit("Solve this math problem", b64)} onError={onError} />
            </motion.div>
          ) : (
            <motion.div
              key="draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-6"
            >
              <DrawPad
                disabled={isLoading || isExhausted}
                onError={onError}
                onSubmitImage={(b64) => onSubmit("Solve this math problem", b64)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text input */}
        <div>
          <InputBar
            onSubmit={onSubmit}
            isLoading={isLoading}
            isExhausted={isExhausted}
            onError={onError}
            defaultValue={selectedExample}
            autoSubmit={!!selectedExample}
            onAutoSubmitDone={onAutoSubmitDone}
          />
        </div>
      </motion.div>

      {/* Gradient divider */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-3 w-full max-w-lg mb-6"
      >
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-subtle)" }}
        />
        <span className="text-xs" style={{ color: "var(--text-muted)", letterSpacing: "0.04em" }}>or try one of these</span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-subtle)" }}
        />
      </motion.div>

      {/* Example chips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg"
      >
        <ExampleChips onSelect={onExampleSelect} />
      </motion.div>
    </div>
  );
}
