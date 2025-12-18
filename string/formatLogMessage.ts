/**
 * Formats log messages similar to console.log, with special handling for errors
 */
export default function formatLogMessages(messages: (string | Error)[]): string {
  return messages
    .map((msg) => {
      // Special handling for Error objects to include stack trace
      if (msg instanceof Error) {
        return msg.stack ?? `${msg.name}: ${msg.message}`;
      }

      return String(msg);
    })
    .join(" ");
}
