import KeyedRegistry from "./KeyedRegistry.js";

type ThingWithConstructor = {
  constructor: Function;
};

export default class TypedRegistry<MinimumType extends ThingWithConstructor> {
  protected registry = new KeyedRegistry<MinimumType>();
  getItems = this.registry.getAllItemValues;

  register = (...items: MinimumType[] | MinimumType[][]) => {
    for (const item of items.flat() as MinimumType[]) {
      this.registry.register(item.constructor.name, item);
    }
  };

  unregister = (...items: MinimumType[]) => {
    for (const item of items) {
      this.registry.unregister(item.constructor.name);
    }
  };

  waitForItemByType = <R extends MinimumType>(
    type: abstract new (...args: any[]) => R,
    callback: (item: R) => void,
  ): void => this.registry.waitForItemByName(type.name, callback as (item: MinimumType) => void);

  getItemByType = <R extends MinimumType>(
    type: abstract new (...args: any[]) => R,
  ): R | undefined => {
    return this.registry.getItemByName(type.name) as R | undefined;
  };

  requireItemByType = <R extends MinimumType>(
    type: abstract new (...args: any[]) => R,
  ): R => {
    return this.registry.requireItemByName(type.name) as R;
  };

  getItemByName = (name: string) : MinimumType | undefined => {
    return this.registry.getItemByName(name);
  }

  requireItemByName = (name: string) : MinimumType => {
    return this.registry.requireItemByName(name);
  }
}
