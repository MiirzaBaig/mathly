"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
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

type StepSpeakTab = "why" | "move" | "check";

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

function detectMoveLabel(title: string, content: string) {
  const t = `${title}\n${content}`.toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/complete the square|completing the square/, "complete the square"],
    [/zero product|product property/, "zero‑product rule"],
    [/factor|factoring|factored/, "factor"],
    [/expand|expansion|distribute|distributing/, "distribute"],
    [/simplify|reduce|cancel|cancelling/, "simplify"],
    [/substitute|plug in|replace/, "substitute"],
    [/rearrange|isolate|solve for|set .* equal/, "isolate the variable"],
    [/differentiate|derivative|product rule/, "product rule"],
    [/chain rule/, "chain rule"],
    [/quotient rule/, "quotient rule"],
    [/integrate|integral/, "integrate"],
    [/combine like terms|like terms/, "combine like terms"],
    [/common factor|gcf|greatest common factor/, "pull out a common factor"],
    [/identity|double angle|trig/, "use an identity"],
    [/limit|as x \\to|x \\to/, "simplify the limit"],
  ];
  for (const [re, label] of rules) {
    if (re.test(t)) return label;
  }
  return "next move";
}

function firstDisplayMath(markdown: string) {
  const m = markdown.match(/\$\$([\s\S]*?)\$\$/);
  if (!m) return null;
  const inner = (m[1] ?? "").trim();
  return inner ? `$$${inner}$$` : null;
}

function buildStepSpeak(title: string, content: string) {
  const move = detectMoveLabel(title, content);
  const math = firstDisplayMath(content);

  const whyMap: Record<string, string> = {
    factor: "Factoring rewrites the expression into a product, which makes solving (or simplifying) much easier.",
    "complete the square": "Completing the square rewrites a quadratic into a form where the solution is visible.",
    distribute: "Distributing removes parentheses so you can combine terms and simplify cleanly.",
    simplify: "Simplifying reduces clutter so the next step is obvious and less error‑prone.",
    substitute: "Substitution lets you work with a simpler expression while keeping the problem equivalent.",
    "isolate the variable": "Isolating the variable puts the unknown by itself so you can read the answer.",
    "zero‑product rule": "If a product is zero, at least one factor must be zero — that’s how we get solutions fast.",
    integrate: "Integration reverses differentiation to recover an original function (plus \(C\)).",
    "product rule": "The product rule handles derivatives of multiplied functions without expanding first.",
    "chain rule": "The chain rule is how you differentiate a function inside another function.",
    "quotient rule": "The quotient rule differentiates a fraction without rewriting it first.",
    "combine like terms": "Combining like terms keeps the expression minimal and comparable.",
    "pull out a common factor": "Pulling out a common factor reveals structure you can cancel or solve with.",
    "use an identity": "An identity swaps the expression into an equivalent form that simplifies better.",
    "simplify the limit": "We simplify first to remove the indeterminate form before substituting.",
    "next move": "This step keeps the math equivalent, but puts it into a form that’s easier to finish.",
  };

  const check =
    move === "factor" || move === "zero‑product rule" || move === "isolate the variable"
      ? "Quick check: plug the solution(s) back into the original equation — it should balance."
      : move === "integrate"
      ? "Quick check: differentiate your result — you should get the original integrand."
      : move === "product rule" || move === "chain rule" || move === "quotient rule"
      ? "Quick check: differentiate one more time mentally or compare to a known identity to see if it matches."
      : "Quick check: expand/simplify both versions — they should match exactly.";

  return {
    move,
    why: whyMap[move] ?? whyMap["next move"],
    check,
    math,
  };
}

export default function SolutionStep({ step, index, total, isFollowup }: SolutionStepProps) {
  const accentColor = "var(--accent-solid)";
  const previousAccent = "var(--accent-solid)";
  const [open, setOpen] = useState<StepSpeakTab | null>(null);

  const stepSpeak = useMemo(() => buildStepSpeak(step.title, step.content), [step.title, step.content]);

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

        <div className="p-5 sm:p-6 pl-6 sm:pl-7">
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

          {/* StepSpeak */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2">
              {([
                ["why", "Why"],
                ["move", "Move"],
                ["check", "Check"],
              ] as const).map(([key, label]) => {
                const active = open === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setOpen((v) => (v === key ? null : key))}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
                    style={{
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      border: "1px solid var(--border-subtle)",
                      background: active ? "rgba(139,92,246,0.16)" : "transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {open && (
              <div
                className="mt-3 rounded-xl px-4 py-3"
                style={{
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card-hover)",
                }}
              >
                {open === "move" && (
                  <div className="text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--accent-solid)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                      {stepSpeak.move}
                    </span>
                    {stepSpeak.math ? (
                      <span style={{ color: "var(--text-secondary)" }}> · seen in {stepSpeak.math}</span>
                    ) : (
                      <span style={{ color: "var(--text-secondary)" }}> · this is the rule/idea behind the step</span>
                    )}
                  </div>
                )}
                {open === "why" && (
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {stepSpeak.why}
                  </p>
                )}
                {open === "check" && (
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
                    {stepSpeak.check}
                  </p>
                )}
              </div>
            )}
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
