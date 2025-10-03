/**
 * Abandons a promise by consuming its result and any errors without doing anything with them.
 * This is useful to prevent unhandled promise rejection warnings when you don't care about
 * the promise's outcome.
 *
 */
export function abandon<T>(promise: Promise<T>): void {
	promise.then(
		() => {}, // Ignore resolved value
		() => {}, // Ignore rejected error
	);
}

// Usage example:
// abandon(fetch('https://example.com/api'));
