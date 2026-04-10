import {visibleLength} from "./visibleLength.ts";

export function wrapPlainText(text: string, width: number): string[] {
  if (width <= 0) return [""];

  const lines = text.replace(/\t/g, "  ").split("\n");
  const wrapped: string[] = [];

  for (const line of lines) {
    if (line.length === 0) {
      wrapped.push("");
      continue;
    }

    let current = "";
    for (const char of Array.from(line)) {
      current += char;
      if (visibleLength(current) >= width) {
        wrapped.push(current);
        current = "";
      }
    }

    if (current.length > 0) {
      wrapped.push(current);
    }
  }

  return wrapped.length > 0 ? wrapped : [""];
}
