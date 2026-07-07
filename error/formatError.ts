export interface FormatErrorOptions {
  /** Whether to include the stack trace in the output. Defaults to true. */
  includeStack?: boolean;
  /** Maximum length of the output before it's cropped. Defaults to 500. */
  cropText?: number;
}

/**
 * Turns an unknown error value into a formatted, human-readable error message.
 *
 * Handles Error instances (including their `cause` chain), plain objects,
 * strings, and any other value. Optionally includes the stack trace and
 * crops the final output to a maximum length.
 */
export default function formatError(err: unknown, { includeStack = true, cropText = 500 }: FormatErrorOptions = {}): string {
  const message = formatValue(err, includeStack);
  return crop(message, cropText);
}

function formatValue(err: unknown, includeStack: boolean, seen = new Set<unknown>()): string {
  // Guard against circular cause chains
  if (err != null && typeof err === "object") {
    if (seen.has(err)) return "[Circular]";
    seen.add(err);
  }

  if (err instanceof Error) {
    const parts: string[] = [];
    const name = err.name || "Error";
    parts.push(`${name}: ${err.message}`);

    if (includeStack && err.stack) {
      // Strip the first line (which duplicates "name: message")
      const stackBody = err.stack.split("\n").slice(1).join("\n").trimEnd();
      if (stackBody) parts.push(stackBody);
    }

    if (err.cause != null) {
      const causeText = formatValue(err.cause, includeStack, seen);
      parts.push(`Caused by: ${indent(causeText)}`);
    }

    return parts.join("\n");
  }

  if (typeof err === "string") {
    return err;
  }

  if (err === null) return "null";
  if (err === undefined) return "undefined";

  if (typeof err === "object") {
    // Prefer a `message` property if present (e.g. error-like objects)
    const maybeMessage = (err as Record<string, unknown>).message;
    if (typeof maybeMessage === "string") {
      return maybeMessage;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return Object.prototype.toString.call(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(err);
}

function indent(text: string): string {
  return text
    .split("\n")
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join("\n");
}

function crop(text: string, max: number): string {
  if (max <= 0 || text.length <= max) return text;
  const suffix = "… [truncated]";
  const sliceLength = Math.max(0, max - suffix.length);
  return text.slice(0, sliceLength) + suffix;
}
