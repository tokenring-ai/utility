export default function getRandomItem(items: string[], seed?: number) {
  const effectiveSeed = seed ?? Math.random() * items.length;
  return items[Math.floor(effectiveSeed % items.length)];
}
