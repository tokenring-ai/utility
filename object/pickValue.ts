/**
 * Retrieve a value from an object by its key.
 * @param obj - The source object
 * @param key - The property name to pick
 * @returns The value associated with the key, or undefined if not found
 */
export default function pickValue<T extends object>(
  obj: T,
  key: unknown
) : T[keyof T] | undefined {
  if (typeof key === "string" && Object.hasOwn(obj,key)) {
    return obj[key as keyof T];
  }
}

