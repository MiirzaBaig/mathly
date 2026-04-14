"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExamRescueCard } from "@/lib/examRescue";

interface ExamRescueDrawerProps {
  cards: ExamRescueCard[];
}

export default function ExamRescueDrawer({ cards }: ExamRescueDrawerProps) {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (card: ExamRescueCard) => {
    try {
      await navigator.clipboard.writeText(card.value);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  };

  if (cards.length === 0) return null;

  return (
    <>
      {/* Floating action button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed z-40 flex items-center justify-center rounded-full"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 96px)",
          right: "calc(env(safe-area-inset-right) + 16px)",
          width: 52,
          height: 52,
          background: "var(--accent-solid)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.42)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        title="Exam Rescue"
        aria-label="Open exam rescue tools"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </motion.button>

      {/* Drawer overlay + panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
              style={{
                background: "linear-gradient(180deg, rgba(15,15,17,0.98), rgba(9,9,11,0.99))",
                borderTop: "1px solid rgba(255,255,255,0.12)",
                maxHeight: "70vh",
              }}
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
                  >
                    Exam Rescue
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    quick-save cards
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>

              {/* Cards */}
              <div className="px-6 pb-8 space-y-3 overflow-auto" style={{ maxHeight: "calc(70vh - 100px)" }}>
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        {card.title}
                      </span>
                      <button
                        onClick={() => handleCopy(card)}
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                        style={{
                          background: copiedId === card.id ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                          color: copiedId === card.id ? "#22c55e" : "var(--text-primary)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {copiedId === card.id ? "copied!" : "copy"}
                      </button>
                    </div>
                    <pre
                      className="text-sm whitespace-pre-wrap leading-relaxed"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                      }}
                    >
                      {card.value}
                    </pre>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
