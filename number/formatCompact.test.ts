import { describe, expect, test } from "bun:test";
import { formatCompact } from "./formatCompact.ts";

describe("formatCompact", () => {
  test("returns fallback for nullish, empty, and non-finite", () => {
    expect(formatCompact(null)).toBe("—");
    expect(formatCompact(undefined)).toBe("—");
    expect(formatCompact("")).toBe("—");
    expect(formatCompact("n/a")).toBe("—");
    expect(formatCompact(Number.NaN)).toBe("—");
    expect(formatCompact(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatCompact(Number.NEGATIVE_INFINITY)).toBe("—");
  });

  test("formats zero as 0", () => {
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact("0")).toBe("0");
  });

  test("returns small numbers without a suffix", () => {
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(1.5)).toBe("1.5");
  });

  test("formats thousands with one decimal (K)", () => {
    expect(formatCompact(1500)).toBe("1.5K");
    expect(formatCompact(3200)).toBe("3.2K");
    expect(formatCompact(1000)).toBe("1.0K");
  });

  test("formats millions and billions with two decimals", () => {
    expect(formatCompact(2_500_000)).toBe("2.50M");
    expect(formatCompact(3_500_000_000)).toBe("3.50B");
    expect(formatCompact(1_500_000_000)).toBe("1.50B");
  });

  test("formats trillions with two decimals (T)", () => {
    expect(formatCompact(1_200_000_000_000)).toBe("1.20T");
    expect(formatCompact(5e12)).toBe("5.00T");
  });

  test("accepts numeric strings", () => {
    expect(formatCompact("1500")).toBe("1.5K");
    expect(formatCompact("2500000")).toBe("2.50M");
  });

  test("handles negative values", () => {
    expect(formatCompact(-42)).toBe("-42");
    expect(formatCompact(-1500)).toBe("-1.5K");
    expect(formatCompact(-2_500_000)).toBe("-2.50M");
  });

  test("respects custom suffixes", () => {
    expect(formatCompact(1500, { suffixes: ["k", "m"] })).toBe("1.5k");
    expect(formatCompact(2_500_000, { suffixes: ["k", "m"] })).toBe("2.50m");
    // Beyond last suffix stays at top tier
    expect(formatCompact(3_500_000_000, { suffixes: ["k", "m"] })).toBe("3500.00m");
  });

  test("respects custom decimals per tier", () => {
    expect(formatCompact(1500, { decimals: [0, 0, 0, 0] })).toBe("2K");
    expect(formatCompact(1_500_000, { decimals: [1, 1, 1, 1] })).toBe("1.5M");
    expect(formatCompact(1_500_000_000, { decimals: [1, 2, 3, 2] })).toBe("1.500B");
  });

  test("adds space when spaced is true", () => {
    expect(formatCompact(1500, { spaced: true })).toBe("1.5 K");
    expect(formatCompact(2_500_000, { spaced: true })).toBe("2.50 M");
    expect(formatCompact(42, { spaced: true })).toBe("42");
  });

  test("uses custom fallback", () => {
    expect(formatCompact(null, { fallback: "N/A" })).toBe("N/A");
    expect(formatCompact("bad", { fallback: "N/A" })).toBe("N/A");
  });
});
