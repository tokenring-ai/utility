import indent from "./indent.ts";

export default function markdownList(items: string[], indentLevel: number = 1): string {
  const formattedItems = items.map(item => `- ${item}`);
  return indent(formattedItems, indentLevel);
}
