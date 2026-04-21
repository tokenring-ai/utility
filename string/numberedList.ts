import indent from "./indent.ts";

export default function numberedList(items: string[], indentLevel: number = 1): string {
  const formattedItems = items.map((item, index) => `${index + 1}. ${item}`);
  return indent(formattedItems, indentLevel);
}
