export default function getRandomItem(items: string[], seed?: number): string {
  const effectiveSeed = seed ?? Math.random() * items.length;
  const len = items.length;
  const index = Math.floor(((effectiveSeed % len) + len) % len);
  return items[index]!;
}
