/**
 * Pick the next item to select after `removedKey` is removed from `list`.
 * Prefers the neighbor to the right, then left, among items that pass `isAvailable`.
 * If the removed item is not found in the list, returns the first available item.
 *
 * @param list - The full ordered list of items
 * @param removedKey - The key/identity of the removed item
 * @param getKey - Function to extract the comparable key from an item
 * @param isAvailable - Optional predicate; items returning false are skipped
 * @returns The next item to select, or `undefined` if none remain
 */
export function pickNextItem<T>(
  list: readonly T[],
  removedKey: PropertyKey,
  getKey: (item: T) => PropertyKey,
  isAvailable?: (item: T) => boolean,
): T | undefined {
  const available = (item: T): boolean => {
    if (getKey(item) === removedKey) return false;
    return isAvailable ? isAvailable(item) : true;
  };

  const closedIndex = list.findIndex(item => getKey(item) === removedKey);

  if (closedIndex >= 0) {
    for (let i = closedIndex + 1; i < list.length; i++) {
      const candidate = list[i];
      if (candidate !== undefined && available(candidate)) return candidate;
    }
    for (let i = closedIndex - 1; i >= 0; i--) {
      const candidate = list[i];
      if (candidate !== undefined && available(candidate)) return candidate;
    }
    return undefined;
  }

  return list.find(available);
}
