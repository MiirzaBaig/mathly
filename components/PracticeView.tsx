"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Problem } from "@/hooks/useProblemStore";
import {
  buildPracticeSheet,
  type PracticeMode,
  type PracticeSheet,
} from "@/lib/practiceSheet";

interface PracticeViewProps {
  problem: Problem | null;
  onFollowup: (problemId: string, text: string) => void;
  onSwitchToSolve: () => void;
}

export default function PracticeView({ problem, onFollowup, onSwitchToSolve }: PracticeViewProps) {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("drill");
  const [practiceCount, setPracticeCount] = useState<5 | 10 | 20>(5);
  const [practiceSeed, setPracticeSeed] = useState(1);
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const isLocked = !problem || problem.isLoading || problem.isFollowupLoading;

  const practiceSheet: PracticeSheet | null = useMemo(() => {
    if (!problem) return null;
    return buildPracticeSheet(problem, {
      mode: practiceMode,
      count: practiceCount,
      seed: practiceSeed,
    });
  }, [problem, practiceMode, practiceCount, practiceSeed]);

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <path d="M9 12h6M9 16h6" />
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
        >
          No problem yet
        </h3>
        <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
          Solve a problem first in SOLVE mode, then come back here to practice similar questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
          >
            {practiceSheet?.title ?? "Practice"}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {practiceSheet?.count} questions · {practiceSheet?.targetMinutes} min target
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2.5">
          {(["drill", "timed", "exam"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPracticeMode(mode)}
              className="relative px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] transition-all overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid var(--border-subtle)",
                color: practiceMode === mode ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {practiceMode === mode && (
                <motion.div
                  layoutId="practice-mode-pill"
                  className="absolute inset-0"
                  style={{ background: "rgba(139,92,246,0.16)" }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Count + Actions */}
      <div className="flex flex-wrap gap-2.5">
        {[5, 10, 20].map((count) => (
          <button
            key={count}
            onClick={() => setPracticeCount(count as 5 | 10 | 20)}
            className="relative px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid var(--border-subtle)",
              color: practiceCount === count ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {practiceCount === count && (
              <motion.div
                layoutId="practice-count-pill"
                className="absolute inset-0"
                style={{ background: "rgba(139,92,246,0.14)" }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{count}Q</span>
          </button>
        ))}
        <button
          onClick={() => setPracticeSeed((s) => s + 1)}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        >
          🎲 reroll
        </button>
        <button
          onClick={() => setShowAnswers((v) => !v)}
          className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
          style={{
            background: showAnswers ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
            border: showAnswers ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border-subtle)",
            color: showAnswers ? "#22c55e" : "var(--text-primary)",
          }}
        >
          {showAnswers ? "✓ answers shown" : "show answers"}
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {practiceSheet?.questions.map((question, i) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedQ(expandedQ === question.id ? null : question.id)}
                className="w-full flex items-start gap-3 p-4 text-left"
              >
                <span
                  className="text-xs font-bold px-2.5 py-1.5 rounded-xl flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6d28d9, #2563eb 55%, #06b6d4)",
                    color: "white",
                    minWidth: 36,
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)", fontFamily: "ui-monospace, monospace" }}
                  >
                    {question.prompt}
                  </p>
                  {showAnswers && (
                    <p className="text-xs mt-2" style={{ color: "var(--accent-cyan)" }}>
                      → {question.answer}
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: expandedQ === question.id ? 180 : 0 }}
                  className="flex-shrink-0 mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedQ === question.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-4 pb-4 pt-0 space-y-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="pt-3">
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>hint</p>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{question.hint}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (!isLocked && problem) {
                            onFollowup(
                              problem.id,
                              `Walk me through: ${question.prompt}. Step-by-step, keep it clear.`
                            );
                            onSwitchToSolve();
                          }
                        }}
                        disabled={isLocked}
                        className="text-xs px-4 py-2 rounded-xl font-semibold transition-all"
                        style={{
                          background: isLocked ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, #6d28d9, #2563eb 55%, #06b6d4)",
                          color: isLocked ? "var(--text-muted)" : "white",
                          opacity: isLocked ? 0.5 : 1,
                          boxShadow: isLocked ? "none" : "0 8px 18px rgba(37,99,235,0.28)",
                        }}
                      >
                        explain this one
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
