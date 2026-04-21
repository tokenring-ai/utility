import fs from "node:fs";
import { arrayableToArray } from "../array/arrayable.ts";

const envCache = new Map<string, string>();

export function defaultEnv(names: string | string[], defaultValue: string): string {
  for (const name of arrayableToArray(names)) {
    if (envCache.has(name)) {
      return envCache.get(name)!;
    }

    const value = process.env[name];
    if (value) {
      envCache.set(name, value);
    }

    const fileName = process.env[name + "_FILE"];
    if (fileName) {
      const value2 = fs.readFileSync(fileName, "utf8");
      envCache.set(name, value2);
      return value2;
    }
  }
  return defaultValue;
}
