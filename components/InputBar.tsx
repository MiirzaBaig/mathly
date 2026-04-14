"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DropZone from "./DropZone";
import { InlineSpinner } from "./MathSpinner";

interface InputBarProps {
  onSubmit: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
  isExhausted: boolean;
  onError: (msg: string) => void;
  defaultValue?: string;
  autoSubmit?: boolean;
  onAutoSubmitDone?: () => void;
  compact?: boolean;
}

export default function InputBar({
  onSubmit,
  isLoading,
  isExhausted,
  onError,
  defaultValue = "",
  autoSubmit = false,
  onAutoSubmitDone,
  compact = false,
}: InputBarProps) {
  const [text, setText] = useState(defaultValue);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingImageName, setPendingImageName] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const didAutoSubmit = useRef(false);

  useEffect(() => {
    if (defaultValue) setText(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (autoSubmit && defaultValue && !didAutoSubmit.current && !isLoading) {
      didAutoSubmit.current = true;
      onSubmit(defaultValue, pendingImage ?? undefined);
      setText("");
      onAutoSubmitDone?.();
    }
  }, [autoSubmit, defaultValue, isLoading, onSubmit, pendingImage, onAutoSubmitDone]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingImage) || isLoading || isExhausted) return;
    onSubmit(trimmed, pendingImage ?? undefined);
    setText("");
    setPendingImage(null);
    setPendingImageName("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImage = (base64: string, file: File) => {
    setPendingImage(base64);
    setPendingImageName(file.name);
  };

  const clearImage = () => {
    setPendingImage(null);
    setPendingImageName("");
  };

  const disabled = isLoading || isExhausted;
  const canSubmit = (text.trim().length > 0 || !!pendingImage) && !disabled;

  if (compact) {
    return (
      <div className="space-y-2">
        {pendingImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "var(--accent-solid)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <span className="flex-1 truncate">{pendingImageName}</span>
            <button onClick={clearImage} style={{ color: "var(--text-secondary)" }}>✕</button>
          </motion.div>
        )}
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isExhausted ? "limit reached (75/75)" : "new problem…"}
            disabled={disabled}
            className="math-input flex-1 px-4 py-3 text-sm"
          />
          <DropZone onImage={handleImage} onError={onError} compact />
          <motion.button
            whileTap={canSubmit ? { scale: 0.94 } : {}}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-gradient w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
          >
            {isLoading ? (
              <motion.div
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingImage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            color: "var(--text-primary)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${pendingImage}`}
            alt=""
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
          <span className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {pendingImageName}
          </span>
          <button
            onClick={clearImage}
            className="text-xs px-2 py-0.5 rounded-full transition-colors"
            style={{ color: "var(--text-secondary)", background: "var(--bg-card)" }}
          >
            Remove
          </button>
        </motion.div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={(e) => { setText(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={handleKey}
          placeholder={isExhausted ? "limit reached (75/75)" : "type a problem…"}
          disabled={disabled}
          rows={1}
          className="math-input flex-1 px-5 py-3.5 text-sm resize-none overflow-hidden"
          style={{ minHeight: "52px" }}
        />
        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.94 } : {}}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-gradient h-[52px] px-7 text-sm font-semibold flex items-center gap-2 flex-shrink-0 group"
        >
          {isLoading ? (
            <InlineSpinner size={16} />
          ) : (
            <>
              <span>Solve</span>
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M2 7h10M7.5 2.5l4.5 4.5-4.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
