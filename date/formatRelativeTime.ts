export interface FormatRelativeTimeOptions {
  /** Include future timestamps as "in X" (default: true). When false, future times become "just now". */
  future?: boolean;
  /**
   * Use second-level precision for the sub-minute "just now" threshold (default: false).
   * When true, 30–59s stays "just now" (Math.round(ms/60_000) would otherwise show "1m").
   */
  precise?: boolean;
  /** Custom reference time in unix-ms (default: Date.now()). */
  now?: number;
}

/**
 * Format a unix-ms timestamp as a relative time phrase.
 * @param ts - Unix timestamp in milliseconds, or null/undefined for "—"
 * @param opts - Formatting options
 * @returns Relative phrase like "just now", "5m ago", "in 2h", or "—"
 */
export function formatRelativeTime(ts: number | null | undefined, opts?: FormatRelativeTimeOptions): string {
  if (ts == null || ts <= 0) return "—";

  const now = opts?.now ?? Date.now();
  const allowFuture = opts?.future ?? true;
  const precise = opts?.precise ?? false;

  let delta = ts - now;
  if (!allowFuture && delta > 0) delta = 0;

  const abs = Math.abs(delta);
  const seconds = Math.round(abs / 1000);
  const minutes = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);

  // Sub-minute: precise uses second rounding so 30–59s stays "just now";
  // non-precise uses a 60s wall so messaging-style past timestamps stay stable.
  if (precise ? seconds < 60 : abs < 60_000) {
    return "just now";
  }

  let unit: string;
  if (minutes < 60) unit = `${minutes}m`;
  else if (hours < 48) unit = `${hours}h`;
  else unit = `${days}d`;

  return delta >= 0 ? `in ${unit}` : `${unit} ago`;
}
