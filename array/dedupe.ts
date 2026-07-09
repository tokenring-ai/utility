export function dedupe<T>(items: T[]): T[] {
  const uniqueSet = new Set<T>(items);
  return Array.from(uniqueSet) as T[];
}
