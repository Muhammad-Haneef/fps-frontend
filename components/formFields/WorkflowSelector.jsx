"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/hooks";
import FieldWrapper from "./FieldWrapper";
import { XIcon } from "./Select";

/**
 * WorkflowSelector — build a linear, ordered sequence of steps picked from
 * a fixed palette (automation builders, onboarding flows, pipeline stages).
 * Connected with a vertical line + arrow, reordered with up/down buttons.
 *
 * `stepTypes`: `[{ type, label, description, icon }]` — the palette.
 * `value`: `[{ type }]` — the chosen sequence (extend items with your own
 * fields if a step needs config; this component only manages order/type).
 */
export default function WorkflowSelector({
  id,
  label,
  description,
  error,
  required,
  disabled,
  stepTypes = [],
  value,
  defaultValue = [],
  onChange,
  renderExtra, // (step, index, update) => node — optional per-step config UI
  max,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [steps, setSteps] = useControllableState({ value, defaultValue, onChange });

  const atMax = typeof max === "number" && steps.length >= max;

  function typeInfo(type) {
    return stepTypes.find((s) => s.type === type);
  }

  function addStep(type) {
    if (atMax) return;
    setSteps([...steps, { type }]);
  }

  function removeStep(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function updateStep(index, patch) {
    setSteps(steps.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function move(index, dir) {
    const to = index + dir;
    if (to < 0 || to >= steps.length) return;
    const next = [...steps];
    [next[index], next[to]] = [next[to], next[index]];
    setSteps(next);
  }

  return (
    <FieldWrapper id={fieldId} label={label} description={description} error={error} required={required} disabled={disabled} className={className}>
      <div id={fieldId} className="flex flex-col gap-3">
        {steps.length > 0 && (
          <div className="flex flex-col">
            {steps.map((step, index) => {
              const info = typeInfo(step.type);
              return (
                <div key={index} className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="size-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                        {info?.icon || <DefaultStepIcon />}
                      </span>
                      {index < steps.length - 1 && <span className="w-px flex-1 min-h-[1.25rem] bg-neutral-200 my-1" />}
                    </div>

                    <div className="flex-1 rounded-lg border border-neutral-200 p-3 mb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{info?.label || step.type}</p>
                          {info?.description && <p className="text-xs text-neutral-400 mt-0.5">{info.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={disabled || index === 0}
                            onClick={() => move(index, -1)}
                            aria-label="Move up"
                            className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
                          >
                            <ChevronUpIcon />
                          </button>
                          <button
                            type="button"
                            disabled={disabled || index === steps.length - 1}
                            onClick={() => move(index, 1)}
                            aria-label="Move down"
                            className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-30"
                          >
                            <ChevronUpIcon className="rotate-180" />
                          </button>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => removeStep(index)}
                            aria-label="Remove step"
                            className="size-6 flex items-center justify-center rounded text-neutral-400 hover:text-danger-600 hover:bg-danger-50 disabled:opacity-30"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      {renderExtra && <div className="mt-2">{renderExtra(step, index, (patch) => updateStep(index, patch))}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {steps.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-4 border border-dashed border-neutral-200 rounded-lg">No steps yet — add one below</p>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-neutral-500">Add a step</span>
          <div className="flex flex-wrap gap-1.5">
            {stepTypes.map((s) => (
              <button
                key={s.type}
                type="button"
                disabled={disabled || atMax}
                onClick={() => addStep(s.type)}
                className="inline-flex items-center gap-1.5 text-xs font-medium rounded-md border border-neutral-200 px-2.5 py-1.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:bg-transparent disabled:hover:text-neutral-700"
              >
                {s.icon && <span className="size-3.5">{s.icon}</span>}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
}

function DefaultStepIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}

function ChevronUpIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={cn("size-3.5", className)}>
      <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 1 1-1.06 1.06L10 8.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4Z" clipRule="evenodd" />
    </svg>
  );
}
