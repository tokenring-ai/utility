export interface FormatTimestampOptions {
  /** Include seconds in the localized string (default: false). */
  withSeconds?: boolean;
  /** Include a short weekday (e.g. "Thu") — useful for schedule UIs. */
  weekday?: boolean;
}

/**
 * Format a unix-ms timestamp as an absolute localized date/time string.
 * @param ts - Unix timestamp in milliseconds, or null/undefined for "—"
 * @param opts - Optional formatting overrides
 * @returns Localized date/time string or "—"
 */
export function formatTimestamp(ts: number | null | undefined, opts?: FormatTimestampOptions): string {
  if (ts == null || ts <= 0) return "—";
  return new Date(ts).toLocaleString(undefined, {
    ...(opts?.weekday ? { weekday: "short" as const } : {}),
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(opts?.withSeconds ? { second: "2-digit" as const } : {}),
  });
}
