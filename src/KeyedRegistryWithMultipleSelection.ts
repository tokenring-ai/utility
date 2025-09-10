import KeyedRegistry from "./KeyedRegistry.js";

export default class KeyedRegistryWithMultipleSelection<T = any> extends KeyedRegistry<T> {
  private activeItemNames = new Set<string>();

  getActiveItemNames = (): Set<string> => {
    return this.activeItemNames;
  }

  enableItems = (names: Iterable<string>): void => {
    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = Object.keys(this.items).filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't enable ${name}: no items found matching prefix`);
        }
        for (const matchingItem of matchingItems) {
          this.activeItemNames.add(matchingItem);
        }
      } else {
        if (!this.items[name]) {
          throw new Error(`Couldn't enable ${name}: not found`);
        }
        this.activeItemNames.add(name);
      }
    }
  }

  disableItems = (names: Iterable<string>): void => {
    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = Object.keys(this.items).filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't disable ${name}: no items found matching prefix`);
        }
        for (const matchingItem of matchingItems) {
          this.activeItemNames.delete(matchingItem);
        }
      } else {
        if (!this.items[name]) {
          throw new Error(`Couldn't disable ${name}: not found`);
        }
        this.activeItemNames.delete(name);
      }
    }
  }

  setEnabledItems = (names: Iterable<string>): void => {
    const resolvedNames: string[] = [];

    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = Object.keys(this.items).filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't set enabled items with ${name}: no items found matching prefix`);
        }
        resolvedNames.push(...matchingItems);
      } else {
        if (!this.items[name]) {
          throw new Error(`Couldn't set enabled items with ${name}: not found`);
        }
        resolvedNames.push(name);
      }
    }

    this.activeItemNames = new Set(resolvedNames);
  }

  getActiveItemEntries = (): Record<string, T> => {
    const ret: Record<string, T> = {};
    for (const name of this.activeItemNames) {
      ret[name] = this.items[name];
    }
    return ret;
  }
}