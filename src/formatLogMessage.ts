/**
 * Formats log messages similar to console.log, with special handling for errors
 */
export default function formatLogMessages(msgs: unknown[]): string {
  return msgs
    .map((msg) => {
      // Special handling for Error objects to include stack trace
      if (msg instanceof Error) {
        const shaped = {
          message: msg.message,
          name: msg.name,
          stack: msg.stack,
          toString: () => `${msg.name}: ${msg.message}\n${msg.stack ?? ""}`,
        };
        return shaped as unknown as string;
      }

      // Handle objects and arrays with proper formatting
      if (typeof msg === "object" && msg !== null) {
        try {
          // Preserve the original object while adding a proper string representation
          const shaped = {
            ...(msg as Record<string, unknown>),
            toString: () => JSON.stringify(msg, null, 2),
          };
          return shaped as unknown as string;
        } catch (_err) {
          return String(msg); // Fallback if JSON stringification fails
        }
      }

      return String(msg);
    })
    .join(" ");
}
