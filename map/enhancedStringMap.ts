import { dedupe } from "../array/dedupe.ts";
import { like } from "../string/like.ts";
import EnhancedMap from "./enhancedMap.ts";

export default class EnhancedStringMap<V> extends EnhancedMap<string, V> {
  ensure = (name: string): V => {
    const item = this.get(name);
    if (!item) {
      throw new Error(`Item ${name} not found`);
    }
    return item;
  };

  ensureAll = (names: string[]) => {
    for (const name of names) {
      if (!this.has(name)) {
        throw new Error(`Item ${name} not found in ${this.keysArray().join(",")}`);
      }
    }
  };

  keysLike = (likeName: string | string[]): string[] => {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.keysLike(name)));
    }
    const itemNames = this.keysArray();
    return itemNames.filter(itemName => like(likeName, itemName));
  };

  ensureKeysLike = (likeName: string | string[]): string[] => {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.ensureKeysLike(name)));
    }
    const matchingItems = this.keysLike(likeName);
    if (matchingItems.length === 0) {
      throw new Error(`Couldn't enable ${likeName}: no items found matching prefix`);
    }
    return matchingItems;
  };

  entriesLike = (likeName: string | string[]): [string, V][] => {
    return this.keysLike(likeName).map(itemName => [itemName, this.get(itemName)!]);
  };

  getLongestPrefixMatch = (input: string): { key: string; item: V; remainder: string } | undefined => {
    let longestMatch: { key: string; item: V; remainder: string } | undefined;

    for (const [key, item] of this) {
      if (input === key || input.startsWith(key + " ")) {
        if (!longestMatch || key.length > longestMatch.key.length) {
          longestMatch = {
            key,
            item,
            remainder: input.slice(key.length).trim(),
          };
        }
      }
    }

    return longestMatch;
  };
}
