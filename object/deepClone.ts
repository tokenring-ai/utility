// eslint-disable @typescript-eslint/no-unsafe-assignment

import { isPlainObject } from "./isPlainObject.ts";

export type IntersectSources<T extends any[]> = T extends [infer Head, ...infer Tail] ? NonNullable<Head> & IntersectSources<Tail> : unknown;

/**
 * Creates a deep copy of a value.
 * Handles primitives representable in JSON/YAML, Arrays, Dates, and Plain Objects.
 * Throws on values that cannot be represented in JSON/YAML
 * (functions, symbols, bigints, class instances, Map, Set, RegExp, etc.).
 * @param value - The value to clone
 * @returns A deep clone of the input
 */
function cloneValue<T>(value: T): T {
  // Handle null
  if (value === null) {
    return value;
  }

  const t = typeof value;

  // JSON/YAML-representable primitives
  if (t === "string" || t === "number" || t === "boolean") {
    return value;
  }

  // `undefined` is not representable in JSON; allow it only as an object property
  // value (handled by the caller skipping/preserving it). At the top level we reject it.
  if (t === "undefined") {
    throw new TypeError("deepClone: `undefined` is not representable in JSON/YAML");
  }

  if (t === "function") {
    throw new TypeError("deepClone: functions are not representable in JSON/YAML");
  }

  if (t === "symbol") {
    throw new TypeError("deepClone: symbols are not representable in JSON/YAML");
  }

  if (t === "bigint") {
    throw new TypeError("deepClone: bigints are not representable in JSON/YAML");
  }

  // Handle Date (representable as an ISO string in JSON/YAML)
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => cloneValue(item)) as any;
  }

  // Handle Plain Objects
  if (isPlainObject(value)) {
    const result: any = {};
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        result[key] = cloneValue((value as any)[key]);
      }
    }
    return result;
  }

  // Anything else (Map, Set, RegExp, class instances, typed arrays, etc.)
  // is not representable in JSON/YAML.
  const ctorName = (value as any)?.constructor?.name ?? Object.prototype.toString.call(value);
  throw new TypeError(`deepClone: values of type \`${ctorName}\` not representable in JSON/YAML`);
}

/**
 * Creates a deep clone by merging any number of source objects into a brand new object.
 * Plain objects are recursively merged, while special values (Date, Array, primitives, etc.)
 * are deep-cloned and replace the previous value.
 * None of the input sources (or their nested properties) are mutated.
 *
 * Throws on values that cannot be represented in JSON/YAML
 * (functions, symbols, bigints, class instances, Map, Set, RegExp, etc.).
 *
 * When called with a single argument, behaves like a pure deep clone.
 *
 * @returns A new object with deeply cloned & merged properties
 * @param value
 */
export default function deepClone<T>(value: T): T;
export default function deepClone<S extends (object | null | undefined)[]>(...sources: S): IntersectSources<S>;
export default function deepClone(...sources: any[]): any {
  // Single-argument fast path: behave as a pure deep clone of any value.
  if (sources.length === 1) {
    // Passing `undefined` directly returns `undefined`.
    if (sources[0] === undefined) return undefined;
    return cloneValue(sources[0]);
  }

  let result: any = {};

  for (const source of sources) {
    if (source == null) continue;

    // If a source isn't a plain object (e.g. Date, Array, primitive),
    // it fully replaces the accumulated result with a deep clone of itself.
    if (!isPlainObject(source)) {
      result = cloneValue(source);
      continue;
    }

    if (!isPlainObject(result)) {
      result = {};
    }

    for (const key in source) {
      if (Object.hasOwn(source, key)) {
        const sourceValue = (source as any)[key];

        // Skip undefined source values so they don't overwrite the target.
        if (sourceValue === undefined) continue;

        const targetValue = result[key];

        if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
          // Recurse: both sides are plain objects → deep-merge clones.
          result[key] = deepClone(targetValue, sourceValue);
        } else {
          // Otherwise, deep-clone the source value so we never share refs.
          result[key] = cloneValue(sourceValue);
        }
      }
    }
  }

  return result;
}
