export interface FormatCompactOptions {
  /** Suffixes to use for each 1000× tier (default: ["K", "M", "B", "T"]) */
  suffixes?: string[];
  /** Decimal places for each tier (default: [1, 2, 2, 2]) */
  decimals?: number[];
  /** Whether to add a space between number and suffix (default: false) */
  spaced?: boolean;
  /** Fallback for null/undefined/empty/non-finite (default: "—") */
  fallback?: string;
}

const DEFAULT_SUFFIXES = ["K", "M", "B", "T"] as const;
const DEFAULT_DECIMALS = [1, 2, 2, 2] as const;

/**
 * Formats a number into a compact string with K/M/B/T suffixes (base-1000).
 * @param n - Number to format (accepts number, string, null, or undefined)
 * @param options - Formatting options
 * @returns Formatted string (e.g., "1.5K", "2.50M", "3.50B") or fallback for invalid input
 */
export function formatCompact(n: number | string | null | undefined, options?: FormatCompactOptions): string {
  const fallback = options?.fallback ?? "—";
  if (n == null || n === "") return fallback;

  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  if (v === 0) return "0";

  const suffixes = options?.suffixes ?? DEFAULT_SUFFIXES;
  const decimals = options?.decimals ?? DEFAULT_DECIMALS;
  const spaced = options?.spaced ?? false;
  const sep = spaced ? " " : "";

  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);

  // Highest tier where abs >= 1000^(tier+1); suffixes[0] = K (1e3), [1] = M (1e6), …
  let tier = -1;
  for (let i = suffixes.length - 1; i >= 0; i--) {
    if (abs >= 1000 ** (i + 1)) {
      tier = i;
      break;
    }
  }

  if (tier < 0) {
    return String(v);
  }

  const scaled = abs / 1000 ** (tier + 1);
  const places = decimals[tier] ?? decimals[decimals.length - 1] ?? 2;
  const suffix = suffixes[tier] ?? "";
  return `${sign}${scaled.toFixed(places)}${sep}${suffix}`;
}
