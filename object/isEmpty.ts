/**
 * Checks if the provided object is empty.
 * An object is considered empty if it is null, undefined,
 * an empty array, an empty Map/Set, or an object with no own properties.
 *
 * @param obj - The object to be checked for emptiness.
 * @return {boolean} Returns true if the object is empty, otherwise false.
 */
export default function isEmpty(
  obj: Object | Array<any> | Map<any, any> | Set<any> | null | undefined
): boolean {
  if (obj === null || obj === undefined) return true;

  if (Array.isArray(obj)) return obj.length === 0;

  // Map / Set: Object.keys(...) is always [] for them, so handle explicitly
  if (obj instanceof Map) return obj.size === 0;
  if (obj instanceof Set) return obj.size === 0;

  if (typeof obj === 'object' && Object.keys(obj).length === 0) return true;

  return false;
}