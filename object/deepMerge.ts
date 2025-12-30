/**
 * Deep merges two objects together.
 * Plain objects are recursively merged, while special objects (Date, Array, etc.) are replaced.
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with deeply merged properties
 */
export default function deepMerge<T extends object, S extends object>(
  target: T,
  source: S
): T & S {
  const result = { ...target } as any;

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      // Check if both values are plain objects
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Checks if a value is a plain object (not an array, Date, or other special object)
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Check if it's a plain object created with {} or new Object()
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}