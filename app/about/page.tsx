"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { LogoMark } from "@/components/Logo";

const VALUES = [
  {
    title: "speed isn't optional.",
    body: "waiting 10 seconds for a math answer breaks flow. Mathly is fast on purpose — not as a feature, as the baseline.",
  },
  {
    title: "the answer alone is useless.",
    body: "if you just needed the number you'd google it. the point is understanding why it's that number. every solution here walks through the actual reasoning, step by step, no skipping.",
  },
  {
    title: "if it looks bad, it's wrong.",
    body: "math is visual. a fraction rendered as plain text is genuinely harder to read. we use proper LaTeX rendering because presentation affects comprehension. not aesthetic flex — just facts.",
  },
  {
    title: "the image is the input.",
    body: "typing out a calculus problem is already half the battle. snapping a photo shouldn't be. point your camera at the problem and go. that's the whole idea.",
  },
];

const STACK = [
  { label: "framework", value: "Next.js 16 (App Router)" },
  { label: "styling", value: "Tailwind CSS + custom CSS variables" },
  { label: "animations", value: "Framer Motion" },
  { label: "math rendering", value: "KaTeX via rehype-katex + remark-math" },
  { label: "fonts", value: "Syne (headings) + DM Sans (body)" },
  { label: "AI backend", value: "MathGo AI — a math-specialized model" },
  { label: "deployment", value: "Vercel — edge network, serverless functions" },
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
  delay = 0,
}: {
  lines: (string | { text: string; tone?: "muted" | "accent" | "primary" })[];
  delay?: number;
}) {
  return (
    <>
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
            style={{ color }}
          >
            {text}
          </motion.div>
        );
      })}
    </>
  );
}

export default function AboutPage() {
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
            about mathly
          </p>
          <h1
            className="font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            <RevealLines
              lines={[
                { text: "math should hit", tone: "primary" },
                { text: "different.", tone: "accent" },
              ]}
              delay={0.05}
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.35, delay: 0.28, ease: "easeOut" }}
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)", maxWidth: "520px" }}
          >
            Mathly is a math solver that doesn&apos;t feel like a math solver. built for people who learn by doing, not by reading documentation.
          </motion.p>
        </div>

        {/* Origin */}
        <motion.div
          {...fade(0.1)}
          className="mb-20 py-10"
          style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            the honest origin story
          </p>
          <div className="space-y-5">
            <p className="text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
              every math tool is either a black box that spits out answers, or a textbook that makes you read four paragraphs before getting to the part you actually needed. neither one respects your time or your brain.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
              nobody&apos;s sitting down at 11pm with a problem set thinking &quot;i hope this gives me a 500-word explanation.&quot; they want to see the step that&apos;s tripping them up, ask one question, and move on.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Mathly is what we actually wanted. not just a solver — a tool with opinions about what good looks like.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div {...fade(0.2)} className="mb-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            what we actually care about
          </p>
          <div className="space-y-0">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fade(0.2 + i * 0.07)}
                className="py-8"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.15rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {v.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {v.body}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
          </div>
        </motion.div>

        {/* Stack */}
        <motion.div {...fade(0.4)} className="mb-20">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            what it&apos;s built with
          </p>
          <div className="space-y-0">
            {STACK.map((item, i) => (
              <motion.div
                key={item.label}
                {...fade(0.4 + i * 0.05)}
                className="py-4 flex gap-6 items-baseline"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <p
                  className="flex-shrink-0 text-sm font-medium"
                  style={{
                    color: "var(--text-secondary)",
                    minWidth: "120px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.label}
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {item.value}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fade(0.6)}>
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="mx-auto mb-4 flex justify-center">
              <LogoMark size={48} />
            </div>
            <h2
              className="font-bold text-xl mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              go solve something
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              drop a photo or type a problem. two seconds, full breakdown.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="btn-gradient inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl"
              >
                open Mathly
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/how"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-colors"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                how it works
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
