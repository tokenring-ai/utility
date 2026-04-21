import { isPlainObject } from "./isPlainObject.ts";

/**
 * Creates a deep copy of a value.
 * Handles primitives, Arrays, Dates, and Plain Objects.
 * @param value - The value to clone
 * @returns A deep clone of the input
 */
export default function deepClone<T>(value: T): T {
  // Handle null or non-object types (primitives, functions)
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as any;
  }

  // Handle Plain Objects
  if (isPlainObject(value)) {
    const result: any = {};
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        result[key] = deepClone((value as any)[key]);
      }
    }
    return result;
  }

  // For other specialized objects (RegExp, Map, Set, etc.),
  // you might want to add specific handlers or return as is.
  return value;
}
