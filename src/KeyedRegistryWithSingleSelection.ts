import KeyedRegistry from "./KeyedRegistry.js";

export default class KeyedRegistryWithSingleSelection<T = any> extends KeyedRegistry<T> {
  private activeItemName: string | null = null;

  getActiveItemName = (): string | null => {
    return this.activeItemName;
  }

  setEnabledItem = (name: string | null): void => {
    if (name && !this.items[name]) {
      throw new Error(`Couldn't set enabled item ${name}: not found`);
    }
    this.activeItemName = name;
  }

  getActiveItem = (): T => {
    if (this.activeItemName === null) {
      throw new Error(`No item is currently enabled`);
    }
    return this.items[this.activeItemName];
  }

  getActiveItemEntry = (): Record<string, T> => {
    if (this.activeItemName === null) {
      return {};
    }
    return {[this.activeItemName]: this.items[this.activeItemName]};
  }
}