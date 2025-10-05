//type ConstructedTypeOf<ClassType> = abstract new (...args: any[]) => ClassType;

import KeyedRegistry from "./KeyedRegistry.js";

export interface NamedClass {
	name: string;
}

export default class TypedRegistry<MinimumType extends NamedClass> {
	protected registry = new KeyedRegistry<MinimumType>();
	getItems = this.registry.getAllItemValues;

	register = (...items: MinimumType[] | MinimumType[][]) => {
		for (const item of items.flat() as MinimumType[]) {
			this.registry.register(item.name, item);
		}
	};

	unregister = (...items: MinimumType[]) => {
		for (const item of items) {
			this.registry.unregister(item.name);
		}
	};

	waitForItemByType = <R extends MinimumType>(
		type: abstract new (...args: any[]) => R,
	): Promise<R> => {
		return this.registry.waitForItemByName(type.name) as Promise<R>;
	};

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
}
