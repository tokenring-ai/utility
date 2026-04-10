export function truncateVisible(text: string, width: number): string {
  if (width <= 0) return "";
  const chars = Array.from(text);
  if (chars.length <= width) return text;
  if (width <= 1) return chars.slice(0, width).join("");
  return `${chars.slice(0, width - 1).join("")}…`;
}
