/**
 * Transforms an object's values using a transformer function.
 * @param obj - The source object
 * @param transformer - Function to transform each property value
 * @returns A new object with transformed values
 */
export default function transform<T extends object, R>(
  obj: T,
  transformer: <K extends keyof T>(value: T[K], key: K) => R
): { [K in keyof T]: R } {
  return Object.keys(obj).reduce((acc, key) => {
    const typedKey = key as keyof T;
    acc[typedKey] = transformer(obj[typedKey], typedKey);
    return acc;
  }, {} as { [K in keyof T]: R });
}

