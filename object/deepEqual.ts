import { isPlainObject } from "./isPlainObject.ts";

/** Structural equality for JSON-shaped values: primitives, arrays, and plain objects. */
export default function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every(key => deepEqual(a[key], b[key]));
  }
  return false;
}
