"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Problem } from "@/hooks/useProblemStore";
import { HINT_LADDER } from "@/lib/coachModes";
import { buildExamRescueCards } from "@/lib/examRescue";
import {
  buildPracticeSheet,
  type PracticeMode,
  type PracticeSheet,
} from "@/lib/practiceSheet";
import {
  detectMistakeSignals,
  topMistakeSignals,
  type MistakeProfile,
} from "@/lib/mistakeDna";

interface CoachSheetProps {
  problem: Problem;
  mistakeProfile: MistakeProfile;
  onFollowup: (problemId: string, text: string) => void;
}

export default function CoachSheet({ problem, mistakeProfile, onFollowup }: CoachSheetProps) {
  const [copiedRescueCard, setCopiedRescueCard] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("drill");
  const [practiceCount, setPracticeCount] = useState<5 | 10 | 20>(5);
  const [practiceSeed, setPracticeSeed] = useState(1);
  const [showAnswers, setShowAnswers] = useState(false);

  const isLocked = problem.isLoading || problem.isFollowupLoading;

  const rescueCards = buildExamRescueCards({ steps: problem.steps, ocrText: problem.ocrText });
  const practiceSheet: PracticeSheet = useMemo(
    () =>
      buildPracticeSheet(problem, {
        mode: practiceMode,
        count: practiceCount,
        seed: practiceSeed,
      }),
    [problem, practiceMode, practiceCount, practiceSeed]
  );
  const currentSignals = detectMistakeSignals({
    originalInput: problem.originalInput,
    ocrText: problem.ocrText,
    steps: problem.steps,
  });
  const topSignals = topMistakeSignals(mistakeProfile);

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedRescueCard(id);
      setTimeout(() => setCopiedRescueCard(null), 1200);
    } catch {
      setCopiedRescueCard(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card rounded-3xl p-5 sm:p-6 space-y-4"
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      {!problem.isLoading && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.22)" }}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#22d3ee" }}>
              Practice Sheet
            </h4>
            <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {practiceSheet.count} qs · {practiceSheet.targetMinutes} min target
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {(["drill", "timed", "exam"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPracticeMode(mode)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: practiceMode === mode ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.04)",
                  border: practiceMode === mode ? "1px solid rgba(34,211,238,0.45)" : "1px solid var(--border-subtle)",
                  color: practiceMode === mode ? "#67e8f9" : "var(--text-secondary)",
                }}
              >
                {mode}
              </button>
            ))}
            {[5, 10, 20].map((count) => (
              <button
                key={count}
                onClick={() => setPracticeCount(count as 5 | 10 | 20)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: practiceCount === count ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                  border: practiceCount === count ? "1px solid rgba(167,139,250,0.45)" : "1px solid var(--border-subtle)",
                  color: practiceCount === count ? "#c4b5fd" : "var(--text-secondary)",
                }}
              >
                {count}Q
              </button>
            ))}
            <button
              onClick={() => setPracticeSeed((s) => s + 1)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
            >
              reroll
            </button>
            <button
              onClick={() => setShowAnswers((v) => !v)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
            >
              {showAnswers ? "hide answers" : "show answers"}
            </button>
          </div>

          <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(9,9,11,0.45)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {practiceSheet.title}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              same topic, fresh reps. keep it clean, then speed up.
            </p>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-auto no-scrollbar pr-1">
            {practiceSheet.questions.map((question, i) => (
              <div
                key={question.id}
                className="rounded-xl p-3"
                style={{ background: "rgba(9,9,11,0.36)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="text-[11px] font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(34,211,238,0.16)", color: "#67e8f9", minWidth: 32, textAlign: "center" }}
                  >
                    Q{i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {question.prompt}
                  </p>
                </div>
                {showAnswers && (
                  <p className="text-xs mt-2 ml-10" style={{ color: "var(--text-secondary)" }}>
                    ans: {question.answer} · hint: {question.hint}
                  </p>
                )}
                <div className="mt-2 ml-10">
                  <button
                    onClick={() =>
                      onFollowup(
                        problem.id,
                        `Walk me through practice question ${i + 1}: ${question.prompt}. Keep it clear, step-by-step.`
                      )
                    }
                    disabled={isLocked}
                    className="text-[11px] px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "var(--text-secondary)",
                      opacity: isLocked ? 0.55 : 1,
                    }}
                  >
                    explain this one
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.18)" }}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-solid)" }}>
            Hint Ladder
          </h4>
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            quick help levels
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {HINT_LADDER.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onFollowup(problem.id, mode.prompt)}
              disabled={isLocked}
              className="px-3 py-2 rounded-xl text-left transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1.5px solid var(--border-subtle)",
                opacity: isLocked ? 0.55 : 1,
              }}
            >
              <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {mode.label}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)", lineHeight: 1.25 }}>
                {mode.caption}
              </div>
            </button>
          ))}
        </div>
      </div>

      {!problem.isLoading && problem.steps.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.18)" }}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-cyan)" }}>
              Exam Rescue
            </h4>
            <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              quick-save cards
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {rescueCards.map((card) => (
              <div
                key={card.id}
                className="rounded-xl p-3"
                style={{ background: "rgba(9,9,11,0.45)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    {card.title}
                  </p>
                  <button
                    onClick={() => handleCopy(card.id, card.value)}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ color: "var(--text-primary)", background: "rgba(255,255,255,0.06)" }}
                  >
                    {copiedRescueCard === card.id ? "copied" : "copy"}
                  </button>
                </div>
                <pre
                  className="text-xs whitespace-pre-wrap"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                    lineHeight: 1.5,
                  }}
                >
                  {card.value}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {(currentSignals.length > 0 || topSignals.length > 0) && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)" }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--accent-solid)" }}>
            Mistake DNA
          </h4>
          {topSignals.length > 0 && (
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
              repeat patterns in this session:
            </p>
          )}
          {topSignals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {topSignals.map((signal) => (
                <span
                  key={signal.tag}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
                >
                  {signal.label} · {signal.count}x
                </span>
              ))}
            </div>
          )}
          {currentSignals.length > 0 && (
            <ul className="space-y-1">
              {currentSignals.slice(0, 2).map((signal) => (
                <li key={signal.tag} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--text-primary)" }}>{signal.label}:</span> {signal.tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.section>
  );
}
