export interface BackoffOptions {
  times: number;
  interval: number;
  multiplier: number;
}

/**
 * Retries an async function with exponential backoff.
 */
export async function backoff<T>(
  options: BackoffOptions,
  fn: ({ attempt }: { attempt: number }) => Promise<T | null | undefined>
): Promise<T> {
  let { times, interval } = options;
  const { multiplier } = options;

  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      const result = await fn({ attempt });

      // If the result is truthy (e.g., we found a client), return it
      if (result) {
        return result;
      }
    } catch (error) {
      if (attempt === times) throw error;
    }

    if (attempt < times) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      interval *= multiplier;
    }
  }

  throw new Error(`Failed after ${times} attempts`);
}