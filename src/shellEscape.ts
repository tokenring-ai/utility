/**
 * Utility function for escaping shell arguments
 */

/**
 * Escape a string for use in a shell command
 */
export function shellEscape(arg: string): string {
  if (!arg) {
    return "''";
  }

  // If the argument contains no special characters, return it as is
  if (/^[a-zA-Z0-9_\-./:]+$/.test(arg)) {
    return arg;
  }

  // Otherwise, escape it with single quotes
  // Replace any existing single quotes with '\''
  return `'${arg.replace(/'/g, "'\\''")}'`;
}
