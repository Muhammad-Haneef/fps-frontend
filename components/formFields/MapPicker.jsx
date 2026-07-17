"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";

/**
 * MapPicker — a dependency-free latitude/longitude picker: click or drag a
 * pin on a graticule (lat/lng grid) surface, or type coordinates directly.
 *
 * This intentionally does NOT render real map tiles (that requires a
 * provider like Mapbox/Google Maps and an API key, which is outside a
 * zero-dependency component). For production, pass `renderBackground` to
 * drop in your actual map tiles/imagery underneath the same click/drag
 * coordinate logic — everything else (pin, dragging, lat/lng sync) still
 * works unchanged.
 *
 * Value shape: { lat, lng }.
 */
export default function MapPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = { lat: 24.8607, lng: 67.0011 }, // Karachi, as a sensible default
  onChange,
  bounds = { latMin: -90, latMax: 90, lngMin: -180, lngMax: 180 },
  renderBackground,
  height = 280,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [coords, setCoords] = useControllableState({ value, defaultValue, onChange });
  const surfaceRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function pixelToCoords(clientX, clientY) {
    const rect = surfaceRef.current.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);
    const lng = bounds.lngMin + x * (bounds.lngMax - bounds.lngMin);
    const lat = bounds.latMax - y * (bounds.latMax - bounds.latMin);
    return { lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 };
  }

  function coordsToPercent({ lat, lng }) {
    const x = ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100;
    const y = ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * 100;
    return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
  }

  function handlePointerDown(e) {
    if (disabled) return;
    setCoords(pixelToCoords(e.clientX, e.clientY));
    setDragging(true);
  }

  function handlePointerMove(e) {
    if (!dragging || disabled) return;
    setCoords(pixelToCoords(e.clientX, e.clientY));
  }

  const pos = coordsToPercent(coords);

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div
        ref={surfaceRef}
        id={fieldId}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        className={cn(
          "relative rounded-xl border border-neutral-200 overflow-hidden cursor-crosshair select-none",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        style={{ height }}
      >
        {renderBackground ? (
          renderBackground(coords)
        ) : (
          <div className="absolute inset-0 bg-brand-50">
            {/* Graticule grid — a lightweight stand-in for real map tiles */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={`${(i / 8) * 100}%`} y1="0" x2={`${(i / 8) * 100}%`} y2="100%" stroke="var(--color-brand-100)" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={`${(i / 6) * 100}%`} x2="100%" y2={`${(i / 6) * 100}%`} stroke="var(--color-brand-100)" strokeWidth="1" />
              ))}
            </svg>
          </div>
        )}

        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-[left,top] duration-75"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <PinIcon className="size-8 text-brand-600 drop-shadow" />
        </div>

        <div className="absolute bottom-2 left-2 rounded-md bg-neutral-0/90 backdrop-blur px-2 py-1 text-[10px] font-mono text-neutral-600 tabular-nums">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CoordInput label="Latitude" value={coords.lat} disabled={disabled} onChange={(v) => setCoords({ ...coords, lat: v })} />
        <CoordInput label="Longitude" value={coords.lng} disabled={disabled} onChange={(v) => setCoords({ ...coords, lng: v })} />
      </div>
    </FieldWrapper>
  );
}

function CoordInput({ label, value, onChange, disabled }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-neutral-500">{label}</span>
      <input
        type="number"
        step="0.0001"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="h-9 px-2.5 text-sm rounded-md border border-neutral-300 outline-none focus:border-brand-500 tabular-nums"
      />
    </label>
  );
}

function PinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 32" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12Zm0 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    </svg>
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
