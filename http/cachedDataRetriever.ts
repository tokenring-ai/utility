import type {MaybePromise} from "bun";

/**
 * Options for the cached data retriever.
 */
interface RetrieverOptions {
  /** HTTP headers to include in the request. */
  headers: Record<string, string>;
  /** Time in milliseconds to cache the response. Defaults to 30000. */
  cacheTime?: number;
  /** Request timeout in milliseconds. Defaults to 1000. */
  timeout?: number;
}

/**
 * Creates a function that fetches and caches data from a URL.
 * It prevents concurrent duplicate requests and respects a cache TTL.
 *
 * @template T - The expected type of the response data.
 * @param {string} baseURL - The URL to fetch data from.
 * @param {RetrieverOptions} options - Configuration for headers, cache time, and timeout.
 * @returns {() => Promise<T | null>} A function that returns the cached or freshly fetched data.
 */
export default function cachedDataRetriever<T = unknown>(
  baseURL: string,
  {headers, cacheTime = 30000, timeout = 1000}: RetrieverOptions,
): () => MaybePromise<T | null> {
  let lastOnlineCheck = 0;
  let lastResponse: T | null = null;
  let pendingRequest: Promise<T | null> | null = null;

  return (): MaybePromise<T | null> => {
    const now = Date.now();

    if (lastOnlineCheck < now - cacheTime) {
      // If there's already a request in-flight, return it
      if (pendingRequest) {
        return pendingRequest;
      }

      // Create new request
      pendingRequest = (async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(baseURL, {
            headers,
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          lastResponse = (await response.json()) as T;
          lastOnlineCheck = Date.now();
          return lastResponse;
        } catch {
          lastResponse = null;
          return lastResponse;
        } finally {
          clearTimeout(timeoutId);
          pendingRequest = null;
        }
      })();

      return pendingRequest;
    }

    return lastResponse;
  };
}
