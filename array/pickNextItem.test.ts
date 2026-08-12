import { describe, expect, test } from "bun:test";
import { pickNextItem } from "./pickNextItem.ts";

type Item = { id: string; name: string };

const getId = (item: Item) => item.id;

const list: Item[] = [
  { id: "a", name: "Alpha" },
  { id: "b", name: "Bravo" },
  { id: "c", name: "Charlie" },
  { id: "d", name: "Delta" },
];

describe("pickNextItem", () => {
  test("prefers the neighbor to the right", () => {
    expect(pickNextItem(list, "b", getId)?.id).toBe("c");
  });

  test("falls back to the left when nothing is available to the right", () => {
    expect(pickNextItem(list, "d", getId)?.id).toBe("c");
  });

  test("returns undefined when the only item is removed", () => {
    expect(pickNextItem([{ id: "solo", name: "Solo" }], "solo", getId)).toBeUndefined();
  });

  test("returns undefined for an empty list", () => {
    expect(pickNextItem([], "x", getId)).toBeUndefined();
  });

  test("skips unavailable items while scanning right", () => {
    const hidden = new Set(["c"]);
    expect(pickNextItem(list, "b", getId, item => !hidden.has(item.id))?.id).toBe("d");
  });

  test("skips unavailable items while scanning left", () => {
    const hidden = new Set(["c", "d"]);
    expect(pickNextItem(list, "b", getId, item => !hidden.has(item.id))?.id).toBe("a");
  });

  test("returns undefined when all other items are unavailable", () => {
    const hidden = new Set(["a", "c", "d"]);
    expect(pickNextItem(list, "b", getId, item => !hidden.has(item.id))).toBeUndefined();
  });

  test("when removed key is not in the list, returns first available", () => {
    expect(pickNextItem(list, "missing", getId)?.id).toBe("a");
  });

  test("when removed key is not in the list, respects isAvailable", () => {
    const hidden = new Set(["a", "b"]);
    expect(pickNextItem(list, "missing", getId, item => !hidden.has(item.id))?.id).toBe("c");
  });

  test("never selects the removed item even if isAvailable would allow it", () => {
    expect(pickNextItem(list, "b", getId, () => true)?.id).not.toBe("b");
  });

  test("works with number keys", () => {
    const nums = [{ n: 1 }, { n: 2 }, { n: 3 }];
    expect(pickNextItem(nums, 2, item => item.n)?.n).toBe(3);
    expect(pickNextItem(nums, 3, item => item.n)?.n).toBe(2);
  });

  test("works with symbol keys", () => {
    const s1 = Symbol("a");
    const s2 = Symbol("b");
    const s3 = Symbol("c");
    const items = [{ key: s1 }, { key: s2 }, { key: s3 }];
    expect(pickNextItem(items, s2, item => item.key)?.key).toBe(s3);
  });
});
