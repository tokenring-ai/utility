export default class EnhancedSet<T> extends Set<T> {
  clone(): EnhancedSet<T> {
    return new EnhancedSet(this);
  }

  empty() {
    return this.size === 0;
  }

  insertAll(entries: Iterable<T>): void {
    for (const entry of entries) {
      this.add(entry);
    }
  }
  deleteAll(entries: Iterable<T>): void {
    for (const entry of entries) {
      this.delete(entry);
    }
  }

  map<R>(fn: (item: T) => R): R[] {
    const result: R[] = [];
    for (const item of this) {
      result.push(fn(item));
    }
    return result;
  }

  valuesArray(): T[] {
    return Array.from(this);
  }

  join(separator: string): string {
    return this.valuesArray().join(separator);
  }

  joinWithDefault(separator: string, defaultValue: string): string {
    return this.size === 0 ? defaultValue : this.join(separator);
  }

  sortedValues(compareFn?: (a: T, b: T) => number): T[] {
    return this.valuesArray().sort(compareFn);
  }
}
