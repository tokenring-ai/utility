import { describe, expect, test } from "bun:test";
import { formatBytes } from "./formatBytes.ts";

describe("formatBytes", () => {
  test("formats bytes under 1 KB", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1023)).toBe("1023 B");
  });

  test("formats KB with one decimal by default", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(2048)).toBe("2.0 KB");
  });

  test("formats MB", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(1_572_864)).toBe("1.5 MB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });

  test("formats GB and TB", () => {
    expect(formatBytes(1024 ** 3)).toBe("1.0 GB");
    expect(formatBytes(1.5 * 1024 ** 3)).toBe("1.5 GB");
    expect(formatBytes(1024 ** 4)).toBe("1.0 TB");
    expect(formatBytes(2.5 * 1024 ** 4)).toBe("2.5 TB");
  });

  test("respects decimals option", () => {
    expect(formatBytes(1536, { decimals: 0 })).toBe("2 KB");
    expect(formatBytes(1536, { decimals: 2 })).toBe("1.50 KB");
    expect(formatBytes(1024 * 1024 + 512 * 1024, { decimals: 2 })).toBe("1.50 MB");
  });

  test("supports decimal (SI) base", () => {
    expect(formatBytes(1000, { base: "decimal" })).toBe("1.0 KB");
    expect(formatBytes(1_500_000, { base: "decimal" })).toBe("1.5 MB");
    expect(formatBytes(1024, { base: "decimal" })).toBe("1.0 KB");
  });

  test("caps at maxUnit", () => {
    expect(formatBytes(5 * 1024 * 1024, { maxUnit: "KB" })).toBe("5120.0 KB");
    expect(formatBytes(5 * 1024 * 1024, { maxUnit: "MB" })).toBe("5.0 MB");
    expect(formatBytes(512, { maxUnit: "B" })).toBe("512 B");
    expect(formatBytes(2048, { maxUnit: "B" })).toBe("2048 B");
  });

  test("omits space when spaced is false", () => {
    expect(formatBytes(512, { spaced: false })).toBe("512B");
    expect(formatBytes(1536, { spaced: false })).toBe("1.5KB");
    expect(formatBytes(1024 * 1024, { spaced: false })).toBe("1.0MB");
  });

  test("handles negative values", () => {
    expect(formatBytes(-512)).toBe("-512 B");
    expect(formatBytes(-1536)).toBe("-1.5 KB");
  });

  test("handles non-finite values", () => {
    expect(formatBytes(Number.NaN)).toBe("0 B");
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe("0 B");
    expect(formatBytes(Number.NEGATIVE_INFINITY)).toBe("0 B");
  });
});
