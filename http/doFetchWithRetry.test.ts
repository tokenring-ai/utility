import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { doFetchWithRetry, rateLimitWaitMs } from "./doFetchWithRetry.ts";

function respond(status: number, headers: Record<string, string> = {}) {
  return new Response(status === 204 ? null : "{}", { status, headers });
}

describe("doFetchWithRetry", () => {
  afterEach(() => {
    mock.restore();
  });

  it("still retries a 5xx by default", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValueOnce(respond(503)).mockResolvedValueOnce(respond(200));
    const res = await doFetchWithRetry("https://api.example/thing", { method: "POST" });
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-idempotent request on 5xx, since it may have been applied", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(respond(502));
    const res = await doFetchWithRetry("https://api.example/post", { method: "POST" }, { idempotent: false });
    expect(res.status).toBe(502);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("does not retry a non-idempotent request that failed in flight", async () => {
    const fetchSpy = spyOn(globalThis, "fetch").mockRejectedValue(new Error("connection reset"));
    await expect(doFetchWithRetry("https://api.example/post", { method: "POST" }, { idempotent: false })).rejects.toThrow("connection reset");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("retries a non-idempotent request on 429 after the Retry-After wait", async () => {
    const fetchSpy = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(respond(429, { "retry-after": "0" }))
      .mockResolvedValueOnce(respond(201));
    const res = await doFetchWithRetry("https://api.example/post", { method: "POST" }, { idempotent: false });
    expect(res.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("hands back a 429 whose wait is longer than the caller will block for", async () => {
    const reset = String(Math.floor(Date.now() / 1000) + 900);
    const fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(respond(429, { "x-rate-limit-reset": reset }));
    const res = await doFetchWithRetry("https://api.example/post", { method: "POST" }, { idempotent: false, maxRateLimitWaitMs: 1000 });
    expect(res.status).toBe(429);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("reads Retry-After and both rate-limit reset header styles", () => {
    const now = 1_700_000_000_000;
    expect(rateLimitWaitMs(new Headers({ "retry-after": "3" }), now)).toBe(3000);
    expect(rateLimitWaitMs(new Headers({ "retry-after": new Date(now + 5000).toUTCString() }), now)).toBe(5000);
    expect(rateLimitWaitMs(new Headers({ "x-rate-limit-reset": String(now / 1000 + 7) }), now)).toBe(7000);
    expect(rateLimitWaitMs(new Headers({ "x-ratelimit-reset": "12" }), now)).toBe(12_000);
    expect(rateLimitWaitMs(new Headers(), now)).toBeUndefined();
  });
});
