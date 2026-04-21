// ... existing code ...
import { isPlainObject } from "./isPlainObject.ts";

export type IntersectSources<T extends any[]> = T extends [infer Head, ...infer Tail] ? NonNullable<Head> & IntersectSources<Tail> : unknown;

/**
 * Deep merges objects together.
 * Plain objects are recursively merged, while special objects (Date, Array, etc.) are replaced.
 * @param target - The target object to merge into
 * @param sources - The source objects to merge from
 * @returns A new object with deeply merged properties
 */
export default function deepMerge<T extends object, S extends (object | null | undefined)[]>(
  target: T | null | undefined,
  ...sources: S
): T & IntersectSources<S> {
  const result = { ...target } as any;

  for (const source of sources) {
    if (source) {
      for (const key in source) {
        if (Object.hasOwn(source, key)) {
          const sourceValue = (source as any)[key];
          const targetValue = result[key];

          // Check if both values are plain objects
          if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
          } else {
            result[key] = sourceValue;
          }
        }
      }
    }
  }

  return result;
}
