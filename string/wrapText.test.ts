import { describe, expect, test } from "bun:test";
import { wrapText } from "./wrapText.ts";

describe("wrapText", () => {
  test("wraps on word boundaries", () => {
    expect(wrapText("This is a long line of text that needs to be wrapped", 20)).toEqual(["This is a long line", "of text that needs", "to be wrapped"]);
  });

  test("hard-splits a single word longer than maxWidth", () => {
    expect(wrapText("supercalifragilisticexpialidocious", 20)).toEqual(["supercalifragilistic", "expialidocious"]);
  });

  test("hard-splits an oversized word between shorter words", () => {
    const lines = wrapText("hello supercalifragilisticexpialidocious world", 20);
    expect(lines.every(line => line.length <= 20)).toBe(true);
    expect(lines.join("").replace(/ /g, "")).toBe("hellosupercalifragilisticexpialidociousworld");
  });

  test("preserves empty paragraphs", () => {
    expect(wrapText("a\n\nb", 10)).toEqual(["a", "", "b"]);
  });
});
