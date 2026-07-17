"use client";

import { useId, useState, useRef, useEffect } from "react";
import { AsYouType, getCountryCallingCode } from "libphonenumber-js";
import { cn, sizeStyles } from "@/lib/utils";
import { useControllableState, useClickOutside } from "@/lib/hooks";
import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
import FloatingPanel from "./FloatingPanel";

const DEFAULT_COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
].map((c) => ({ ...c, dial: `+${getCountryCallingCode(c.code)}` }));

export default function PhoneInput({
  id,
  label = "Phone number",
  description,
  error,
  success,
  required,
  disabled,
  size = "md",
  countries = DEFAULT_COUNTRIES,
  defaultCountry = "US",
  value,
  defaultValue = "",
  onChange, // (e164Value: string, meta: { country, national }) => void
  className,
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [country, setCountry] = useState(
    () => countries.find((c) => c.code === defaultCountry) || countries[0]
  );
  const [national, setNational] = useControllableState({
    value,
    defaultValue,
    onChange: (v) => {
      const formatter = new AsYouType(country.code);
      formatter.input(v);
      const num = formatter.getNumber();
      onChange?.(num ? num.number : `${country.dial}${v}`, { country, national: v });
    },
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useClickOutside(() => setOpen(false));
  const inputRef = useRef(null);
  const pendingCaretRef = useRef(null);

  const filtered = countries.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  useEffect(() => {
    if (pendingCaretRef.current != null && inputRef.current) {
      const pos = pendingCaretRef.current;
      pendingCaretRef.current = null;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [national]);

  function digitsBefore(str, pos) {
    return str.slice(0, pos).replace(/\D/g, "").length;
  }
  function positionForDigitCount(str, digitCount) {
    if (digitCount <= 0) return 0;
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (/\d/.test(str[i])) {
        count++;
        if (count === digitCount) return i + 1;
      }
    }
    return str.length;
  }

  function handleInput(e) {
    const el = e.target;
    const raw = el.value;
    const caret = el.selectionStart ?? raw.length;
    const caretDigitCount = digitsBefore(raw, caret);

    // AsYouType wants only digits/plus in, formats as it goes — this is what
    // correctly handles backspace instead of re-mangling an already-formatted string
    const digitsOnly = raw.replace(/[^\d]/g, "");
    const formatter = new AsYouType(country.code);
    const formatted = formatter.input(digitsOnly);

    pendingCaretRef.current = positionForDigitCount(formatted, caretDigitCount);
    setNational(formatted);
  }

  function handleCountrySelect(c) {
    setCountry(c);
    setOpen(false);
    setSearch("");

    const digitsOnly = national.replace(/\D/g, "");
    const formatter = new AsYouType(c.code);
    setNational(formatter.input(digitsOnly));
  }

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      description={description}
      error={error}
      success={success}
      required={required}
      disabled={disabled}
      size={size}
      className={className}
    >
      <div className="relative flex items-stretch">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "flex items-center gap-1.5 rounded-l-[var(--radius-field)] border border-r-0 bg-neutral-50 px-2.5 text-sm shrink-0 h-full transition-colors",
              error ? "border-danger-400" : "border-neutral-300 hover:bg-neutral-100"
            )}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span className="text-neutral-600 tabular-nums">{country.dial}</span>
            <ChevronIcon className={cn("size-3.5 text-neutral-400 transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            <FloatingPanel anchorRef={dropdownRef} open={open} matchWidth={false} width={256} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
              <div className="p-1.5 border-b border-neutral-100">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full h-8 px-2 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
                />
              </div>
              <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
                {filtered.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-brand-50 text-left"
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-neutral-400 tabular-nums">{c.dial}</span>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-neutral-400">No matches</li>
                )}
              </ul>
            </FloatingPanel>
          )}
        </div>

        <input
          ref={inputRef}
          id={fieldId}
          type="tel"
          inputMode="tel"
          value={national}
          onChange={handleInput}
          disabled={disabled}
          placeholder="Phone number"
          aria-invalid={Boolean(error)}
          className={cn(fieldBoxClasses({ size, error, success, disabled }), "rounded-l-none")}
          {...rest}
        />
      </div>
    </FieldWrapper>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" />
    </svg>
  );
}

// "use client";

// import { useId, useState } from "react";
// import { cn, sizeStyles, formatUsPhone } from "@/lib/utils";
// import { useControllableState, useClickOutside } from "@/lib/hooks";
// import FieldWrapper, { fieldBoxClasses } from "./FieldWrapper";
// import FloatingPanel from "./FloatingPanel";

