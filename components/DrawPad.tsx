"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Tool = "pen" | "eraser";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function stripDataUrlPrefix(dataUrl: string) {
  return dataUrl.split(",")[1] ?? "";
}

function getPointerPos(
  e: PointerEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

function createExportFromCanvas(
  canvas: HTMLCanvasElement,
  bbox: { minX: number; minY: number; maxX: number; maxY: number } | null
) {
  const w = canvas.width;
  const h = canvas.height;

  // If nothing drawn, export full canvas (still valid).
  const pad = Math.round(Math.min(w, h) * 0.06);
  const crop = bbox
    ? {
        x: clamp(Math.floor(bbox.minX) - pad, 0, w - 1),
        y: clamp(Math.floor(bbox.minY) - pad, 0, h - 1),
        w: clamp(Math.ceil(bbox.maxX - bbox.minX) + pad * 2, 1, w),
        h: clamp(Math.ceil(bbox.maxY - bbox.minY) + pad * 2, 1, h),
      }
    : { x: 0, y: 0, w, h };

  // Offscreen export canvas with white background for OCR.
  const out = document.createElement("canvas");
  out.width = crop.w;
  out.height = crop.h;
  const ctx = out.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, out.width, out.height);

  const dataUrl = out.toDataURL("image/png");
  return stripDataUrlPrefix(dataUrl);
}

export default function DrawPad({
  disabled,
  onSubmitImage,
  onError,
}: {
  disabled: boolean;
  onSubmitImage: (base64Png: string) => void;
  onError: (msg: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const bboxRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [stroke, setStroke] = useState(10);

  const colors = useMemo(
    () => ({
      border: "1px dashed #2a2a2e",
      borderActive: "1px dashed rgba(139,92,246,0.85)",
      bg: "var(--bg-card)",
      panel: "var(--bg-card-hover)",
    }),
    []
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const nextW = Math.max(320, Math.floor(rect.width));
    const nextH = Math.max(220, Math.floor(rect.height));

    // Preserve drawing by copying old bitmap if we resize.
    const old = document.createElement("canvas");
    old.width = canvas.width;
    old.height = canvas.height;
    const oldCtx = old.getContext("2d");
    const ctx = canvas.getContext("2d");
    if (!ctx || !oldCtx) return;

    oldCtx.drawImage(canvas, 0, 0);

    canvas.width = Math.floor(nextW * dpr);
    canvas.height = Math.floor(nextH * dpr);
    canvas.style.width = `${nextW}px`;
    canvas.style.height = `${nextH}px`;

    // White background for better contrast on export (but keep canvas transparent visually).
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bboxRef.current = null;
    lastRef.current = null;
  }, []);

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const width = tool === "eraser" ? stroke * 1.4 : stroke;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = width;

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "#0b0b0d";
      }

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      if (tool !== "eraser") {
        const b = bboxRef.current ?? { minX: from.x, minY: from.y, maxX: from.x, maxY: from.y };
        b.minX = Math.min(b.minX, from.x, to.x);
        b.minY = Math.min(b.minY, from.y, to.y);
        b.maxX = Math.max(b.maxX, from.x, to.x);
        b.maxY = Math.max(b.maxY, from.y, to.y);
        bboxRef.current = b;
      }
    },
    [stroke, tool]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      if (disabled) return;
      canvas.setPointerCapture(e.pointerId);
      isDrawingRef.current = true;
      const p = getPointerPos(e, canvas);
      lastRef.current = p;
      // Dot on tap.
      drawLine(p, { x: p.x + 0.01, y: p.y + 0.01 });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || disabled) return;
      const prev = lastRef.current;
      if (!prev) return;
      const p = getPointerPos(e, canvas);
      drawLine(prev, p);
      lastRef.current = p;
    };

    const end = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);
    };
  }, [disabled, drawLine]);

  const handleSolve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64 = createExportFromCanvas(canvas, bboxRef.current);
    if (!base64) {
      onError("couldn’t export drawing. try again.");
      return;
    }
    onSubmitImage(base64);
  }, [onError, onSubmitImage]);

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap items-center justify-between gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {([
            ["pen", "Pen"],
            ["eraser", "Eraser"],
          ] as const).map(([k, label]) => {
            const active = tool === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setTool(k)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  border: "1px solid var(--border-subtle)",
                  background: active ? "rgba(139,92,246,0.16)" : "transparent",
                }}
              >
                {label}
              </button>
            );
          })}

          <div className="flex items-center gap-2 pl-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
              size
            </span>
            <input
              type="range"
              min={6}
              max={18}
              value={stroke}
              onChange={(e) => setStroke(parseInt(e.target.value, 10))}
              aria-label="Stroke size"
              style={{ accentColor: "var(--accent-solid)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              background: "transparent",
            }}
          >
            Clear
          </button>
          <motion.button
            type="button"
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={handleSolve}
            disabled={disabled}
            className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ opacity: disabled ? 0.4 : 1 }}
          >
            Solve
          </motion.button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden"
        style={{
          height: "clamp(220px, 32vh, 300px)",
          background: colors.bg,
          border: colors.border,
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "transparent",
            cursor: tool === "eraser" ? "crosshair" : "crosshair",
          }}
        />
      </div>

      <div className="text-xs" style={{ color: "var(--text-muted)", letterSpacing: "0.02em" }}>
        tip: write big, leave space between terms.
      </div>
    </div>
  );
}

