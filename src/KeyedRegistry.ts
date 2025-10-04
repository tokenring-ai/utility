export default class KeyedRegistry<T = any> {
  protected items: Record<string, T> = {};
  private subscribers: Map<string, ((item: T) => void)[]> = new Map();

  register = (name: string, resource: T) => {
    this.items[name] = resource;

    // Notify any waiting subscribers
    const itemSubscribers = this.subscribers.get(name);
    if (itemSubscribers) {
      itemSubscribers.forEach(callback => callback(resource));
      this.subscribers.delete(name);
    }
  };

  unregister = (name: string) => {
    delete this.items[name];
  };

  waitForItemByName = async (name: string): Promise<T> => {
    // If item already exists, return it immediately
    if (this.items[name]) {
      return this.items[name];
    }

    // Otherwise, subscribe and wait for registration
    return new Promise<T>((resolve) => {
      const subscribers = this.subscribers.get(name) || [];
      subscribers.push(resolve);
      this.subscribers.set(name, subscribers);
    });
  };

  getItemByName = (name: string): T | undefined => {
		return this.items[name];
	};

	requireItemByName = (name: string): T => {
		const item = this.getItemByName(name);
		if (!item) {
			throw new Error(`Item ${name} not found`);
		}
		return item;
	};

	getAllItemNames = (): string[] => {
		return Object.keys(this.items);
	};

	getAllItems = (): Record<string, T> => this.items;

	getAllItemValues = (): T[] => {
		return Object.values(this.items);
	};

	registerAll(items: Record<string, T>) {
		for (const name in items) {
			this.register(name, items[name]);
		}
	}

	clone() {
		const myClone = new KeyedRegistry<T>();
		myClone.items = { ...this.items };
		return myClone;
	}
}
