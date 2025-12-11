export default function requireFields<T extends Object>(
  obj: T,
  required: (keyof T)[],
  context: string = "Config",
): void {
  for (const key of required) {
    if (! Object.hasOwn(obj, key) || obj[key] == null || obj[key] === "") {
      throw new Error(`${context}: Missing required field "${String(key)}"`);
    }
  }
}
