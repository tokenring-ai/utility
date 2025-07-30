/**
 * Formats log messages similar to console.log, with special handling for errors
 * @param {Array<any>} msgs - Messages to format
 * @returns {Array<any>} Formatted messages
 */
export default function formatLogMessages(msgs) {
	return msgs
		.map((msg) => {
			// Special handling for Error objects to include stack trace
			if (msg instanceof Error) {
				return {
					message: msg.message,
					name: msg.name,
					stack: msg.stack,
					toString: () => `${msg.name}: ${msg.message}\n${msg.stack}`,
				};
			}

			// Handle objects and arrays with proper formatting
			if (typeof msg === "object" && msg !== null) {
				try {
					// Preserve the original object while adding a proper string representation
					return {
						...msg,
						toString: () => JSON.stringify(msg, null, 2),
					};
				} catch (_err) {
					return msg; // Fallback if JSON stringification fails
				}
			}

			return msg;
		})
		.join(" ");
}
