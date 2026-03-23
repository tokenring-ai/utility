/**
 * Options for the intelligentTruncate function.
 */
interface TruncateOptions {
  /** The maximum number of characters allowed. */
  maxLength: number;
  /** The string to append at the end of the truncated text. Defaults to "...". */
  suffix?: string;
  /** The maximum number of lines to display. If the string exceeds this, it will be truncated at the last line. */
  maxLines?: number;
}

/**
 * Truncates a string to a specified length or number of lines, ensuring it doesn't break words
 * and handles whitespace cleanly.
 *
 * @param s - The string to truncate.
 * @param options - The configuration object for truncation.
 * @returns The truncated string with the suffix appended if necessary.
 */
export default function intelligentTruncate(s: string, { maxLength, suffix = "...", maxLines}: TruncateOptions): string {
  let result = s.trim();

  // Handle maxLines if specified
  if (maxLines !== undefined && maxLines > 0) {
    const lines = result.split(/\r?\n/);
    if (lines.length > maxLines) {
      result = lines.slice(0, maxLines).join("\n");
    }
  }

  if (result.length <= maxLength) return result;

  // Calculate the target length accounting for the suffix
  const targetLength = maxLength - suffix.length;

  // Find the last space within the allowed length to avoid cutting words
  const index = result.lastIndexOf(" ", targetLength + 1);

  if (index === -1) {
    return result.slice(0, targetLength).trim() + suffix;
  }

  return result.slice(0, index).trim() + suffix;
}