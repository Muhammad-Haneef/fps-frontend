"use client";

import TagsInput from "./TagsInput";

/**
 * KeywordInput — thin preset over `TagsInput` tuned for SEO/metadata-style
 * keyword entry: lowercased + trimmed automatically, case-insensitive
 * duplicate check, splits on comma or space, and a sane default `max`.
 */
export default function KeywordInput({
  max = 15,
  maxTagLength = 30,
  placeholder = "Add a keyword…",
  ...rest
}) {
  return (
    <TagsInput
      separators={["Enter", "Tab", ",", " "]}
      caseSensitive={false}
      transform={(raw) => raw.trim().toLowerCase()}
      max={max}
      maxTagLength={maxTagLength}
      placeholder={placeholder}
      {...rest}
    />
  );
}
