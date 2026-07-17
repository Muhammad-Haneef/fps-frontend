"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * SignaturePad — freehand signature capture on a `<canvas>`, using native
 * Pointer Events so mouse, touch and stylus all work through one code path.
 * `value`/`onChange` carry a PNG data URL (or `null` when empty).
 *
 * Features:
 * - Crisp strokes at any device pixel ratio
 * - Clear button, empty-state baseline + "Sign here" hint
 * - `readOnly` renders a saved signature without allowing edits
 * - Resizes with its container (redraws blank on resize — signatures are
 *   short-lived form input, not meant to survive a live layout reflow)
 */
export default function SignaturePad({
  id,
  label,
  description,
  error,
  required,
  disabled,
  readOnly = false,
  value,
  defaultValue = null,
  onChange,
  penColor = "#1f2937",
  penWidth = 2.25,
  backgroundColor = "#ffffff",
  height = 180,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange });
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const lastEmittedRef = useRef(current);
  const dprRef = useRef(1);

  // Size the canvas backing store to the container, accounting for DPR.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, rect.width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [backgroundColor, height]);

  // Redraw when an externally-set value differs from what we last emitted ourselves.
  useEffect(() => {
    if (current === lastEmittedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);
    if (current) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = current;
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
    lastEmittedRef.current = current;
  }, [current, backgroundColor]);

  function getPoint(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e) {
    if (disabled || readOnly) return;
    canvasRef.current.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
    setIsEmpty(false);
  }

  function handlePointerMove(e) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    lastEmittedRef.current = dataUrl;
    setCurrent(dataUrl);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = dprRef.current;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setIsEmpty(true);
    lastEmittedRef.current = null;
    setCurrent(null);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div className="flex flex-col gap-2">
        <div
          ref={containerRef}
          className={cn(
            "relative w-full rounded-[var(--radius-field)] border overflow-hidden",
            error ? "border-danger-400" : "border-neutral-300",
            (disabled || readOnly) && "opacity-80"
          )}
          style={{ height }}
        >
          <canvas
            ref={canvasRef}
            id={fieldId}
            className={cn("block w-full h-full touch-none", !disabled && !readOnly && "cursor-crosshair")}
            style={{ height }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          {isEmpty && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 pointer-events-none">
              <span className="text-sm text-neutral-300 mb-2">Sign here</span>
              <span className="w-2/3 border-b border-dashed border-neutral-300" />
            </div>
          )}
        </div>
        {!readOnly && (
          <div className="flex justify-end">
            <button
              type="button"
              disabled={disabled || isEmpty}
              onClick={handleClear}
              className="text-xs font-medium text-neutral-500 hover:text-danger-600 disabled:opacity-40 disabled:hover:text-neutral-500"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
