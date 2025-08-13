@token-ring/utility

Overview
- @token-ring/utility is a small collection of general-purpose helpers used across the Token Ring ecosystem. It includes:
  - Promise handling helper to intentionally ignore outcomes without unhandled rejection noise.
  - A lightweight in-memory cache with optional TTL and a singleton instance for convenience.
  - Log message formatting that stringifies mixed values and errors in a readable way.
  - Pretty string helpers for colored terminal output.
  - A safe shell argument escaper.

What this package offers
- Promise utilities
  - abandon(promise): safely consume a promise’s resolution/rejection to avoid unhandled rejection warnings.
- Caching
  - Cache<V>: a simple, generic in-memory cache with optional TTL per entry.
  - default export: a singleton cache instance.
- Logging helpers
  - formatLogMessages(msgs: unknown[]): produce a single string similar to console.log behavior with special Error handling.
- Terminal string helpers
  - infoLine, successLine, errorLine, warningLine: wrap a string with ANSI colors and newline.
- Shell utilities
  - shellEscape(arg: string): safely escape a string for posix-like shells.

Exports
- package.json declares: "exports": { "./*": "./src/*.ts" }
  - Import from subpaths, for example:
    - import { abandon } from "@token-ring/utility/abandon";
    - import cache, { Cache } from "@token-ring/utility/cache";
    - import formatLogMessages from "@token-ring/utility/formatLogMessage";
    - import { infoLine, successLine, errorLine, warningLine } from "@token-ring/utility/prettyString";
    - import { shellEscape } from "@token-ring/utility/shellEscape";

Installation
This package is part of the Token Ring monorepo and is typically consumed within the workspace. If you need to depend on it directly, add it to your dependencies:
- "@token-ring/utility": "0.1.0"

Usage examples

abandon
- File: pkg/utility/src/abandon.ts
- Purpose: Avoid unhandled promise rejection warnings when you intentionally don’t care about a promise’s outcome.
Example:

import { abandon } from "@token-ring/utility/abandon";

const p = fetch("https://example.com/api");
abandon(p); // consume resolution/rejection quietly

Cache and cache singleton
- File: pkg/utility/src/cache.ts
- Purpose: Quick in-memory caching with optional TTL per key.
Example:

import cache, { Cache } from "@token-ring/utility/cache";

// Use the singleton for convenience
await cache.getOrSet("user:42", async () => {
  const user = await loadUserFromDb(42);
  return user;
}, 5_000); // cache for 5 seconds

// Or create an isolated cache
const local = new Cache<number>();
local.set("answer", 42, 1_000);
console.log(local.get("answer")); // 42

formatLogMessages
- File: pkg/utility/src/formatLogMessage.ts
- Purpose: Stringify mixed values (including Error objects) into a readable single string.
Example:

import formatLogMessages from "@token-ring/utility/formatLogMessage";

const output = formatLogMessages([
  "User loaded",
  { id: 1, name: "Ada" },
  new Error("Oops")
]);
console.log(output);

Pretty string helpers
- File: pkg/utility/src/prettyString.ts
- Purpose: Colorize strings for terminal output (adds a trailing newline).
Example:

import { infoLine, successLine, errorLine, warningLine } from "@token-ring/utility/prettyString";

process.stdout.write(infoLine("Starting…"));
process.stdout.write(successLine("Done"));
process.stdout.write(warningLine("Careful"));
process.stdout.write(errorLine("Something went wrong"));

shellEscape
- File: pkg/utility/src/shellEscape.ts
- Purpose: Escape a string for safe inclusion in shell commands.
Example:

import { shellEscape } from "@token-ring/utility/shellEscape";

const file = "my file's name.txt";
const cmd = `cat ${shellEscape(file)}`;
// Produces: cat 'my file'\''s name.txt'

Notes
- TTL logic in Cache cleans up expired entries on access and via a setTimeout scheduled at set() time.
- formatLogMessages returns a string; when given objects, it includes a toString that JSON stringifies them where possible, and for Error includes name, message, and stack.
- prettyString helpers add a newline at the end and use standard ANSI color codes.

License
- MIT (same as the repository license).
