export default function requireFields<T>(obj: T, required: (keyof T)[], context: string = "Config"): void {
  for (const key of required) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      throw new Error(`${context}: Missing required field "${String(key)}"`);
    }
  }
}