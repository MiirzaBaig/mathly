"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg-primary)", minHeight: "100dvh" }}
    >
      {/* Sad logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <div style={{ filter: "grayscale(0.5) opacity(0.6)" }}>
          <LogoMark size={64} />
        </div>
      </motion.div>

      {/* 404 number */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="font-bold mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem, 15vw, 8rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </motion.h1>

      {/* Fun message */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-lg mb-2 font-semibold"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      >
        this equation doesn&apos;t exist
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-sm mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        we looked everywhere. even tried dividing by zero. nothing.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <Link
          href="/"
          className="btn-gradient inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl"
        >
          go solve something real
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
