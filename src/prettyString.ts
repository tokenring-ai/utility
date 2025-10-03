/**
 * Utility tools for formatting strings
 */

/**
 * Format an info line with a blue color
 */
export function infoLine(text: string): string {
	return `\x1b[34m${text}\x1b[0m\n`;
}

/**
 * Format a success line with a green color
 */
export function successLine(text: string): string {
	return `\x1b[32m${text}\x1b[0m\n`;
}

/**
 * Format an error line with a red color
 */
export function errorLine(text: string): string {
	return `\x1b[31m${text}\x1b[0m\n`;
}

/**
 * Format a warning line with a yellow color
 */
export function warningLine(text: string): string {
	return `\x1b[33m${text}\x1b[0m\n`;
}
