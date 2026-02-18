import {dedupe} from "../string/dedupe.ts";
import {like} from "../string/like.ts";

export default class KeyedRegistry<T = any> {
  protected items: Map<string, T> = new Map();
  private subscribers: Map<string, ((item: T) => void)[]> = new Map();

  register = (name: string, resource: T) => {
    this.items.set(name, resource);

    // Notify any waiting subscribers
    const itemSubscribers = this.subscribers.get(name);
    if (itemSubscribers) {
      itemSubscribers.forEach((callback) => callback(resource));
      this.subscribers.delete(name);
    }
  };

  unregister = (name: string) => {
    this.items.delete(name);
  };

  waitForItemByName = (name: string, callback: (item: T) => void) : void => {
    // If item already exists, return it immediately
    const item = this.items.get(name);
    if (item) {
      callback(item);
    }

    // Otherwise, subscribe and wait for registration
    const subscribers = this.subscribers.get(name) || [];
    subscribers.push(callback);
    this.subscribers.set(name, subscribers);
  };

  getItemByName = (name: string): T | undefined => {
    return this.items.get(name);
  };

  requireItemByName = (name: string): T => {
    const item = this.getItemByName(name);
    if (!item) {
      throw new Error(`Item ${name} not found`);
    }
    return item;
  };

  ensureItems = (names: string[]) => {
    for (const name of names) {
      if (!this.items.has(name)) {
        throw new Error(`Item ${name} not found in ${this.getAllItemNames().join(",")}`);
      }
    }
  }

  getAllItemNames = (): string[] => {
    return Array.from(this.items.keys());
  };

  //getAllItems = (): Map<string, T> => this.items;

  getAllItemValues = (): T[] => {
    return Array.from(this.items.values());
  };

  getItemNamesLike = (likeName: string | string[]) : string[] => {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.getItemNamesLike(name)));
    }
    const itemNames = this.getAllItemNames();
    return itemNames.filter(itemName => like(likeName, itemName));
  }

  ensureItemNamesLike = (likeName: string | string[]) : string[] => {
    if (Array.isArray(likeName)) {
      return dedupe(likeName.flatMap(name => this.ensureItemNamesLike(name)));
    }
    const matchingItems = this.getItemNamesLike(likeName);
    if (matchingItems.length === 0) {
      throw new Error(
        `Couldn't enable ${likeName}: no items found matching prefix`,
      );
    }
    return matchingItems;
  }

  getItemEntriesLike = (likeName: string | string[]) : [string, T][] => {
    return this.getItemNamesLike(likeName).map(itemName => [itemName, this.items.get(itemName)!]);
  }

  forEach = (callback: (key: string, item: T) => void) => {
    this.items.forEach((item, key) => {
      callback(key, item);
    });
  }

  entries = () => Array.from(this.items.entries());

  getLongestPrefixMatch = (input: string): { key: string; item: T; remainder: string } | undefined => {
    let longestMatch: { key: string; item: T; remainder: string } | undefined;

    for (const [key, item] of this.items) {
      if (input === key || input.startsWith(key + " ")) {
        if (!longestMatch || key.length > longestMatch.key.length) {
          longestMatch = {
            key,
            item,
            remainder: input.slice(key.length).trim()
          };
        }
      }
    }

    return longestMatch;
  };

  registerAll = (items: Record<string, T> | Map<string, T>) => {
    if (items instanceof Map) {
      items.forEach((value, key) => this.register(key, value));
    } else {
      for (const name in items) {
        this.register(name, items[name]);
      }
    }
  }
}