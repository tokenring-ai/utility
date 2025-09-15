import KeyedRegistry from "./KeyedRegistry.js";

export default class RegistrySingleSelector<T = any> {
  readonly getItemByName: (name: string) => T | undefined;
  readonly getAllItemNames: () => string[];
  readonly getAllItems: () => Record<string, T>;
  private readonly registry: KeyedRegistry<T>;
  private activeItemName: string | null = null;

  constructor(registry: KeyedRegistry<T>) {
    this.registry = registry;
   
    this.getItemByName = this.registry.getItemByName;
    this.getAllItemNames = this.registry.getAllItemNames;
    this.getAllItems = this.registry.getAllItems;
  }

  getActiveItemName = (): string | null => {
    return this.activeItemName;
  }

  setEnabledItem = (name: string | null): void => {
    if (name && this.registry.getItemByName(name) == null) {
      throw new Error(`Couldn't set enabled item ${name}: not found`);
    }
    this.activeItemName = name;
  }

  getActiveItem = (): T => {
    if (this.activeItemName === null) {
      throw new Error(`No item is currently enabled`);
    }

    const item = this.getItemByName(this.activeItemName);
    if (item) return item;
    throw new Error(`Active item does not exist`);
  }

  getActiveItemEntry = (): Record<string, T> => {
    if (this.activeItemName === null) {
      return {};
    }
    const item = this.getItemByName(this.activeItemName);
    if (item) return {[this.activeItemName]: item};

    throw new Error(`Active item does not exist`);
  }
}