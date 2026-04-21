/**
 * Interpolates a string by replacing placeholders like {{ KEY }}
 * with the result of a corresponding function from the replacements record.
 *
 * @param str - The template string containing {{ KEY }} placeholders.
 * @param replacements - A record where keys match the placeholders and values are functions returning strings.
 * @returns The interpolated string.
 */
export default function interpolateString(str: string, replacements: Record<string, () => string>): string {
  // Regex matches {{ KEY }}, allowing for optional whitespace around the key.
  // Group 1 captures the key itself.
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    const replacementFn = replacements[key];

    // If a replacement function exists, call it; otherwise, keep the original placeholder.
    return replacementFn ? replacementFn() : match;
  });
}

// Example usage:
// const result = interpolateString('Today is {{ DATE }}', {
//   DATE: () => new Date().toLocaleDateString()
// });
