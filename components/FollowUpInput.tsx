"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InlineSpinner } from "./MathSpinner";

interface FollowUpInputProps {
  problemId: string;
  onSubmit: (problemId: string, text: string) => void;
  isLoading: boolean;
}

export default function FollowUpInput({ problemId, onSubmit, isLoading }: FollowUpInputProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSubmit(problemId, trimmed);
    setText("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setOpen(false);
      setText("");
    }
  };

  return (
    <div
      className="mt-7 p-4 sm:p-5 rounded-2xl followup-shell"
      style={{
        border: "1.5px dashed rgba(139,92,246,0.38)",
        background: "linear-gradient(180deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))",
      }}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="toggle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOpen}
            className="flex items-center gap-2 text-sm transition-colors px-3 py-2 rounded-xl"
            style={{
              color: "var(--text-secondary)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 4v4M7 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="hover:text-purple-400 transition-colors">still confused? ask a follow-up</span>
          </motion.button>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="what's not clicking?"
                disabled={isLoading}
                className="math-input flex-1 px-4 py-3 text-sm"
              />
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || isLoading}
                className="btn-gradient px-5 py-3 text-sm font-semibold"
                style={{ minWidth: "88px", borderRadius: "14px" }}
              >
                {isLoading ? (
                  <div className="flex justify-center"><InlineSpinner size={16} /></div>
                ) : (
                  "Ask"
                )}
              </button>
              <button
                onClick={() => { setOpen(false); setText(""); }}
                className="px-3 py-3 rounded-xl text-sm transition-colors"
                style={{ color: "var(--text-secondary)", background: "var(--bg-card)", border: "1.5px solid var(--border-subtle)" }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
