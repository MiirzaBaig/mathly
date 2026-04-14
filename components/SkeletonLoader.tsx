"use client";

import { motion } from "framer-motion";
import MathSpinner from "./MathSpinner";

export default function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Skeleton step cards */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.3 }}
          className="rounded-2xl p-6 pl-7 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1.5px solid var(--border-subtle)",
            borderRadius: "18px",
          }}
        >
          {/* Left accent bar skeleton */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-r-sm"
            style={{
              width: "5px",
              background: "linear-gradient(to bottom, rgba(139,92,246,0.15), transparent)",
              borderRadius: "0 4px 4px 0",
            }}
          />

          {/* Step header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton rounded-[10px]" style={{ width: "30px", height: "30px" }} />
            <div className="skeleton h-3.5 rounded-lg" style={{ width: `${25 + i * 8}%` }} />
          </div>

          {/* Math-shaped content lines */}
          <div className="space-y-3">
            <div className="skeleton h-3.5 rounded-lg w-full" />
            <div className="skeleton h-3.5 rounded-lg" style={{ width: "80%" }} />
            {/* Fake equation block */}
            <div className="flex justify-center py-3">
              <div
                className="skeleton rounded-xl"
                style={{ width: `${45 + i * 10}%`, height: "38px" }}
              />
            </div>
            {i < 2 && <div className="skeleton h-3.5 rounded-lg" style={{ width: "65%" }} />}
          </div>
        </motion.div>
      ))}

      {/* Morphing math spinner */}
      <div className="pt-3">
        <MathSpinner size="md" showText />
      </div>
    </motion.div>
  );
}
