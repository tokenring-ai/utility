import { splitArrayable } from "../array/arrayable.ts";

export default function indent(input: string | string[], level: number): string {
  const lines = splitArrayable(input, "\n");
  const indentString = " ".repeat(level);

  return lines
    .map(line => line.trim())
    .map(line => (line ? `${indentString}${line}` : ""))
    .join("\n");
}
