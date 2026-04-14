"use client";

import { motion } from "framer-motion";
import DropZone from "./DropZone";
import InputBar from "./InputBar";
import ExampleChips from "./ExampleChips";

interface HeroZoneProps {
  onSubmit: (text: string, imageBase64?: string) => void;
  onExampleSelect: (text: string) => void;
  isLoading: boolean;
  isExhausted: boolean;
  onError: (msg: string) => void;
  selectedExample: string;
  onAutoSubmitDone: () => void;
}

function Subtext({ text }: { text: string }) {
  return (
    <p className="text-base sm:text-lg max-w-md mx-auto" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
      {text}
    </p>
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
  return (
    <div className="flex flex-col items-center px-4 pt-32 pb-10 min-h-dvh">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
          Snap it.{" "}
          <span
            className="relative inline-block"
            style={{
              color: "var(--accent-solid)",
            }}
          >
            Solve it.
          </span>
          {" "}Get it.
        </h1>

        <Subtext text="Photo or text. Clean steps. No fluff." />
      </motion.div>

      <div className="w-full max-w-lg relative mb-8">
        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6"
        >
          <DropZone onImage={(b64) => onSubmit("Solve this math problem", b64)} onError={onError} />
        </motion.div>

        {/* Text input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <InputBar
            onSubmit={onSubmit}
            isLoading={isLoading}
            isExhausted={isExhausted}
            onError={onError}
            defaultValue={selectedExample}
            autoSubmit={!!selectedExample}
            onAutoSubmitDone={onAutoSubmitDone}
          />
        </motion.div>
      </div>

      {/* Gradient divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.2 }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-lg"
      >
        <ExampleChips onSelect={onExampleSelect} />
      </motion.div>
    </div>
  );
}
