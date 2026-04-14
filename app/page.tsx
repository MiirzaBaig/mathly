"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import HeroZone from "@/components/HeroZone";
import ProblemCard from "@/components/ProblemCard";
import PracticeView from "@/components/PracticeView";
import ExamRescueDrawer from "@/components/ExamRescueDrawer";
import ModeSwitcher, { type AppMode } from "@/components/ModeSwitcher";
import InputBar from "@/components/InputBar";
import Toast, { type ToastData } from "@/components/Toast";
import { useProblemStore } from "@/hooks/useProblemStore";
import { useApiUsage } from "@/hooks/useApiUsage";
import { buildExamRescueCards } from "@/lib/examRescue";

let toastCounter = 0;

export default function Home() {
  const { status: usageStatus, isExhausted, increment } = useApiUsage();

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [selectedExample, setSelectedExample] = useState("");
  const [appMode, setAppMode] = useState<AppMode>("solve");

  const addToast = useCallback((message: string, type: ToastData["type"] = "error") => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const { problems, addProblem, addFollowup } = useProblemStore(
    useCallback(() => {
      if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") {
        increment();
      }
    }, [increment])
  );

  const isAnyLoading = problems.some((p) => p.isLoading);
  const hasProblems = problems.length > 0;
  const activeProblem = problems[0] ?? null;

  const rescueCards = useMemo(() => {
    if (!activeProblem || activeProblem.isLoading || activeProblem.steps.length === 0) return [];
    return buildExamRescueCards({ steps: activeProblem.steps, ocrText: activeProblem.ocrText });
  }, [activeProblem]);

  const prevStatusRef = useRef(usageStatus);
  useEffect(() => {
    if (prevStatusRef.current !== usageStatus) {
      if (usageStatus === "warning") {
        addToast("Heads up: 10 solves left on this shared key.", "warning");
      } else if (usageStatus === "danger") {
        addToast("Last 2 solves left on this shared key.", "warning");
      } else if (usageStatus === "exhausted") {
        addToast("Limit reached (75/75). Solves are disabled.", "warning");
      }
      prevStatusRef.current = usageStatus;
    }
  }, [usageStatus, addToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = useCallback(
    async (text: string, imageBase64?: string) => {
      if (isAnyLoading || isExhausted) return;
      if (!text.trim() && !imageBase64) return;
      if (isExhausted) {
        addToast("Limit reached (75/75). No solves left.", "warning");
        return;
      }
      setAppMode("solve");
      await addProblem({ text, imageBase64 });
    },
    [isAnyLoading, isExhausted, addProblem, addToast]
  );

  const handleExampleSelect = useCallback((value: string) => {
    setSelectedExample(value);
  }, []);

  const handleAutoSubmitDone = useCallback(() => {
    setSelectedExample("");
  }, []);

  const handleFollowup = useCallback(
    async (problemId: string, text: string) => {
      if (isExhausted) {
        addToast("Limit reached (75/75). No solves left.", "warning");
        return;
      }
      await addFollowup(problemId, text);
    },
    [isExhausted, addFollowup, addToast]
  );

  const handleError = useCallback(
    (msg: string) => addToast(msg, "error"),
    [addToast]
  );

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100dvh" }}>
      <div className="relative">
        <Header />

        {!hasProblems ? (
          <HeroZone
            onSubmit={handleSubmit}
            onExampleSelect={handleExampleSelect}
            isLoading={isAnyLoading}
            isExhausted={isExhausted}
            onError={handleError}
            selectedExample={selectedExample}
            onAutoSubmitDone={handleAutoSubmitDone}
          />
        ) : (
          <main className="mx-auto w-full px-4 pt-20 pb-36" style={{ maxWidth: "760px" }}>
            {/* Mode Switcher */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-9 mt-4"
            >
              <ModeSwitcher mode={appMode} onChange={setAppMode} />
            </motion.div>

            {/* Mode Content */}
            <AnimatePresence mode="wait">
              {appMode === "solve" ? (
                <motion.div
                  key="solve"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {problems.map((problem, i) => (
                      <ProblemCard
                        key={problem.id}
                        problem={problem}
                        index={problems.length - 1 - i}
                        onFollowup={handleFollowup}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <PracticeView problem={activeProblem} onFollowup={handleFollowup} onSwitchToSolve={() => setAppMode("solve")} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        )}

        {/* Sticky input bar */}
        <AnimatePresence>
          {hasProblems && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0"
              style={{ zIndex: 30 }}
            >
              <div
                className="mx-auto px-4 py-3"
                style={{
                  maxWidth: "760px",
                  background: "linear-gradient(180deg, rgba(8,10,16,0.9), rgba(7,9,14,0.82))",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  borderTop: "1px solid rgba(255,255,255,0.11)",
                }}
              >
                <InputBar
                  onSubmit={handleSubmit}
                  isLoading={isAnyLoading}
                  isExhausted={isExhausted}
                  onError={handleError}
                  compact
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Exam Rescue (only in solve mode with a solution) */}
        {appMode === "solve" && <ExamRescueDrawer cards={rescueCards} />}
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
