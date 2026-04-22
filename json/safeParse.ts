export type JSONPrimitive = string | number | boolean | null | undefined;
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

export default function safeParse<T extends JSONValue>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}
