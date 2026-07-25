/**
 * Transforms an object's values using a transformer function.
 * @param obj - The source object
 * @param transformer - Function to transform each property value
 * @returns A new object with transformed values
 */
export function transformObjectValues<T extends object, R>(obj: T, transformer: <K extends keyof T>(value: T[K], key: K) => R): { [K in keyof T]: R } {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const typedKey = key as keyof T;
      acc[typedKey] = transformer(obj[typedKey], typedKey);
      return acc;
    },
    {} as { [K in keyof T]: R },
  );
}

/**
 * Transforms an object's entries using a mapping function.
 *
 * @param obj The input object to transform.
 * @param fn A mapper function called with `(key, value, obj)`. Returning `[newKey, newValue]` keeps or updates the entry; returning `undefined` drops it.
 * @returns A new object generated from the transformed entries.
 */
export function transformObjectEntries<T extends Record<string | number | symbol, any>, K extends PropertyKey, V>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T], source: T) => [K, V] | undefined,
): Record<K, V> {
  const result = {} as Record<K, V>;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    const entry = fn(key, obj[key], obj);
    if (entry !== undefined) {
      const [newKey, newValue] = entry;
      result[newKey] = newValue;
    }
  }

  return result;
}
