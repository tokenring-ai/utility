/**
 * Segment a string into grapheme clusters when Intl.Segmenter is available.
 * Falls back to Array.from (code-point iteration) otherwise.
 */
function toGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map(s => s.segment);
  }
  return Array.from(text);
}

/**
 * Truncate text to a maximum length, preferring word boundaries.
 * Whitespace is collapsed to single spaces. Length is measured in grapheme
 * clusters so emoji / ZWJ sequences are not split mid-glyph.
 *
 * @param text - The text to truncate
 * @param max - Maximum length before truncation (default: 140)
 * @returns The truncated text with ellipsis, or original if within limit
 */
export function truncateText(text: string, max = 140): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (max <= 0) return "";

  const graphemes = toGraphemes(cleaned);
  if (graphemes.length <= max) return cleaned;

  // Reserve one unit for the ellipsis character.
  const budget = Math.max(0, max - 1);
  const truncated = graphemes.slice(0, budget).join("");
  const lastSpace = truncated.lastIndexOf(" ");

  // Prefer a clean break when it still keeps most of the budget
  // (avoids tiny leftovers like "a…").
  if (lastSpace > max * 0.7) {
    return `${truncated.slice(0, lastSpace)}…`;
  }
  return `${truncated}…`;
}
