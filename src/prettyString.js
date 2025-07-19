/**
 * Utility tools for formatting strings
 */

/**
 * Format an info line with a blue color
 * @param {string} text The text to format
 * @returns {string} The formatted text
 */
export function infoLine(text) {
  return `\x1b[34m${text}\x1b[0m\n`;
}

/**
 * Format a success line with a green color
 * @param {string} text The text to format
 * @returns {string} The formatted text
 */
export function successLine(text) {
  return `\x1b[32m${text}\x1b[0m\n`;
}

/**
 * Format an error line with a red color
 * @param {string} text The text to format
 * @returns {string} The formatted text
 */
export function errorLine(text) {
  return `\x1b[31m${text}\x1b[0m\n`;
}

/**
 * Format a warning line with a yellow color
 * @param {string} text The text to format
 * @returns {string} The formatted text
 */
export function warningLine(text) {
  return `\x1b[33m${text}\x1b[0m\n`;
}