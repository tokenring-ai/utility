export type ByteUnit = "B" | "KB" | "MB" | "GB" | "TB";

export interface FormatBytesOptions {
  /** Number of decimal places for non-byte units (default: 1) */
  decimals?: number;
  /** Whether to use binary (1024) or decimal (1000) units (default: "binary") */
  base?: "binary" | "decimal";
  /** Maximum unit to display (default: "auto" — goes up to TB) */
  maxUnit?: ByteUnit | "auto";
  /** Whether to include a space between number and unit (default: true) */
  spaced?: boolean;
}

const UNITS: readonly ByteUnit[] = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Formats a byte count into a human-readable string.
 * @param size - Size in bytes
 * @param options - Formatting options
 * @returns Formatted string (e.g., "1.5 KB", "512 B")
 */
export function formatBytes(size: number, options?: FormatBytesOptions): string {
  const decimals = options?.decimals ?? 1;
  const divisor = options?.base === "decimal" ? 1000 : 1024;
  const spaced = options?.spaced ?? true;
  const sep = spaced ? " " : "";

  if (!Number.isFinite(size)) {
    return `0${sep}B`;
  }

  const sign = size < 0 ? "-" : "";
  let value = Math.abs(size);

  let maxIndex = UNITS.length - 1;
  if (options?.maxUnit && options.maxUnit !== "auto") {
    const idx = UNITS.indexOf(options.maxUnit);
    if (idx >= 0) maxIndex = idx;
  }

  let unitIndex = 0;
  while (unitIndex < maxIndex && value >= divisor) {
    value /= divisor;
    unitIndex += 1;
  }

  if (unitIndex === 0) {
    // Bytes: show as integer (matches historical callers)
    return `${sign}${Math.round(Math.abs(size))}${sep}B`;
  }

  return `${sign}${value.toFixed(decimals)}${sep}${UNITS[unitIndex]}`;
}
