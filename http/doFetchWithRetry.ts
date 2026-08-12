import { backoff } from "../promise/backoff.ts";

/**
 * Fetches a URL with exponential backoff on 429 and 5xx responses.
 * Non-retriable status codes (and successful responses) are returned immediately.
 * After exhausting retries, the last retriable response is returned.
 */
export async function doFetchWithRetry(url: string | URL, init?: RequestInit): Promise<Response> {
  let lastResponse: Response | undefined;

  try {
    return await backoff({ times: 4, interval: 500, multiplier: 2 }, async () => {
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
