"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { SolutionStep as Step } from "@/lib/parseSteps";

interface SolutionStepProps {
  step: Step;
  index: number;
  total: number;
  isFollowup?: boolean;
}

function mixColor(start: [number, number, number], end: [number, number, number], t: number) {
  const clampT = Math.max(0, Math.min(1, t));
  const [r1, g1, b1] = start;
  const [r2, g2, b2] = end;
  const r = Math.round(r1 + (r2 - r1) * clampT);
  const g = Math.round(g1 + (g2 - g1) * clampT);
  const b = Math.round(b1 + (b2 - b1) * clampT);
  return `rgb(${r}, ${g}, ${b})`;
}

// Progress-based accent color: violet -> cyan
function getAccentColor(index: number, total: number, isFollowup: boolean) {
  if (isFollowup) return "var(--accent-cyan)";
  if (total <= 1) return "rgb(139, 92, 246)";
  const t = index / Math.max(1, total - 1);
  return mixColor([139, 92, 246], [6, 182, 212], t);
}

export default function SolutionStep({ step, index, total, isFollowup }: SolutionStepProps) {
  const accentColor = "var(--accent-solid)";
  const previousAccent = "var(--accent-solid)";

  const firstCardDelay = 0.02;
  const cardDuration = 0.3;
  const connectorDuration = 0.15;
  const connectorLag = 0.03;

  const cardDelay =
    index === 0
      ? firstCardDelay
      : (index - 1) * (cardDuration + connectorDuration + connectorLag) +
        firstCardDelay +
        cardDuration +
        connectorDuration +
        connectorLag;
  const connectorDelay =
    index === 0
      ? 0
      : (index - 1) * (cardDuration + connectorDuration + connectorLag) +
        firstCardDelay +
        cardDuration +
        0.02;

  return (
    <div className="relative pb-3">
      {/* Flow connector line between cards */}
      {index > 0 && (
        <div className="flow-connector">
          <motion.div
            className="flow-connector-line"
            style={{
              background: "#2a2a2e",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: connectorDelay, duration: connectorDuration, ease: "easeOut" }}
          />
          <motion.div
            className="flow-connector-node flow-connector-node-bottom"
            style={{ background: accentColor }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: connectorDelay + connectorDuration - 0.02, duration: 0.2 }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: cardDuration,
          delay: cardDelay,
          ease: "easeOut",
        }}
        className="solution-card rounded-3xl relative overflow-hidden"
        style={{
          background: isFollowup ? "var(--bg-card-hover)" : "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
        }}
      >
        {/* Left accent bar — thick */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-r-sm"
          style={{
            width: "5px",
            background: "var(--accent-solid)",
            borderRadius: "0",
          }}
        />

        <div className="p-6 pl-7">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-5">
            {/* Step number badge — chunky */}
            <div
              className="flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: "var(--accent-solid)",
                fontSize: "0.9rem",
                fontFamily: "var(--font-display)",
              }}
            >
              {isFollowup ? "\u21A9" : index + 1}
            </div>
            <h3
              className="font-bold"
              style={{
                color: "var(--accent-solid)",
                letterSpacing: "-0.01em",
                fontSize: "1.05rem",
                fontFamily: "var(--font-display)",
                paddingLeft: 6,
                lineHeight: 1.25,
              }}
            >
              {step.title}
            </h3>
          </div>

          {/* Step content */}
          <div className="math-content">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {step.content}
            </ReactMarkdown>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
