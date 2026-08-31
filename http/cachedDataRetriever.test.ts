import { afterEach, describe, expect, mock, test } from "bun:test";
import cachedDataRetriever from "./cachedDataRetriever.ts";

describe("cachedDataRetriever", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("does not immediately retry after a failed fetch", async () => {
    const fetchMock = mock(() => Promise.reject(new Error("network down")));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const get = cachedDataRetriever("https://example.test/data", {
      headers: {},
      cacheTime: 60_000,
      timeout: 50,
    });

    expect(await get()).toBeNull();
    expect(await get()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("caches a successful response within the TTL", async () => {
    const fetchMock = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const get = cachedDataRetriever("https://example.test/data", {
      headers: {},
      cacheTime: 60_000,
      timeout: 50,
    });

    expect(await get()).toEqual({ ok: true });
    expect(await get()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
