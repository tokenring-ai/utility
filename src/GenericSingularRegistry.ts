export default class GenericSingularRegistry<T = any> {
  private items: Record<string, T> = {};
  private activeItemName: string | null = null;

  register = (name: string, resource: T) => {
    this.items[name] = resource;
  }

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

  getItemByName = (name: string): T => {
    if (this.activeItemName !== name) {
      throw new Error(`Item ${name} not enabled`);
    }
    return this.items[name];
  }

  getAllItemNames = (): string[] => {
    return Object.keys(this.items);
  }

  getActiveItemEntry = (): Record<string, T> => {
    if (this.activeItemName === null) {
      return {};
    }
    return { [this.activeItemName]: this.items[this.activeItemName] };
  }
}