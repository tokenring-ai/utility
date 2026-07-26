export default class EnhancedMap<K, V> extends Map<K, V> {
  clone(): EnhancedMap<K, V> {
    return new EnhancedMap(this.entries());
  }

  empty() {
    return this.size === 0;
  }

  insertAll(entries: Iterable<[K, V]>): void {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  toPlainObject() {
    return Object.fromEntries(this.entries()) as Record<(K & string) | number | symbol, V>;
  }

  static fromPlainObject<K extends string | number | symbol, V>(obj: Record<K, V>) {
    return new EnhancedMap<K, V>(Object.entries(obj) as [K, V][]);
  }

  deleteAndReturnItem(key: K): V | undefined {
    const item = this.get(key);
    this.delete(key);
    return item;
  }

  keysArray(): K[] {
    return Array.from(this.keys());
  }

  sortedKeys(compareFn?: (a: K, b: K) => number): K[] {
    return this.keysArray().sort(compareFn);
  }

  mapKeys<R>(fn: (key: K) => R): R[] {
    return this.keysArray().map(fn);
  }

  valuesArray(): V[] {
    return Array.from(this.values());
  }

  mapValues<R>(fn: (value: V) => R): R[] {
    return this.valuesArray().map(fn);
  }

  sortedValues(compareFn?: (a: V, b: V) => number): V[] {
    return this.valuesArray().sort(compareFn);
  }

  entriesArray(): [K, V][] {
    return Array.from(this.entries());
  }

  mapEntries<R>(fn: ([key, value]: [K, V]) => R): R[] {
    return this.mapEntries(fn);
  }

  sortedEntries(compareFn?: (a: [K, V], b: [K, V]) => number): [K, V][] {
    return this.entriesArray().sort(compareFn);
  }
}
