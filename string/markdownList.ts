import indent from "./indent.ts";

export default function markdownList(items: string[]): string {
  return items.map(item => ` - ${item}`).join("\n");
}
