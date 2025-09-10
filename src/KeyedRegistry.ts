export interface KeyedRegistryInterface<T> {
  register(name: string, resource: T): void;

  unregister(name: string): void;

  getItemByName(name: string): T | undefined;

  getAllItemNames(): string[];

  getAllItems(): Record<string, T>;
}


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

  getAllItemNames = (): string[] => {
    return Object.keys(this.items);
  }

  getAllItems = (): Record<string, T> => this.items;

  clone() {
    const myClone = new KeyedRegistry<T>()
    myClone.items = {...this.items};
    return myClone;
  }
}