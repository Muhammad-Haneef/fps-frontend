"use client";

import Rating from "./Rating";

/**
 * StarRating — thin preset over `Rating` locked to the star icon with the
 * classic amber fill. All `Rating` props (max, allowHalf, size, readOnly,
 * showValue...) still apply.
 */
export default function StarRating({ color = "text-amber-400", ...rest }) {
  return <Rating icon="star" color={color} {...rest} />;
}
