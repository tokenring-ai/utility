import type { MaybePromise } from "bun";

export interface BackoffOptions {
  times: number;
  interval: number;
  multiplier: number;
}

/**
 * Retries an async function with exponential backoff.
 */
export async function backoff<T>(options: BackoffOptions, fn: ({ attempt }: { attempt: number }) => MaybePromise<T | null | undefined>): Promise<T> {
  let { times, interval } = options;
  const { multiplier } = options;

  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      const result = await fn({ attempt });

      // Only null/undefined signal "retry"; falsy values like 0, false, "" are valid results
      if (result != null) {
        return result;
      }
    } catch (error: unknown) {
      if (attempt === times) throw error;
    }

    if (attempt < times) {
      await new Promise(resolve => setTimeout(resolve, interval));
      interval *= multiplier;
    }
  }

  throw new Error(`Failed after ${times} attempts`);
}
