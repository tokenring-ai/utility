export default class KeyedRegistry<T = any> {
  protected items: Record<string, T> = {};

  register = (name: string, resource: T) => {
    this.items[name] = resource;
  }

  unregister = (name: string) => {
    delete this.items[name];
  }


  getItemByName = (name: string): T | undefined => {
    return this.items[name];
  }

  requireItemByName = (name: string): T => {
    const item = this.getItemByName(name);
    if (!item) {
      throw new Error(`Item ${name} not found`);
    }
    return item;
  }

  getAllItemNames = (): string[] => {
    return Object.keys(this.items);
  }

  getAllItems = (): Record<string, T> => this.items;

  getAllItemValues = (): T[] => {
    return Object.values(this.items);
  }

  clone() {
    const myClone = new KeyedRegistry<T>()
    myClone.items = {...this.items};
    return myClone;
  }
}