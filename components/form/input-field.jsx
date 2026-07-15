"use client";

import PropTypes from "prop-types";
import { useId, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

// Tiny dependency-free info icon used for the tooltip trigger, so this
// component requires no icon library at all. Pass any icon *component*
// (lucide-react, react-icons, heroicons, ...) via the `icon` prop.
function InfoIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.elementType, // pass a component, e.g. from lucide-react
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  tooltip: PropTypes.string,
  info: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  dir: PropTypes.oneOf(["ltr", "rtl"]),
  className: PropTypes.string,
  inputClass: PropTypes.string,
  allowedPattern: PropTypes.string,
  blockedPattern: PropTypes.string,
  allowedSymbols: PropTypes.string,
  blockedSymbols: PropTypes.string,
  allowNumbers: PropTypes.bool,
  allowLetters: PropTypes.bool,
  customValidator: PropTypes.func,
  onValidationError: PropTypes.func,
};

export default function InputField({
  name,
  label,
  type = "text",
  icon: Icon,
  placeholder = " ",
  helperText,
  tooltip,
  info,
  disabled = false,
  required = false,
  maxLength,
  dir = "ltr",
  className = "",
  inputClass = "",
  allowedPattern,
  blockedPattern,
  allowedSymbols,
  blockedSymbols,
  allowNumbers = true,
  allowLetters = true,
  customValidator,
  onValidationError,
  ...other
}) {
  const { control } = useFormContext();
  const autoId = useId(); // always called — no conditional hook usage
  const inputId = other.id || autoId;
  const isRTL = dir === "rtl";

  const [restrictionError, setRestrictionError] = useState("");

  const hasRestrictions =
    type === "text" &&
    (customValidator ||
      blockedSymbols ||
      allowedSymbols !== undefined ||
      (blockedPattern && blockedPattern.trim() !== "") ||
      (allowedPattern && allowedPattern !== ".*") ||
      !allowLetters ||
      !allowNumbers);

  const escapeForCharClass = (chars) =>
    chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Returns true if the candidate value is allowed to be typed at all.
  const isValueAllowed = (nextValue) => {
    if (!hasRestrictions || nextValue === "") return true;

    if (customValidator) {
      const result = customValidator(nextValue);
      if (result === false || typeof result === "string") {
        setRestrictionError(
          typeof result === "string" ? result : "Invalid input",
        );
        return false;
      }
    }

    if (blockedSymbols) {
      const blocked = new RegExp(`[${escapeForCharClass(blockedSymbols)}]`);
      if (blocked.test(nextValue)) {
        setRestrictionError(`These symbols are not allowed: ${blockedSymbols}`);
        return false;
      }
    }

    if (allowLetters || allowNumbers || allowedSymbols) {
      const parts = [];
      const chars = [];
      if (allowLetters) {
        chars.push(
          "a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F",
        );
        parts.push("letters");
      }
      if (allowNumbers) {
        chars.push("0-9");
        parts.push("numbers");
      }
      if (allowedSymbols) {
        chars.push(escapeForCharClass(allowedSymbols));
        parts.push(`symbols: ${allowedSymbols}`);
      }
      const allowedRegex = new RegExp(`^[${chars.join("")}\\s]*$`);
      if (!allowedRegex.test(nextValue)) {
        const last = parts.length > 1 ? parts.pop() : null;
        setRestrictionError(
          last
            ? `Only ${parts.join(", ")} and ${last} are allowed.`
            : `Only ${parts[0]} are allowed.`,
        );
        return false;
      }
    }

    if (blockedPattern && new RegExp(blockedPattern).test(nextValue)) {
      setRestrictionError("Input contains an invalid pattern");
      return false;
    }

    /*
    if (allowedPattern && allowedPattern !== ".*" && !new RegExp(allowedPattern).test(nextValue)) {
      setRestrictionError("Input format is not allowed");
      return false;
    }
    */

    // Optional regex validation
    if (allowedPattern && allowedPattern !== ".*") {
      const regex = new RegExp(allowedPattern);

      if (!regex.test(nextValue)) {
        setRestrictionError("Input format is not allowed");
        return false;
      }
    }

    setRestrictionError("");
    return true;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => {
        const displayError = error?.message || restrictionError;
        const charCount = field.value ? field.value.length : 0;

        const handleChange = (e) => {
          const nextValue = e.target.value;
          if (isValueAllowed(nextValue)) {
            if (restrictionError) setRestrictionError("");
            field.onChange(nextValue);
          } else if (onValidationError) {
            onValidationError(restrictionError);
          }
          // If not allowed, we simply skip field.onChange — the input
          // stays controlled by field.value, so React re-renders it
          // back to the last valid value on its own (no ref hack needed).
        };

        return (
          <div className={`w-full relative group ${className}`} dir={dir}>
            <div
              className={`relative border rounded-md py-1 px-2 ${
                displayError ? "border-red-500" : "border-gray-dark"
              } ${disabled ? "opacity-70" : ""} focus-within:border-primary transition-all`}
            >
              {Icon && (
                <div
                  className={`absolute inset-y-0 flex items-center pointer-events-none ${
                    isRTL ? "right-0 pr-2" : "left-0 pl-2"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      displayError ? "text-red-500" : "text-gray-400"
                    } group-focus-within:text-primary`}
                  />
                </div>
              )}

              <input
                {...other}
                id={inputId}
                name={field.name}
                ref={field.ref}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                {...(maxLength ? { maxLength } : {})}
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={handleChange}
                className={`text-gray-dark w-full py-1 text-sm focus:outline-none peer ${inputClass} ${
                  Icon
                    ? isRTL
                      ? "pr-10 text-right"
                      : "pl-10 text-left"
                    : isRTL
                      ? "text-right"
                      : "text-left"
                } ${disabled ? "cursor-not-allowed" : ""}`}
              />

              <label
                htmlFor={inputId}
                className={`text-sm absolute text-gray-light cursor-text truncate max-w-[calc(100%-18px)] float-labels ${
                  Icon
                    ? isRTL
                      ? "right-10"
                      : "left-10"
                    : isRTL
                      ? "right-0"
                      : "left-0"
                } ${
                  displayError ? "text-red-500" : "peer-focus:text-primary"
                } peer-placeholder-shown:text-sm peer-placeholder-shown:top-1 peer-focus:text-xs ${
                  isRTL ? "peer-focus:right-0" : "peer-focus:left-0"
                } peer-focus:-top-3 -top-3 text-xs`}
              >
                {label} {required && <span className="text-red-500">*</span>}
              </label>

              {tooltip && (
                <div
                  className={`absolute inset-y-0 flex items-center ${isRTL ? "left-2" : "right-2"}`}
                >
                  <div className="relative group/tooltip">
                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                    <div
                      className={`absolute bottom-full mb-1 w-max max-w-[200px] rounded-md bg-gray-800 text-white text-xs py-1 px-2 hidden group-hover/tooltip:block ${
                        isRTL ? "left-0" : "right-0"
                      }`}
                    >
                      {tooltip}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {helperText && !displayError && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {helperText}
                </div>
              )}
              {displayError && (
                <div className="text-[10px] text-red-500 mt-1">
                  {displayError}
                </div>
              )}
              {maxLength && (
                <div
                  className={`text-xs text-gray-400 mt-1 ${isRTL ? "mr-auto" : "ml-auto"}`}
                >
                  {charCount}/{maxLength}
                </div>
              )}
            </div>

            {info && (
              <div className="text-light text-blue-800 text-xs mt-1">
                {info}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
