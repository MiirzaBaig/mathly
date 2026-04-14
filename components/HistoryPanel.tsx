"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HistorySession } from "@/lib/history";
import { relativeTime } from "@/lib/history";

interface HistoryPanelProps {
  open: boolean;
  sessions: HistorySession[];
  activeId: string | null;
  onClose: () => void;
  onRestore: (session: HistorySession) => void;
  onDelete: (sessionId: string) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({
  open,
  sessions,
  activeId,
  onClose,
  onRestore,
  onDelete,
  onClearAll,
}: HistoryPanelProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => `${s.originalInput ?? ""} ${s.ocrText ?? ""}`.toLowerCase().includes(q));
  }, [sessions, query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="history-backdrop"
            aria-label="Close history panel"
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.42)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            key="history-panel"
            className="fixed top-0 right-0 z-[55] h-dvh w-full sm:max-w-[390px]"
            style={{
              background: "linear-gradient(180deg, rgba(20,20,23,0.98), rgba(15,15,18,0.98))",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              boxShadow: "-20px 0 48px rgba(0,0,0,0.45)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-full flex flex-col">
              <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                    your solves
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg text-sm"
                    style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  brain dump archive
                </p>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="search solves..."
                  className="math-input w-full mt-3 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex-1 overflow-auto no-scrollbar px-3 py-2">
                {filtered.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div
                      className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      nothing here yet, go solve something.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filtered.map((session) => {
                      const title = session.ocrText || session.originalInput || "Untitled solve";
                      const preview = title.length > 60 ? `${title.slice(0, 60)}...` : title;
                      const active = activeId === session.id;

                      return (
                        <div
                          key={session.id}
                          onClick={() => onRestore(session)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRestore(session);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="w-full text-left p-3 rounded-xl relative cursor-pointer"
                          style={{
                            background: active ? "rgba(139,92,246,0.14)" : "rgba(255,255,255,0.02)",
                            border: active ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {active && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-2 bottom-2 w-1 rounded-r"
                              style={{ background: "var(--accent-gradient)" }}
                            />
                          )}
                          <div className="flex items-start gap-3">
                            {session.imageThumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`data:image/jpeg;base64,${session.imageThumbnail}`}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
                              >
                                #
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                                {preview}
                              </p>
                              <p className="text-[11px] mt-1" style={{ color: "var(--text-secondary)" }}>
                                {relativeTime(session.timestamp)}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(session.id);
                              }}
                              className="text-xs px-2 py-1 rounded-md"
                              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                            >
                              del
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {sessions.length} solves
                </p>
                <button
                  onClick={onClearAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.26)" }}
                >
                  clear all
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
