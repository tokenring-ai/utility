/**
 * Checks if a value is a plain object (not an array, Date, or other special object)
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Check if it's a plain object created with {} or new Object()
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}