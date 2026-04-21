export default function getRandomItem(items: string[], seed: number = Math.random() * 1000) {
  return items[Math.floor(seed % items.length)];
}
