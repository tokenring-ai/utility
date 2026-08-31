import { describe, expect, test } from "bun:test";
import getRandomItem from "./getRandomItem.ts";

describe("getRandomItem", () => {
  const items = ["a", "b", "c"];

  test("returns a defined item for a positive seed", () => {
    expect(getRandomItem(items, 5)).toBe("c");
    expect(getRandomItem(items, 0)).toBe("a");
  });

  test("returns a defined item for a negative seed", () => {
    expect(getRandomItem(items, -5)).toBe("b");
    expect(getRandomItem(items, -1)).toBe("c");
    expect(items).toContain(getRandomItem(items, -100));
  });

  test("maps equivalent seeds modulo length to the same item", () => {
    expect(getRandomItem(items, 1)).toBe(getRandomItem(items, 1 - items.length));
  });
});
