import { describe, expect, test } from "bun:test";
import { formatDurationBetween, formatDurationMs } from "./formatDuration.ts";

describe("formatDurationMs", () => {
  test("returns em dash for empty or negative values", () => {
    expect(formatDurationMs(null)).toBe("—");
    expect(formatDurationMs(undefined)).toBe("—");
    expect(formatDurationMs(-1)).toBe("—");
  });

  test("milliseconds under 1s", () => {
    expect(formatDurationMs(0)).toBe("0ms");
    expect(formatDurationMs(450)).toBe("450ms");
  });

  test("seconds", () => {
    expect(formatDurationMs(4500)).toBe("5s");
    expect(formatDurationMs(59_000)).toBe("59s");
  });

  test("minutes", () => {
    expect(formatDurationMs(90_000)).toBe("1m 30s");
    expect(formatDurationMs(120_000)).toBe("2m");
  });

  test("hours", () => {
    expect(formatDurationMs(3_600_000)).toBe("1h");
    expect(formatDurationMs(3_600_000 + 120_000)).toBe("1h 2m");
  });
});

describe("formatDurationBetween", () => {
  test("returns em dash when either bound is missing", () => {
    expect(formatDurationBetween(null, 100)).toBe("—");
    expect(formatDurationBetween(100, null)).toBe("—");
    expect(formatDurationBetween(undefined, undefined)).toBe("—");
  });

  test("positive span", () => {
    expect(formatDurationBetween(0, 5000)).toBe("5s");
    expect(formatDurationBetween(0, 90_000)).toBe("1m 30s");
  });

  test("clamps inverted range to zero", () => {
    expect(formatDurationBetween(5000, 0)).toBe("0ms");
  });
});
