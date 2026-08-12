import { describe, expect, test } from "bun:test";
import { formatRelativeTime } from "./formatRelativeTime.ts";
import { formatTimestamp } from "./formatTimestamp.ts";

describe("formatRelativeTime", () => {
  const now = Date.UTC(2026, 0, 15, 12, 0, 0);

  test("returns em dash for empty values", () => {
    expect(formatRelativeTime(null)).toBe("—");
    expect(formatRelativeTime(undefined)).toBe("—");
    expect(formatRelativeTime(0)).toBe("—");
    expect(formatRelativeTime(-1)).toBe("—");
  });

  test("just now for sub-minute past and future (default non-precise)", () => {
    expect(formatRelativeTime(now - 10_000, { now })).toBe("just now");
    expect(formatRelativeTime(now - 30_000, { now })).toBe("just now");
    expect(formatRelativeTime(now - 59_000, { now })).toBe("just now");
    expect(formatRelativeTime(now + 20_000, { now })).toBe("just now");
  });

  test("precise keeps 30–59s as just now via second rounding", () => {
    expect(formatRelativeTime(now - 45_000, { now, precise: true })).toBe("just now");
    expect(formatRelativeTime(now - 59_000, { now, precise: true })).toBe("just now");
    expect(formatRelativeTime(now + 30_000, { now, precise: true })).toBe("just now");
  });

  test("past minutes, hours, and days", () => {
    expect(formatRelativeTime(now - 2 * 60_000, { now })).toBe("2m ago");
    expect(formatRelativeTime(now - 10 * 60_000, { now })).toBe("10m ago");
    expect(formatRelativeTime(now - 2 * 3_600_000, { now })).toBe("2h ago");
    expect(formatRelativeTime(now - 3 * 86_400_000, { now })).toBe("3d ago");
  });

  test("future times as in X (default)", () => {
    expect(formatRelativeTime(now + 10 * 60_000, { now })).toBe("in 10m");
    expect(formatRelativeTime(now + 3 * 3_600_000, { now })).toBe("in 3h");
  });

  test("future: false clamps future timestamps to just now", () => {
    expect(formatRelativeTime(now + 10 * 60_000, { now, future: false })).toBe("just now");
    expect(formatRelativeTime(now - 5 * 60_000, { now, future: false })).toBe("5m ago");
  });

  test("hours threshold before days (under 48h)", () => {
    expect(formatRelativeTime(now - 36 * 3_600_000, { now })).toBe("36h ago");
  });
});

describe("formatTimestamp", () => {
  test("returns em dash for empty values", () => {
    expect(formatTimestamp(null)).toBe("—");
    expect(formatTimestamp(undefined)).toBe("—");
    expect(formatTimestamp(0)).toBe("—");
  });

  test("formats a valid timestamp", () => {
    const result = formatTimestamp(Date.UTC(2026, 0, 15, 14, 30, 0));
    expect(result).not.toBe("—");
    expect(result.length).toBeGreaterThan(4);
  });

  test("withSeconds and weekday options do not throw", () => {
    const ts = Date.UTC(2026, 0, 15, 14, 30, 45);
    expect(formatTimestamp(ts, { withSeconds: true })).not.toBe("—");
    expect(formatTimestamp(ts, { weekday: true })).not.toBe("—");
    expect(formatTimestamp(ts, { withSeconds: true, weekday: true })).not.toBe("—");
  });
});
