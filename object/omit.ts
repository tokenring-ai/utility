/**
 * Creates an object composed of the properties not included in the given keys array.
 * @param obj - The source object
 * @param keys - The property names to omit
 * @returns A new object without the specified properties
 */
export default function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}