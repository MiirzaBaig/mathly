"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fileToBase64, isValidImageType } from "@/lib/imageUtils";

interface DropZoneProps {
  onImage: (base64: string, file: File) => void;
  onError: (msg: string) => void;
  compact?: boolean;
}

export default function DropZone({ onImage, onError, compact = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!isValidImageType(file)) {
        onError("please upload a png, jpg, or webp image.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onError("image must be under 10MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      onImage(base64, file);
    },
    [onImage, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-11 h-11 rounded-xl"
          style={{
            background: "transparent",
            border: "1px solid #2a2a2e",
            color: "var(--text-primary)",
            borderRadius: 12,
          }}
          title="Upload image"
          aria-label="Upload image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 3l1.5-2h3L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <motion.div
        className="relative cursor-pointer select-none"
        style={{
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          borderRadius: 12,
          background: "var(--bg-card)",
          border: `1px dashed ${isDragOver ? "var(--accent-solid)" : "#2a2a2e"}`,
          transition: "border-color 150ms, background 150ms",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex justify-center mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isDragOver ? "var(--accent-solid)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V8" />
            <path d="M8.5 11.5L12 8l3.5 3.5" />
            <path d="M20 16.5v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
          </svg>
        </div>
        <p
          className="font-semibold mb-1"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
        >
          Drop a problem
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          png / jpg / webp · camera works too
        </p>
      </motion.div>

      {/* Camera button — glass effect */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
        style={{
          background: "transparent",
          border: "1px solid #2a2a2e",
          color: "var(--text-primary)",
          transition: "background 150ms, border-color 150ms, color 150ms",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="8" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5.5 3l1-2h3l1 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Camera
      </motion.button>
    </div>
  );
}
