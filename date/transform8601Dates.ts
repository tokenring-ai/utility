type Encode8601<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? (T[P] extends Date ? string : T[P] extends Date | infer R ? string | Exclude<R, Date> : T[P]) : T[P];
};

export function encode8601dates<T extends Record<string, unknown>, const K extends readonly string[]>(obj: T, dateKeys: K): Encode8601<T, K[number]> {
  const result: Record<string, unknown> = { ...obj };
  for (const key of dateKeys) {
    const value = result[key];
    if (value instanceof Date) {
      result[key] = value.toISOString();
    }
  }
  return result as Encode8601<T, K[number]>;
}

type Decode8601<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? (T[P] extends string ? Date : T[P] extends string | infer R ? Date | Exclude<R, string> : T[P]) : T[P];
};

export function decode8601dates<T extends Record<string, unknown>, const K extends readonly (keyof T & string)[]>(
  obj: T,
  dateKeys: K,
): Decode8601<T, K[number]> {
  const result: Record<string, unknown> = { ...obj };
  for (const key of dateKeys) {
    const value = result[key];
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid ISO 8601 date string for key "${key}": ${value}`);
      }
      result[key] = parsed;
    }
  }
  return result as Decode8601<T, K[number]>;
}
