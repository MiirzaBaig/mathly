"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";

const STEPS = [
  {
    number: "01",
    title: "drop the problem.",
    body: "drop a photo, upload a screenshot, or just type it. handwritten notes, textbook pages, whatever — if you can see it, Mathly can read it.",
    detail: "on mobile, hit Camera and snap it in one shot.",
  },
  {
    number: "02",
    title: "watch it think.",
    body: "Mathly reads the problem, pulls the math, and starts solving. usually a couple seconds.",
    detail: "it’s not just OCR — it recognizes the type of problem and solves accordingly.",
  },
  {
    number: "03",
    title: "read the breakdown.",
    body: "steps show up as clean cards. real math rendering. no walls of text.",
    detail: "skip what you already know, zoom in on the step you’re stuck on.",
  },
  {
    number: "04",
    title: "still lost? ask.",
    body: "ask a follow‑up at the bottom. it keeps the full context — no re-explaining, no starting over.",
    detail: "most solvers stop at the answer. Mathly keeps going until it clicks.",
  },
];

const DETAILS = [
  {
    label: "image reading",
    value: "OCR pulls the text out of your photo. we show you exactly what was detected so there's no mystery about what the AI saw.",
  },
  {
    label: "math rendering",
    value: "KaTeX — same engine as Khan Academy. fractions, integrals, matrices, limits all render crisp. no raw LaTeX strings showing up in your face.",
  },
  {
    label: "conversation memory",
    value: "the backend forgets everything between requests, so we store the full thread client-side. follow-ups always have full context — it's not starting fresh every time.",
  },
  {
    label: "api counter",
    value: "the header counter tracks total usage on the shared key. it warns near the end and locks at 75.",
  },
];

const FEATURES = [
  {
    title: "solve mode",
    body: "drop a photo or type a problem → get clean step-by-step cards you can follow.",
  },
  {
    title: "practice mode",
    body: "switch to PRACTICE for drill packs based on what you just solved. tap “explain this one” to jump back to SOLVE with context.",
  },
  {
    title: "exam rescue",
    body: "a compact drawer with quick-save cards when you need speed.",
  },
];

function fade(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  };
}

function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: (string | { text: string; tone?: "muted" | "accent" | "primary" })[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const tone = typeof line === "string" ? "primary" : (line.tone ?? "primary");
        const color =
          tone === "accent"
            ? "var(--accent-solid)"
            : tone === "muted"
            ? "var(--text-secondary)"
            : "var(--text-primary)";
        return (
          <motion.div
            key={`${text}-${i}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.35, delay: delay + i * 0.08, ease: "easeOut" }}
            className={lineClassName}
            style={{ color }}
          >
            {text}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HowPage() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100dvh" }}>
      <Header />

      <div className="mx-auto px-6 pt-28 pb-24" style={{ maxWidth: "680px" }}>

        {/* Hero */}
        <div className="mb-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--accent-solid)" }}
          >
            how it works
          </p>
          <h1
            className="font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
              lineHeight: 1.05,
            }}
          >
            <RevealLines
            lines={[
              { text: "four steps.", tone: "primary" },
              { text: "two seconds.", tone: "primary" },
              { text: "you got this.", tone: "muted" },
            ]}
            className=""
            lineClassName=""
            delay={0.05}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)", maxWidth: "520px" }}
          >
            we built Mathly because every other math tool either gives you the answer with zero explanation, or writes a 12-paragraph essay when you just need step 3.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-0 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              {...fade(i * 0.08)}
              className="py-10"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <div className="flex gap-6 items-start">
                <div
                  className="flex-shrink-0 font-bold tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "var(--accent-solid)",
                    marginTop: "0.35rem",
                    minWidth: "2rem",
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h2
                    className="font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.4rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h2>
                  <p className="text-base mb-3 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {step.body}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
        </div>

        {/* Features */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-xs font-bold uppercase tracking-[0.2em] mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            the three features
          </motion.p>

          <div className="space-y-0">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.06, ease: "easeOut" }}
                className="py-8"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    color: "var(--accent-solid)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "560px" }}>
                  {f.body}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
          </div>
        </div>

        {/* Technical details */}
        <motion.div {...fade(0.3)} className="mb-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            the tech stuff
          </p>
          <div className="space-y-0">
            {DETAILS.map((d, i) => (
              <motion.div
                key={d.label}
                {...fade(0.3 + i * 0.06)}
                className="py-5 flex gap-6"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <p
                  className="flex-shrink-0 text-sm font-semibold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-display)",
                    minWidth: "140px",
                  }}
                >
                  {d.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {d.value}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fade(0.5)} className="text-center">
          <p className="text-base mb-6" style={{ color: "var(--text-secondary)" }}>
            try it on your next problem
          </p>
          <Link
            href="/"
            className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-2xl"
          >
            open Mathly
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
