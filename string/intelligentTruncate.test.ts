import { describe, expect, test } from "bun:test";
import intelligentTruncate from "./intelligentTruncate.ts";

describe("intelligentTruncate", () => {
  test("returns short strings unchanged", () => {
    expect(intelligentTruncate("Short", { maxLength: 10 })).toBe("Short");
  });

  test("truncates at a word boundary and appends suffix", () => {
    expect(intelligentTruncate("This is a long sentence that needs truncating", { maxLength: 20 })).toBe("This is a long...");
  });

  test("does not use a negative slice when suffix is longer than maxLength", () => {
    const result = intelligentTruncate("Hello world", { maxLength: 2, suffix: "..." });
    expect(result).toBe("...");
    expect(result).not.toContain("Hello worl");
  });

  test("respects maxLines", () => {
    expect(intelligentTruncate("Line 1\nLine 2\nLine 3", { maxLength: 20, maxLines: 2 })).toBe("Line 1\nLine 2");
  });
});
