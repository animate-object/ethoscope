/**
 * Color utilities for the behavior schema visual language.
 *
 * The single source of truth for a behavior's color is its `colorHue` (0–359).
 * All CSS colors are derived from that number — never stored as strings.
 *
 * Generation parameters are intentionally isolated here so they can be tuned
 * in one place (e.g. to restrict hue ranges, adjust saturation per theme, etc.)
 */

/** Generates a random hue in the full 0–359 range. */
export function generateHue(): number {
  return Math.floor(Math.random() * 360)
}

/** Primary color for a behavior event chip / swatch. */
export function eventColor(hue: number): string {
  return `hsl(${hue}, 65%, 58%)`
}

/**
 * How much lightness and saturation shift between the first and last tag.
 * Increase for more contrast between tag shades, decrease for subtlety.
 */
export const TAG_COLOR_SPREAD = { saturation: 25, lightness: 12 }

/**
 * Indexed tone for a tag pill derived from its parent event's hue.
 * Tags at index 0 are darkest/most saturated; each step lightens and
 * desaturates slightly, spreading across the available MAX_TAGS slots.
 *
 * @param spread - override TAG_COLOR_SPREAD for one-off usage
 */
export function tagColor(
  hue: number,
  index: number,
  total: number,
  spread = TAG_COLOR_SPREAD,
): string {
  const steps = Math.max(total - 1, 1)
  const t = index / steps
  const saturation = Math.round(45 - t * spread.saturation) // 45% → (45 - spread.saturation)%
  const lightness = Math.round(32 + t * spread.lightness) // 32% → (32 + spread.lightness)%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/** Very subtle background tint — useful for hover states or row highlights. */
export function eventColorTint(hue: number): string {
  return `hsl(${hue}, 50%, 20%)`
}
