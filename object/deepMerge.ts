import {isPlainObject} from "./isPlainObject.ts";

/**
 * Deep merges two objects together.
 * Plain objects are recursively merged, while special objects (Date, Array, etc.) are replaced.
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new object with deeply merged properties
 */
export default function deepMerge<T extends object, S extends object>(
  target: T | null | undefined,
  source: S | null | undefined,
): T & S {

  const result = { ...target } as any;

  if (source) {
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
  }

  return result;
}

