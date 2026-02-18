/**
 * Checks if a string matches a pattern.
 * If the pattern ends with '*', it performs a prefix match.
 * Otherwise, it performs an exact match (case-insensitive).
 */
export function like(likeName: string, thing: string): boolean {
  const pattern = likeName.toLowerCase();
  const target = thing.toLowerCase();

  if (pattern.endsWith("*")) {
    const prefix = pattern.slice(0, -1);
    return target.startsWith(prefix);
  }

  return target === pattern;
}