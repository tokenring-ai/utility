import KeyedRegistry from "./KeyedRegistry.js";

export default class RegistryMultiSelector<T = any> {
  readonly getItemByName: (name: string) => T | undefined;
  readonly getAllItemNames: () => string[];
  readonly getAllItems: () => Record<string, T>;
  private readonly registry: KeyedRegistry<T>;
  private activeItemNames: Set<string> = new Set();

  constructor(registry: KeyedRegistry<T>) {
    this.registry = registry;
    this.getItemByName = this.registry.getItemByName;
    this.getAllItemNames = this.registry.getAllItemNames;
    this.getAllItems = this.registry.getAllItems;
  }

  getActiveItemNames = (): Set<string> => {
    return this.activeItemNames;
  }

  enableItems = (...names: string[]): void => {
    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = this.registry.getAllItemNames().filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't enable ${name}: no items found matching prefix`);
        }
        for (const matchingItem of matchingItems) {
          this.activeItemNames.add(matchingItem);
        }
      } else {
        if (!this.registry.getItemByName(name)) {
          throw new Error(`Couldn't enable ${name}: not found`);
        }
        this.activeItemNames.add(name);
      }
    }
  }

  disableItems = (...names: string[]): void => {
    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = this.registry.getAllItemNames().filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't disable ${name}: no items found matching prefix`);
        }
        for (const matchingItem of matchingItems) {
          this.activeItemNames.delete(matchingItem);
        }
      } else {
        if (!this.registry.getItemByName(name)) {
          throw new Error(`Couldn't disable ${name}: not found`);
        }
        this.activeItemNames.delete(name);
      }
    }
  }

  setEnabledItems = (names: string[]): void => {
    const resolvedNames: string[] = [];

    for (const name of names) {
      if (name.endsWith('*')) {
        const prefix = name.slice(0, -1);
        const matchingItems = this.registry.getAllItemNames().filter(itemName => itemName.startsWith(prefix));
        if (matchingItems.length === 0) {
          throw new Error(`Couldn't set enabled items with ${name}: no items found matching prefix`);
        }
        resolvedNames.push(...matchingItems);
      } else {
        if (!this.registry.getItemByName(name)) {
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
      const item = this.getItemByName(name);
      if (item) ret[name] = item;
      else throw new Error(`Couldn't get activeItem entries for ${name}`);
    }
    return ret;
  }
}