"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePreview from "./ImagePreview";
import SolutionStep from "./SolutionStep";
import FollowUpInput from "./FollowUpInput";
import SkeletonLoader from "./SkeletonLoader";
import type { Problem } from "@/hooks/useProblemStore";

interface ProblemCardProps {
  problem: Problem;
  index: number;
  onFollowup: (id: string, text: string) => void;
}

export default function ProblemCard({ problem, index, onFollowup }: ProblemCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  const hasImage = !!problem.originalImage;
  const hasError = !!problem.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card rounded-3xl overflow-hidden"
    >
      {/* Card Header */}
      <div
        className="flex items-start gap-4 p-5 sm:p-6 cursor-pointer select-none"
        style={{ borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.11)" }}
        onClick={() => !problem.isLoading && setCollapsed((c) => !c)}
      >
        {/* Problem number badge */}
        <div
          className="flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: 999,
            background: "var(--accent-solid)",
            color: "white",
            fontFamily: "var(--font-display)",
          }}
        >
          {index + 1}
        </div>

        {/* Problem content */}
        <div className="flex-1 min-w-0">
          {hasImage && !problem.isLoading && (
            <ImagePreview
              src={`data:image/jpeg;base64,${problem.originalImage}`}
              ocrText={problem.ocrText}
            />
          )}
          {!hasImage && problem.originalInput && (
            <p
              className="text-base leading-relaxed"
              style={{
                color: "var(--text-primary)",
                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
              }}
            >
              {problem.originalInput}
            </p>
          )}
          {problem.isLoading && (
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              thinking...
            </p>
          )}
        </div>

        {/* Collapse toggle */}
        {!problem.isLoading && (
          <motion.div
            animate={{ rotate: collapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </div>

      {/* Card Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4">
              {/* Loading skeleton */}
              {problem.isLoading && (
                <div className="pt-4">
                  <SkeletonLoader />
                </div>
              )}

              {/* Error state */}
              {hasError && !problem.isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 p-4 rounded-xl mt-4"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }}>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm" style={{ color: "#f87171" }}>{problem.error}</p>
                </motion.div>
              )}

              {/* Solution steps */}
              {!problem.isLoading && problem.steps.length > 0 && (
                <div className="space-y-0 pt-5">
                  {problem.steps.map((step, i) => (
                    <SolutionStep
                      key={`${step.id}-${i}`}
                      step={step}
                      index={i}
                      total={problem.steps.length}
                      isFollowup={step.id.startsWith("followup")}
                    />
                  ))}

                  {/* Follow-up loading indicator */}
                  {problem.isFollowupLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--accent-cyan)" }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        hold on, thinking...
                      </span>
                    </motion.div>
                  )}

                  {/* Follow-up input */}
                  {!problem.isLoading && (
                    <FollowUpInput
                      problemId={problem.id}
                      onSubmit={onFollowup}
                      isLoading={problem.isFollowupLoading}
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
