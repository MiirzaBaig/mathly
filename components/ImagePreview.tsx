"use client";

import { motion } from "framer-motion";

interface ImagePreviewProps {
  src: string; // data URL or base64 with prefix
  ocrText?: string | null;
}

export default function ImagePreview({ src, ocrText }: ImagePreviewProps) {
  const displaySrc = src.startsWith("data:") ? src : `data:image/jpeg;base64,${src}`;

  return (
    <div className="flex gap-3 items-start">
      {/* Image with scanning animation */}
      <div
        className="relative rounded-xl overflow-hidden flex-shrink-0"
        style={{
          width: 72,
          height: 72,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt="Uploaded math problem"
          className="w-full h-full object-cover"
        />

        {/* Scan sweep overlay */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <motion.div
            className="absolute left-0 right-0 h-1/4"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(139,92,246,0.35), transparent)",
            }}
            animate={{ y: ["-100%", "400%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-1 left-1 w-2 h-2 rounded-sm"
          style={{ background: "var(--accent-solid)", opacity: 0.7 }}
        />
      </div>

      {/* OCR text or placeholder */}
      <div className="flex-1 min-w-0">
        {ocrText ? (
          <>
            <p
              className="text-xs mb-1 font-semibold uppercase tracking-wider"
              style={{ color: "var(--accent-solid)" }}
            >
              we read this
            </p>
            <p
              className="text-sm leading-relaxed font-mono"
              style={{ color: "var(--text-primary)" }}
            >
              {ocrText}
            </p>
          </>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            image uploaded · reading it now...
          </p>
        )}
      </div>
    </div>
  );
}
