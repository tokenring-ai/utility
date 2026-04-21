import KeyedRegistry from "./KeyedRegistry.ts";

type ThingWithConstructor = {
  constructor: Function;
};

export default class TypedRegistry<MinimumType extends ThingWithConstructor> {
  protected registry = new KeyedRegistry<MinimumType>();
  getItems = this.registry.valuesArray;

  register = (...items: MinimumType[] | MinimumType[][]) => {
    for (const item of items.flat() as MinimumType[]) {
      this.registry.set(item.constructor.name, item);
    }
  };

  unregister = (...items: MinimumType[]) => {
    for (const item of items) {
      this.registry.unregister(item.constructor.name);
    }
  };

  waitForItemByType = <R extends MinimumType>(type: abstract new (...args: any[]) => R, callback: (item: R) => void): void =>
    this.registry.waitFor(type.name, callback as (item: MinimumType) => void);

  getItemByType = <R extends MinimumType>(type: abstract new (...args: any[]) => R): R | undefined => {
    return this.registry.get(type.name) as R | undefined;
  };

  requireItemByType = <R extends MinimumType>(type: abstract new (...args: any[]) => R): R => {
    return this.registry.require(type.name) as R;
  };
}
