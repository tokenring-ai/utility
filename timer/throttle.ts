/**
 * Creates a throttled function that only invokes the provided function if at least
 * `minWait` milliseconds have elapsed since the last invocation.
 *
 * @param func - The function to throttle
 * @returns A throttled version of the function that accepts a `minWait` parameter
 */
export default function throttle<T extends (...args: any[]) => any>(
  func: T
): (minWait: number, ...args: Parameters<T>) => void {
  let lastCallTime: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, minWait: number, ...args: Parameters<T>) {
    const now = Date.now();

    // If this is the first call or minWait is 0, execute immediately
    if (lastCallTime === null || minWait === 0) {
      // Clear any pending timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      lastCallTime = now;
      func.apply(this, args);
      return;
    }

    const timeSinceLastCall = now - lastCallTime;

    // If enough time has passed, execute immediately
    if (timeSinceLastCall >= minWait) {
      // Clear any pending timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      lastCallTime = now;
      func.apply(this, args);
      return;
    }

    // Not enough time has passed, schedule for later
    // Clear any existing timeout first
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    const remainingTime = minWait - timeSinceLastCall;
    timeoutId = setTimeout(() => {
      lastCallTime = Date.now();
      func.apply(this, args);
      timeoutId = null;
    }, remainingTime);
  };
}