// const DEFAULT_COUNTRIES = [
//   { code: "US", dial: "+1", flag: "🇺🇸", name: "United States", format: formatUsPhone },
//   { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
//   { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
//   { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
//   { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
//   { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
//   { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
//   { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
// ];

// /**
//  * PhoneInput — international phone number field.
//  *
//  * Features:
//  * - Country dial-code dropdown (searchable) with flag emoji
//  * - Live digit-grouping/formatting for the selected country (US pattern built-in,
//  *   pass a custom `format` fn per-country or via `countries` prop to extend)
//  * - Returns both the formatted display value and raw E.164-ish value via onChange
//  * - Clearable, error/success states, sizes
//  */
// export default function PhoneInput({
//   id,
//   label = "Phone number",
//   description,
//   error,
//   success,
//   required,
//   disabled,
//   size = "md",
//   countries = DEFAULT_COUNTRIES,
//   defaultCountry = "US",
//   value,
//   defaultValue = "",
//   onChange, // (fullValue: string, meta: { country, national }) => void
//   className,
//   ...rest
// }) {
//   const autoId = useId();
//   const fieldId = id || autoId;
//   const [country, setCountry] = useState(() => countries.find((c) => c.code === defaultCountry) || countries[0]);
//   const [national, setNational] = useControllableState({
//     value,
//     defaultValue,
//     onChange: (v) => onChange?.(`${country.dial} ${v}`, { country, national: v }),
//   });
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const dropdownRef = useClickOutside(() => setOpen(false));

//   const filtered = countries.filter(
//     (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
//   );

//   function handleInput(e) {
//     const raw = e.target.value;
//     const formatted = country.format ? country.format(raw) : raw.replace(/[^\d\s-]/g, "");
//     setNational(formatted);
//   }

//   return (
//     <FieldWrapper
//       id={fieldId}
//       label={label}
//       description={description}
//       error={error}
//       success={success}
//       required={required}
//       disabled={disabled}
//       size={size}
//       className={className}
//     >
//       <div className="relative flex items-stretch">
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={() => setOpen((o) => !o)}
//             className={cn(
//               "flex items-center gap-1.5 rounded-l-[var(--radius-field)] border border-r-0 bg-neutral-50 px-2.5 text-sm shrink-0 h-full transition-colors",
//               error ? "border-danger-400" : "border-neutral-300 hover:bg-neutral-100"
//             )}
//             aria-haspopup="listbox"
//             aria-expanded={open}
//           >
//             <span className="text-base leading-none">{country.flag}</span>
//             <span className="text-neutral-600 tabular-nums">{country.dial}</span>
//             <ChevronIcon className={cn("size-3.5 text-neutral-400 transition-transform", open && "rotate-180")} />
//           </button>

//           {open && (
//             <FloatingPanel anchorRef={dropdownRef} open={open} matchWidth={false} width={256} className="rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg overflow-hidden">
//               <div className="p-1.5 border-b border-neutral-100">
//                 <input
//                   autoFocus
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search country..."
//                   className="w-full h-8 px-2 text-sm rounded-md border border-neutral-200 outline-none focus:border-brand-500"
//                 />
//               </div>
//               <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
//                 {filtered.map((c) => (
//                   <li key={c.code}>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCountry(c);
//                         setOpen(false);
//                         setSearch("");
//                       }}
//                       className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-brand-50 text-left"
//                     >
//                       <span className="text-base">{c.flag}</span>
//                       <span className="flex-1 truncate">{c.name}</span>
//                       <span className="text-neutral-400 tabular-nums">{c.dial}</span>
//                     </button>
//                   </li>
//                 ))}
//                 {filtered.length === 0 && (
//                   <li className="px-3 py-2 text-sm text-neutral-400">No matches</li>
//                 )}
//               </ul>
//             </FloatingPanel>
//           )}
//         </div>

//         <input
//           id={fieldId}
//           type="tel"
//           inputMode="tel"
//           value={national}
//           onChange={handleInput}
//           disabled={disabled}
//           placeholder={country.code === "US" ? "(555) 123-4567" : "Phone number"}
//           aria-invalid={Boolean(error)}
//           className={cn(fieldBoxClasses({ size, error, success, disabled }), "rounded-l-none")}
//           {...rest}
//         />
//       </div>
//     </FieldWrapper>
//   );
// }

// function ChevronIcon({ className }) {
//   return (
//     <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
//       <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" />
//     </svg>
//   );
// }
