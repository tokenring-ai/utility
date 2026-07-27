import type { MaybePromise } from "bun";
import { dedupe } from "../array/dedupe.ts";
import { like } from "../string/like.ts";
import EnhancedMap from "./enhancedMap.ts";

export type ReconcileHandlers<L, R> = {
  deleting: (name: string, left: L) => void;
  creating: (name: string, right: R) => L;
  updating: (name: string, left: L, right: R) => void;
};

export type AsyncReconcileHandlers<L, R> = {
  deleting: (name: string, left: L) => MaybePromise<void>;
  creating: (name: string, right: R) => MaybePromise<L>;
  updating: (name: string, left: L, right: R) => MaybePromise<void>;
};

export default class EnhancedStringMap<V> extends EnhancedMap<string, V> {
  ensure(name: string): V {
    const item = this.get(name);
    if (!item) {
      throw new Error(`Item ${name} not found`);
    }
    return item;
  }

  ensureAll(names: string[]) {
    for (const name of names) {
      if (!this.has(name)) {
        throw new Error(`Item ${name} not found in ${this.keysArray().join(",")}`);
      }
    }
  }

  keysLike(likeName: string | string[]): string[] {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.keysLike(name)));
    }
    const itemNames = this.keysArray();
    return itemNames.filter(itemName => like(likeName, itemName));
  }

  ensureKeysLike(likeName: string | string[]): string[] {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.ensureKeysLike(name)));
    }
    const matchingItems = this.keysLike(likeName);
    if (matchingItems.length === 0) {
      throw new Error(`Couldn't enable ${likeName}: no items found matching prefix`);
    }
    return matchingItems;
  }

  entriesLike(likeName: string | string[]): [string, V][] {
    return this.keysLike(likeName).map(itemName => [itemName, this.get(itemName)!]);
  }

  getLongestPrefixMatch(input: string): { key: string; item: V; remainder: string } | undefined {
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
  }

  reconcileAgainst<T2>(other: Record<string, T2>, handlers: ReconcileHandlers<V, T2>) {
    for (const name of new Set([...this.keys(), ...Object.keys(other)])) {
      if (this.has(name)) {
        if (name in other && other[name]) {
          handlers.updating(name, this.get(name)!, other[name]!);
        } else {
          handlers.deleting(name, this.get(name)!);
          this.delete(name);
        }
      } else {
        this.set(name, handlers.creating(name, other[name]!));
      }
    }
  }

  async reconcileAgainstAsync<T2>(other: Record<string, T2>, handlers: AsyncReconcileHandlers<V, T2>) {
    for (const name of new Set([...this.keys(), ...Object.keys(other)])) {
      if (this.has(name)) {
        if (name in other && other[name]) {
          await handlers.updating(name, this.get(name)!, other[name]!);
        } else {
          await handlers.deleting(name, this.get(name)!);
          this.delete(name);
        }
      } else {
        this.set(name, await handlers.creating(name, other[name]!));
      }
    }
  }
}
