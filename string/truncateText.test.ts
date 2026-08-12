import { describe, expect, test } from "bun:test";
import { truncateText } from "./truncateText.ts";

describe("truncateText", () => {
  test("short messages unchanged", () => {
    expect(truncateText("hello")).toBe("hello");
  });

  test("collapses whitespace", () => {
    expect(truncateText("a   b\nc")).toBe("a b c");
  });

  test("long messages truncated with ellipsis", () => {
    const long = "a".repeat(200);
    const result = truncateText(long, 20);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(20);
  });

  test("breaks at word boundary when possible", () => {
    const text = "Please refactor the authentication module to use OAuth2";
    const result = truncateText(text, 40);
    // Hard cut at 39 would leave a partial word; word break drops it.
    expect(result).toBe("Please refactor the authentication…");
  });

  test("falls back to hard cut when no good word break exists", () => {
    const long = "supercalifragilisticexpialidocious-word";
    const result = truncateText(long, 20);
    expect(result).toBe(`${long.slice(0, 19)}…`);
  });

  test("default max is 140", () => {
    const short = "a".repeat(140);
    expect(truncateText(short)).toBe(short);

    const long = "a".repeat(141);
    const result = truncateText(long);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(140);
  });

  test("does not split multi-code-unit emoji / ZWJ sequences", () => {
    // 👨‍💻 is one grapheme but multiple UTF-16 code units / code points
    const long = "👨‍💻".repeat(30);
    const result = truncateText(long, 10);
    expect(result.endsWith("…")).toBe(true);
    // 9 full graphemes + ellipsis — no lone surrogates or partial ZWJ sequences
    expect(result).toBe(`${"👨‍💻".repeat(9)}…`);
    expect(result).not.toMatch(/\uFFFD/);
  });

  test("returns empty string when max is non-positive", () => {
    expect(truncateText("hello", 0)).toBe("");
    expect(truncateText("hello", -5)).toBe("");
  });

  test("max of 1 yields only ellipsis", () => {
    expect(truncateText("hello", 1)).toBe("…");
  });
});
