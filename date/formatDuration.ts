/**
 * Format a duration in milliseconds as a compact human phrase.
 * @param ms - Duration in milliseconds, or null/undefined/negative for "—"
 * @returns Phrase like "450ms", "5s", "1m 30s", "1h 2m", or "—"
 */
export function formatDurationMs(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rem = seconds % 60;
  if (minutes < 60) return rem ? `${minutes}m ${rem}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  return remMin ? `${hours}h ${remMin}m` : `${hours}h`;
}

/**
 * Format the duration between two unix-ms timestamps.
 * @param start - Start time in unix-ms
 * @param end - End time in unix-ms
 * @returns Compact duration phrase, or "—" if either bound is missing
 */
export function formatDurationBetween(start: number | null | undefined, end: number | null | undefined): string {
  if (start == null || end == null) return "—";
  return formatDurationMs(Math.max(0, end - start));
}
