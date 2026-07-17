"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import MapPicker from "./MapPicker";
import { Spinner } from "./TextInput";

/**
 * LocationPicker — the common "where is this" field: a text query (place
 * name/address), a "Use my current location" button (native browser
 * Geolocation API), and a MapPicker underneath for fine-tuning the exact pin.
 *
 * Value shape: { query, lat, lng }.
 *
 * `onSearch(query) => Promise<{ lat, lng, label }>` — wire this to your real
 * geocoding provider (Mapbox/Google/Nominatim) to resolve typed place names
 * into coordinates; without it, typing still updates `query` but won't move
 * the pin until the user clicks the map or uses their current location.
 */
export default function LocationPicker({
  id,
  label,
  description,
  error,
  required,
  disabled,
  value,
  defaultValue = { query: "", lat: null, lng: null },
  onChange,
  onSearch,
  size = "md",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [location, setLocation] = useControllableState({ value, defaultValue, onChange });
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  async function handleSearchSubmit() {
    if (!onSearch || !location.query) return;
    setSearching(true);
    try {
      const result = await onSearch(location.query);
      if (result) setLocation({ ...location, lat: result.lat, lng: result.lng, query: result.label || location.query });
    } finally {
      setSearching(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ ...location, lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setGeoError("Couldn't access your location — check permissions");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  const hasCoords = location.lat !== null && location.lng !== null;

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error || geoError} required={required} disabled={disabled} size={size} className={className}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id={fieldId}
            type="text"
            value={location.query}
            placeholder="Search a place or address"
            disabled={disabled}
            onChange={(e) => setLocation({ ...location, query: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className={cn(fieldBoxClasses({ size, error, disabled, hasRightIcon: searching }))}
          />
          {searching && <Spinner size={size} className="absolute right-2.5 top-1/2 -translate-y-1/2" />}
        </div>
        <button
          type="button"
          disabled={disabled || locating}
          onClick={useCurrentLocation}
          className="shrink-0 h-10 px-3 rounded-[var(--radius-field)] border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 disabled:opacity-60"
        >
          {locating ? <Spinner size="sm" /> : <LocateIcon className="size-4" />}
          <span className="hidden sm:inline">Current</span>
        </button>
      </div>

      <MapPicker
        value={hasCoords ? { lat: location.lat, lng: location.lng } : undefined}
        defaultValue={{ lat: 24.8607, lng: 67.0011 }}
        onChange={(coords) => setLocation({ ...location, ...coords })}
        disabled={disabled}
        height={220}
      />
    </FieldWrapper>
  );
}

function LocateIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
