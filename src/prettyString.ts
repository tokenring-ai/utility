/**
 * Utility tools for formatting strings
 */

/**
 * Format an info line with a blue color
 * @param text The text to format
 * @returns The formatted text
 */
export function infoLine(text: string): string {
	return `\x1b[34m${text}\x1b[0m\n`;
}

/**
 * Format a success line with a green color
 * @param text The text to format
 * @returns The formatted text
 */
export function successLine(text: string): string {
	return `\x1b[32m${text}\x1b[0m\n`;
}

/**
 * Format an error line with a red color
 * @param text The text to format
 * @returns The formatted text
 */
export function errorLine(text: string): string {
	return `\x1b[31m${text}\x1b[0m\n`;
}

/**
 * Format a warning line with a yellow color
 * @param text The text to format
 * @returns The formatted text
 */
export function warningLine(text: string): string {
	return `\x1b[33m${text}\x1b[0m\n`;
}
