export type StripUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? (T[K] extends undefined ? never : K) : K]: Exclude<T[K], undefined>;
};

export function stripUndefinedKeys<T extends object>(obj: T): StripUndefined<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as StripUndefined<T>;
}

export type StripOptions = {
  null?: boolean;
  undefined?: boolean;
  emptyArray?: boolean;
  emptyObject?: boolean;
};

type IsEmptyArray<T> = T extends readonly [] ? true : false;

type IsEmptyObject<T> = T extends object ? (T extends readonly unknown[] ? false : keyof T extends never ? true : false) : false;

type ValueToRemove<V, O extends StripOptions> =
  | (O["null"] extends true ? null : never)
  | (O["undefined"] extends true ? undefined : never)
  | (O["emptyArray"] extends true ? (IsEmptyArray<V> extends true ? V : never) : never)
  | (O["emptyObject"] extends true ? (IsEmptyObject<V> extends true ? V : never) : never);

type ShouldRemoveKey<V, O extends StripOptions> = [Exclude<V, ValueToRemove<V, O>>] extends [never] ? true : false;

export type StripObject<T, O extends StripOptions> = {
  [K in keyof T as ShouldRemoveKey<T[K], O> extends true ? never : K]: Exclude<T[K], ValueToRemove<T[K], O>>;
};

const DEFAULT_OPTIONS = {
  null: true,
  undefined: true,
  emptyArray: false,
  emptyObject: false,
} as const;

export function stripObject<T extends object, O extends StripOptions = typeof DEFAULT_OPTIONS>(obj: T, options?: O): StripObject<T, O> {
  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<StripOptions>;

  const shouldStrip = (value: unknown): boolean => {
    if (opts.null && value === null) return true;
    if (opts.undefined && value === undefined) return true;
    if (opts.emptyArray && Array.isArray(value) && value.length === 0) return true;
    if (opts.emptyObject && value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value as object).length === 0) {
      return true;
    }
    return false;
  };

  return Object.fromEntries(Object.entries(obj).filter(([, value]) => !shouldStrip(value))) as StripObject<T, O>;
}
