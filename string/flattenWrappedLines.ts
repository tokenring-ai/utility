import {visibleLength} from "./visibleLength.ts";
import {wrapPlainText} from "./wrapPlainText.ts";

export function flattenWrappedLines(
  lines: string[],
  width: number,
  prefix = "",
): string[] {
  const result: string[] = [];
  const innerWidth = Math.max(1, width - visibleLength(prefix));
  for (const line of lines) {
    for (const wrapped of wrapPlainText(line, innerWidth)) {
      result.push(`${prefix}${wrapped}`);
    }
  }
  return result.length > 0 ? result : [prefix];
}
