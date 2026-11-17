import { backoff } from "../promise/backoff.ts";

export type FetchRetryOptions = {
  /**
   * False for a request that must not take effect twice — a public post, a sent message. Such a
   * request is retried only on 429, which the server refused without acting on, after the wait its
   * `Retry-After` / rate-limit reset header asks for. A 5xx or a network failure may have happened
   * after the server applied it, so that response (or error) is handed straight back. Default true.
   */
  idempotent?: boolean;
  /** Longest rate-limit wait honoured before handing back the 429 instead. Default 60 seconds. */
  maxRateLimitWaitMs?: number;
};

const NON_IDEMPOTENT_ATTEMPTS = 4;
const INITIAL_INTERVAL_MS = 500;

/**
 * Fetches a URL with exponential backoff on 429 and 5xx responses.
 * Non-retriable status codes (and successful responses) are returned immediately.
 * After exhausting retries, the last retriable response is returned.
 *
 * Pass `{ idempotent: false }` for requests that must not run twice; see {@link FetchRetryOptions}.
 */
export async function doFetchWithRetry(url: string | URL, init?: RequestInit, options: FetchRetryOptions = {}): Promise<Response> {
  if (options.idempotent === false) return fetchNonIdempotent(url, init, options.maxRateLimitWaitMs ?? 60_000);

  let lastResponse: Response | undefined;

  try {
    return await backoff({ times: 4, interval: INITIAL_INTERVAL_MS, multiplier: 2 }, async () => {
      const res = await fetch(url, init);
      lastResponse = res;
      if (res.ok) return res;
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        // Signal retry via nullish return; lastResponse is kept for final fallback
        return undefined;
      }
      return res;
    });
  } catch (error) {
    if (lastResponse) return lastResponse;
    throw error;
  }
}

async function fetchNonIdempotent(url: string | URL, init: RequestInit | undefined, maxWaitMs: number): Promise<Response> {
  let interval = INITIAL_INTERVAL_MS;
  for (let attempt = 1; ; attempt++) {
    // No catch: a request that failed in flight may still have been applied.
    const res = await fetch(url, init);
    if (res.status !== 429 || attempt >= NON_IDEMPOTENT_ATTEMPTS) return res;

    const wait = rateLimitWaitMs(res.headers) ?? interval;
    if (wait > maxWaitMs) return res;
    await sleep(wait, init?.signal ?? undefined);
    interval *= 2;
  }
}

/**
 * How long a 429 asks the client to wait, in milliseconds: `Retry-After` (seconds or an HTTP date),
 * else a rate-limit reset header — an epoch timestamp in seconds on X (`x-rate-limit-reset`), the
 * seconds remaining on Reddit (`x-ratelimit-reset`).
 */
export function rateLimitWaitMs(headers: Headers | undefined, now = Date.now()): number | undefined {
  const retryAfter = headers?.get("retry-after")?.trim();
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(retryAfter);
    if (!Number.isNaN(date)) return Math.max(0, date - now);
  }

  const reset = Number(headers?.get("x-rate-limit-reset") ?? headers?.get("x-ratelimit-reset") ?? Number.NaN);
  if (!Number.isFinite(reset)) return undefined;
  // Anything this large is a Unix timestamp rather than a countdown.
  return reset > 1_000_000_000 ? Math.max(0, reset * 1000 - now) : Math.max(0, reset * 1000);
}

function sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
