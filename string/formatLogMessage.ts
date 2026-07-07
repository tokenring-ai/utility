import type { Arrayable } from "../array/arrayable.ts";
import { arrayableToArray } from "../array/arrayable.ts";
import formatError from "../error/formatError.ts";

/**
 * Formats log messages similar to console.log, with special handling for errors
 */
export default function formatLogMessages(...messages: Arrayable<unknown>[]): string {
  return messages
    .flatMap(msg => arrayableToArray(msg))
    .map(chunk => {
      // Special handling for Error objects to include stack trace
      if (Error.isError(chunk)) {
        return formatError(chunk);
      }

      return String(chunk);
    })
    .join(" ");
}
