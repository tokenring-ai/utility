export default function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !keysB.includes(key) ||
      !deepEquals(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }

  return true;
}