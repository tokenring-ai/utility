/**
 * Creates an object composed of the picked object properties.
 * @param obj - The source object
 * @param keys - The property names to pick
 * @returns A new object with only the specified properties
 */
export default function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

