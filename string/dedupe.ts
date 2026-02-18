export function dedupe(items: string[]): string[] {
  const uniqueSet = new Set<string>(items);
  return Array.from(uniqueSet);
}