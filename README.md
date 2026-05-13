# @tokenring-ai/utility

## Overview

A comprehensive collection of general-purpose utility functions and classes used across the Token Ring ecosystem. This
package provides reusable helpers for common programming tasks including object manipulation, string processing, HTTP
operations, promise handling, registry management, timer utilities, environment management, JSON parsing, number
utilities, and text wrapping.

**Key Features:**

- Type-safe utility functions with full TypeScript support
- General-purpose helpers for common development tasks
- Minimal dependencies: `human-id` for ID generation, `zod` for schema validation
- Modular organization with logical module grouping
- Event-driven architecture support with promise utilities
- Registry patterns for service management

## Installation

This package is part of the Token Ring monorepo and is typically consumed within the workspace. If you need to depend on
it directly, add it to your dependencies:

```bash
bun install @tokenring-ai/utility
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@tokenring-ai/utility": "0.2.0"
  }
}
```

## Package Structure

The package is organized into logical modules:

| Module      | Path        | Description                                |
|-------------|-------------|--------------------------------------------|
| Array       | `array/`    | Arrayable type utilities                   |
| Buffer      | `buffer/`   | Binary data detection utilities            |
| Environment | `env/`      | Environment variable management            |
| Error       | `error/`    | Error handling utilities                   |
| HTTP        | `http/`     | HTTP client helpers with retry logic       |
| JSON        | `json/`     | JSON parsing utilities                     |
| Number      | `number/`   | Number utilities                           |
| Object      | `object/`   | Object manipulation functions              |
| Promise     | `promise/`  | Promise handling utilities                 |
| Registry    | `registry/` | Registry and selector classes              |
| String      | `string/`   | String processing and formatting functions |
| Timer       | `timer/`    | Throttle and debounce functions            |
| Types       | `types.ts`  | Common type definitions                    |

## Core Components/API

### Array Utilities

#### `Arrayable<T>` Type

A type that represents either a single value or an array of values.

```typescript
import type { Arrayable } from '@tokenring-ai/utility/array/arrayable';

const single: Arrayable<string> = 'hello';
const multiple: Arrayable<string> = ['hello', 'world'];
```

#### `arrayableToArray<T>(value: Arrayable<T>): T[]`

Converts an Arrayable value to an array.

```typescript
import { arrayableToArray } from '@tokenring-ai/utility/array/arrayable';

arrayableToArray('hello');        // ['hello']
arrayableToArray(['hello']);      // ['hello']
```

#### `firstOfArrayable<T>(value: Arrayable<T>): T | undefined`

Gets the first element from an Arrayable.

```typescript
import { firstOfArrayable } from '@tokenring-ai/utility/array/arrayable';

firstOfArrayable('hello');        // 'hello'
firstOfArrayable(['hello']);      // 'hello'
```

#### `lastOfArrayable<T>(value: Arrayable<T>): T | undefined`

Gets the last element from an Arrayable.

```typescript
import { lastOfArrayable } from '@tokenring-ai/utility/array/arrayable';

lastOfArrayable('hello');         // 'hello'
lastOfArrayable(['a', 'b']);      // 'b'
```

#### `joinArrayable(value: Arrayable<string>, separator: string): string`

Joins an Arrayable with a separator.

```typescript
import { joinArrayable } from '@tokenring-ai/utility/array/arrayable';

joinArrayable('hello', ', ');     // 'hello'
joinArrayable(['a', 'b'], ', ');  // 'a, b'
```

#### `splitArrayable(value: Arrayable<string>, separator: string): string[]`

Splits a string by separator, or returns array as-is.

```typescript
import { splitArrayable } from '@tokenring-ai/utility/array/arrayable';

splitArrayable('a,b,c', ',');     // ['a', 'b', 'c']
splitArrayable(['a'], ',');       // ['a']
```

### Buffer Utilities

#### `isBinaryData(buffer: Buffer): boolean`

Detects if a buffer contains binary data by checking for null bytes and other non-text characters in the first 8KB of
the file.

**Detection Criteria:**

- Null bytes present (strong indicator of binary data)
- More than 30% non-printable ASCII bytes in the first 8KB

**Parameters:**

- `buffer`: The Buffer to analyze

**Returns:** `true` if binary data detected, `false` otherwise

```typescript
import { isBinaryData } from '@tokenring-ai/utility/buffer/isBinaryData';

const buffer = Buffer.from('hello world');
const isBinary = isBinaryData(buffer); // false

const binaryBuffer = Buffer.concat([Buffer.from('image'), Buffer.from([0x00, 0x01])]);
const isBinaryResult = isBinaryData(binaryBuffer); // true
```

### Environment Utilities

#### `defaultEnv(names: string | string[], defaultValue: string): string`

Retrieves environment variables with support for `_FILE` suffix for loading secrets from files. Results are cached for
performance.

**Features:**

- Checks environment variable first
- If `<VAR>_FILE` is set, reads the file content instead
- Caches results for subsequent calls
- Returns default value if not found

**Parameters:**

- `names`: Single variable name or array of names (returns first found)
- `defaultValue`: Value to return if variable not found

```typescript
import { defaultEnv } from '@tokenring-ai/utility/env/defaultEnv';

// Simple environment variable
const port = defaultEnv('PORT', '3000');

// Multiple variable names (returns first found)
const apiKey = defaultEnv(['API_KEY', 'SECRET_KEY'], '');

// With _FILE support (if API_KEY_FILE is set, reads that file)
const dbPassword = defaultEnv('DB_PASSWORD', '');
```

#### `isProductionEnvironment(): boolean`

Checks if the current environment is production (NODE_ENV !== 'development').

```typescript
import { isProductionEnvironment } from '@tokenring-ai/utility/env/isProductionEnvironment';

if (isProductionEnvironment()) {
  // Production-specific logic
}
```

#### `isDevelopmentEnvironment(): boolean`

Checks if the current environment is development (NODE_ENV === 'development').

```typescript
import { isDevelopmentEnvironment } from '@tokenring-ai/utility/env/isDevelopmentEnvironment';

if (isDevelopmentEnvironment()) {
  // Development-specific logic
}
```

### Error Utilities

#### `errorAsString(error: unknown): string`

Converts an error or error-like value to a string representation.

**Parameters:**

- `error`: The error value to convert

**Returns:** String representation of the error

```typescript
import errorAsString from '@tokenring-ai/utility/error/errorAsString';

errorAsString('Error message');                    // 'Error message'
errorAsString(new Error('Something went wrong'));  // Full stack trace
errorAsString(null);                               // 'Unknown error: null'
errorAsString(undefined);                          // 'Unknown error: undefined'
```

#### `unknownAsError(error: unknown): Error`

Converts an unknown value to an Error instance.

**Parameters:**

- `error`: The unknown value to convert

**Returns:** An Error instance

```typescript
import unknownAsError from '@tokenring-ai/utility/error/unknownAsError';

unknownAsError('Error message');                    // Error: Error message
unknownAsError(new Error('Something went wrong'));  // Error: Something went wrong
unknownAsError({ code: 500 });                      // Error: Unknown error: {"code":500}
```

### HTTP Utilities

#### `HTTPRetriever` Class

A class for making HTTP requests with retry logic, timeout support, and JSON parsing.

**Constructor Options:**

```typescript
interface HTTPRetrieverOpts {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout: number;
}
```

**Methods:**

| Method               | Signature                  | Description                                     |
|----------------------|----------------------------|-------------------------------------------------|
| `fetchJson`          | `fetchJson(opts)`          | Performs a JSON fetch with retry and timeout    |
| `fetchValidatedJson` | `fetchValidatedJson(opts)` | Fetches and validates JSON against a Zod schema |

```typescript
import { HTTPRetriever } from '@tokenring-ai/utility/http/HTTPRetriever';
import { z } from 'zod';

const retriever = new HTTPRetriever({
  baseUrl: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

// Fetch JSON with automatic retry and timeout
const data = await retriever.fetchJson({
  url: '/users/123',
  context: 'getUser',
  timeout: 3000
});

// Fetch and validate JSON
const UserSchema = z.object({ id: z.number(), name: z.string() });
const user = await retriever.fetchValidatedJson({
  url: '/users/123',
  context: 'getUser',
  schema: UserSchema
});
```

#### `doFetchWithRetry(url: string | URL, init?: RequestInit): Promise<Response>`

Fetch with automatic retry logic for network errors and rate limiting. Retries up to 3 times with exponential backoff
for 429 (rate limit) and 5xx server errors.

**Retry Configuration:**

- Max retries: 3
- Initial delay: 500ms (with random jitter up to 250ms)
- Backoff multiplier: 2
- Retries on: 429 (rate limit), 500-599 (server errors)
- Immediate return on: 200-299, 300-399, 400-499 (other errors)

```typescript
import { doFetchWithRetry } from '@tokenring-ai/utility/http/doFetchWithRetry';

const response = await doFetchWithRetry('https://api.example.com/data', {
  method: 'GET'
});
```

#### `cachedDataRetriever<T>(baseURL: string, options: RetrieverOptions): () => MaybePromise<T | null>`

Creates a function that fetches and caches data from a URL. Prevents concurrent duplicate requests and respects a cache
TTL.

**RetrieverOptions interface:**

```typescript
interface RetrieverOptions {
  headers: Record<string, string>;
  cacheTime?: number;  // Defaults to 30000
  timeout?: number;    // Defaults to 1000
}
```

```typescript
import cachedDataRetriever from '@tokenring-ai/utility/http/cachedDataRetriever';

const getWeatherData = cachedDataRetriever('https://api.example.com/weather', {
  headers: { 'Authorization': 'Bearer token' },
  cacheTime: 60000,  // Cache for 1 minute
  timeout: 5000      // 5 second timeout
});

// Returns cached data or fetches fresh if cache expired
const data = await getWeatherData();
```

**Features:**

- Prevents concurrent duplicate requests
- Respects cache TTL (cacheTime)
- Request timeout support
- Returns null on fetch failure
- Caches the last successful response

### JSON Utilities

#### `safeParse<T>(jsonString: string, defaultValue: T): T`

Safely parses a JSON string, returning a default value if parsing fails.

**Parameters:**

- `jsonString`: The JSON string to parse
- `defaultValue`: Value to return if parsing fails

```typescript
import safeParse from '@tokenring-ai/utility/json/safeParse';

const config = safeParse('{"port": 3000}', { port: 8080 });
// { port: 3000 }

const invalidJson = safeParse('not valid json', { port: 8080 });
// { port: 8080 }
```

#### `JSONValue` Type

Represents a valid JSON value (primitive, object, or array).

```typescript
import type { JSONValue, JSONObject, JSONArray, JSONPrimitive } from '@tokenring-ai/utility/json/safeParse';

const value: JSONValue = { key: 'value' };
```

#### `JSONValueSchema`

A Zod schema for validating JSON values.

```typescript
import { JSONValueSchema } from '@tokenring-ai/utility/json/schema';

JSONValueSchema.parse({ key: 'value' });  // Valid
JSONValueSchema.parse('string');          // Valid
JSONValueSchema.parse(123);               // Valid
```

### Number Utilities

#### `clamp(value: number, min: number, max: number): number`

Clamps a number between minimum and maximum values.

```typescript
import { clamp } from '@tokenring-ai/utility/number/clamp';

clamp(5, 0, 10);     // 5
clamp(-1, 0, 10);    // 0
clamp(15, 0, 10);    // 10
```

### Object Utilities

#### `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`

Creates an object composed of the picked object properties.

```typescript
import pick from '@tokenring-ai/utility/object/pick';

const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const userInfo = pick(user, ['id', 'name']);
// { id: 1, name: 'Alice' }
```

#### `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`

Creates an object composed of the properties not included in the given keys array.

```typescript
import omit from '@tokenring-ai/utility/object/omit';

const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const publicInfo = omit(user, ['email']);
// { id: 1, name: 'Alice' }
```

#### `transform<T extends object, R>(obj: T, transformer: (value: T[K], key: K) => R): { [K in keyof T]: R }`

Transforms an object's values using a transformer function.

```typescript
import transform from '@tokenring-ai/utility/object/transform';

const config = { port: 3000, host: 'localhost' };
const stringConfig = transform(config, (value, key) => String(value));
// { port: '3000', host: 'localhost' }
```

#### `isEmpty(obj: object | Array<any> | Map<any, any> | Set<any> | null | undefined): boolean`

Checks if the provided object is empty.

```typescript
import isEmpty from '@tokenring-ai/utility/object/isEmpty';

isEmpty(null);         // true
isEmpty(undefined);    // true
isEmpty([]);           // true
isEmpty([1, 2]);       // false
isEmpty({});           // true
isEmpty({ a: 1 });     // false
```

####

`deepMerge<T extends object, S extends (object | null | undefined)[]>(target: T | null | undefined, ...sources: S): T & IntersectSources<S>`

Deep merges objects together. Plain objects are recursively merged, while special objects (Date, Array, etc.) are
replaced.

```typescript
import deepMerge from '@tokenring-ai/utility/object/deepMerge';

const configA = { port: 3000, host: 'localhost' };
const configB = { host: '127.0.0.1', cache: true };
const merged = deepMerge(configA, configB);
// { port: 3000, host: '127.0.0.1', cache: true }
```

#### `deepEquals(a: unknown, b: unknown): boolean`

Deeply compares two values for equality.

```typescript
import deepEquals from '@tokenring-ai/utility/object/deepEquals';

deepEquals({ a: 1 }, { a: 1 }); // true
deepEquals([1, 2], [1, 2]);     // true
deepEquals({ a: 1 }, { a: 2 }); // false
```

#### `deepClone<T>(value: T): T`

Creates a deep copy of a value. Handles primitives, Arrays, Dates, and Plain Objects.

```typescript
import deepClone from '@tokenring-ai/utility/object/deepClone';

const original = {
  name: 'Alice',
  details: { age: 30, hobbies: ['reading', 'coding'] },
  createdAt: new Date()
};

const clone = deepClone(original);
clone.name = 'Bob';
// original.name remains 'Alice'
```

#### `isPlainObject(value: unknown): value is Record<string, any>`

Checks if a value is a plain object (not an array, Date, or other special object).

```typescript
import { isPlainObject } from '@tokenring-ai/utility/object/isPlainObject';

isPlainObject({});           // true
isPlainObject([]);           // false
isPlainObject(new Date());   // false
isPlainObject(null);         // false
```

#### `parametricObjectFilter(requirements: ParametricObjectRequirements): (obj: Record<string, unknown>) => boolean`

Creates a filter function based on parameter requirements. Supports numeric comparisons (`>`, `<`, `>=`, `<=`, `=`) and
string equality for the 'name' field.

**ParametricObjectRequirements Type:**

```typescript
type ParametricObjectRequirements = Record<string, number | string | null | undefined>;
```

**Supported Operators:**

- Numeric: `>`, `<`, `>=`, `<=`, `=`, `` (no operator)
- String: `` (no operator) or `=` only for 'name' field

```typescript
import parametricObjectFilter from '@tokenring-ai/utility/object/parametricObjectFilter';

const filter = parametricObjectFilter({
  age: '>20',
  name: 'Alice'
});

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 18 },
  { name: 'Charlie', age: 30 }
];

const filtered = users.filter(filter);
// [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 30 }]
```

#### `pickValue<T extends object>(obj: T, key: unknown): T[keyof T] | undefined`

Safely picks a single value from an object by key.

```typescript
import pickValue from '@tokenring-ai/utility/object/pickValue';

const user = { id: 1, name: 'Alice' };
const id = pickValue(user, 'id');
// 1

const invalidKey = pickValue(user, 'invalid');
// undefined
```

#### `requireFields<T extends object>(obj: T, required: (keyof T)[], context: string = "Config"): void`

Validates that an object contains all required fields. Throws an error if any required field is missing, null,
undefined, or empty string.

```typescript
import requireFields from '@tokenring-ai/utility/object/requireFields';

const config = {
  port: 3000,
  host: 'localhost',
  username: '',
  password: undefined
};

requireFields(config, ['port', 'host', 'username', 'password'], 'Config');
// Throws: Config: Missing required field "username"
```

### Promise Utilities

####

`backoff<T>(options: BackoffOptions, fn: ({ attempt }: { attempt: number }) => MaybePromise<T | null | undefined>): Promise<T>`

Retries an async function with exponential backoff. Returns the first non-null/undefined result, or throws an error if
all attempts fail.

**BackoffOptions interface:**

```typescript
interface BackoffOptions {
  times: number;         // Number of retry attempts
  interval: number;      // Initial delay in milliseconds
  multiplier: number;    // Multiplier for exponential backoff
}
```

```typescript
import { backoff } from '@tokenring-ai/utility/promise/backoff';

await backoff(
  { times: 3, interval: 1000, multiplier: 2 },
  async ({ attempt }) => {
    // Your async operation
    return attempt < 3 ? null : 'result';
  }
);
```

#### `waitForAbort<T>(signal: AbortSignal, callback: (ev: Event) => MaybePromise<T>): Promise<T>`

Waits for an AbortSignal to be triggered and resolves a promise with the result of the provided callback function.

```typescript
import waitForAbort from '@tokenring-ai/utility/promise/waitForAbort';

const controller = new AbortController();
const signal = controller.signal;

// Wait for abort signal with callback
const result = await waitForAbort(signal, (ev) => {
  console.log('Aborted:', ev);
  return Promise.resolve('aborted');
});
```

### Registry Utilities

#### `KeyedRegistry<T>`

A generic registry for storing and retrieving items by string keys. Includes support for asynchronous item retrieval
with callbacks.

**Methods:**

| Method                  | Signature                      | Description                                                  |
|-------------------------|--------------------------------|--------------------------------------------------------------|
| `set`                   | `set(name, resource)`          | Registers an item by name                                    |
| `unregister`            | `unregister(name)`             | Unregisters an item by name                                  |
| `waitFor`               | `waitFor(name, callback)`      | Waits for item registration or returns immediately if exists |
| `get`                   | `get(name)`                    | Gets an item by name, returns undefined if not found         |
| `require`               | `require(name)`                | Gets an item by name or throws                               |
| `ensureItems`           | `ensureItems(names)`           | Ensures all specified items exist (throws if any missing)    |
| `keys`                  | `keys()`                       | Gets all registered item keys as iterator                    |
| `keysArray`             | `keysArray()`                  | Gets all registered item names as array                      |
| `values`                | `values()`                     | Gets all items as iterator                                   |
| `valuesArray`           | `valuesArray()`                | Gets all items as an array                                   |
| `keysLike`              | `keysLike(likeName)`           | Finds items matching a prefix or exact name                  |
| `requireKeysLike`       | `requireKeysLike(likeName)`    | Finds items matching a pattern or throws                     |
| `entriesLike`           | `entriesLike(likeName)`        | Gets entries matching a pattern                              |
| `forEach`               | `forEach(callback)`            | Iterates over all items                                      |
| `entries`               | `entries()`                    | Gets all entries as iterator                                 |
| `entriesArray`          | `entriesArray()`               | Gets all entries as array                                    |
| `getLongestPrefixMatch` | `getLongestPrefixMatch(input)` | Finds the longest matching key prefix                        |
| `setAll`                | `setAll(items)`                | Registers multiple items                                     |

**Pattern matching with `keysLike`:**

The `likeName` parameter supports:

- Prefix matching: `'db*'` matches `'database'`, `'dbconnection'`, etc.
- Exact matching: `'db'` matches `'db'` exactly
- Case-insensitive matching
- Array of patterns: `['db*', 'cache*']`

```typescript
import KeyedRegistry from '@tokenring-ai/utility/registry/KeyedRegistry';

// Create a keyed registry for connections
const dbRegistry = new KeyedRegistry<string>();

// Register different database connections
dbRegistry.set('postgres', 'postgresql://localhost:5432');
dbRegistry.set('mysql', 'mysql://localhost:3306');

// Get all registered items
const allItems = dbRegistry.valuesArray();
// ['postgresql://localhost:5432', 'mysql://localhost:3306']

// Pattern matching
const matchingItems = dbRegistry.keysLike('my*');
// ['mysql']

// With callback (waits for registration if needed)
dbRegistry.waitFor('postgres', (item) => {
  console.log('Postgres registered:', item);
});

// Ensure items exist
dbRegistry.ensureItems(['postgres', 'mysql']);

// Longest prefix match (useful for command routing)
const match = dbRegistry.getLongestPrefixMatch('db connect');
// { key: 'db', item: ..., remainder: 'connect' }
```

#### `TypedRegistry<MinimumType extends ThingWithConstructor>`

Registry for classes with a `constructor` property. Automatically registers and retrieves classes by type.

**Interface:**

```typescript
type ThingWithConstructor = {
  constructor: Function;
};
```

**Methods:**

| Method              | Signature                           | Description                                            |
|---------------------|-------------------------------------|--------------------------------------------------------|
| `register`          | `register(...items)`                | Registers items by their `constructor.name` property   |
| `unregister`        | `unregister(...items)`              | Unregisters items by their `constructor.name` property |
| `getItems`          | `getItems`                          | Gets all registered items                              |
| `waitForItemByType` | `waitForItemByType(type, callback)` | Waits for item by type                                 |
| `getItemByType`     | `getItemByType(type)`               | Gets item by type, returns undefined if not found      |
| `requireItemByType` | `requireItemByType(type)`           | Gets item by type or throws                            |

```typescript
import TypedRegistry from '@tokenring-ai/utility/registry/TypedRegistry';

interface Database {
  connect(): void;
}

class PostgresDatabase implements Database {
  connect() { /* ... */
  }
}

class MySqlDatabase implements Database {
  connect() { /* ... */
  }
}

const typedRegistry = new TypedRegistry<Database>();
typedRegistry.register(new PostgresDatabase(), new MySqlDatabase());

const db = typedRegistry.getItemByType(PostgresDatabase);
db?.connect();
```

### String Utilities

#### `convertBoolean(text: string | undefined | null): boolean`

Converts string representations to boolean values. Throws an Error if the text is any other value.

```typescript
import convertBoolean from '@tokenring-ai/utility/string/convertBoolean';

convertBoolean('true');   // true
convertBoolean('yes');    // true
convertBoolean('1');      // true
convertBoolean('false');  // false
convertBoolean('no');     // false
convertBoolean('0');      // false
convertBoolean('maybe');  // Error: Unknown string used as boolean value: maybe
```

#### `trimMiddle(str: string, startLength: number, endLength: number): string`

Truncates the middle of a string, keeping the beginning and end. Supports up to 13 characters of omitted text (
`...omitted...`). If the string is too short, returns the original string.

```typescript
import trimMiddle from '@tokenring-ai/utility/string/trimMiddle';

trimMiddle('abcdefghijklmnopqrstuvwxyz', 5, 5);
// 'abcde...vwxyz'

trimMiddle('hello', 2, 2);
// 'hello' (too short, returns original)
```

#### `shellEscape(arg: string): string`

Safely escapes a string for use in shell commands.

**Behavior:**

- Returns `''` if arg is falsy
- Returns arg as-is if it matches `^[a-zA-Z0-9_\-./:]+$` (no special characters)
- Otherwise wraps in single quotes and escapes any single quotes within

```typescript
import { shellEscape } from '@tokenring-ai/utility/string/shellEscape';

const filename = "my file's name.txt";
const command = `cat ${shellEscape(filename)}`;
// "cat 'my file's'\\\\''s name.txt'"
```

####

`joinDefault<OtherReturnType>(separator: string, iterable: Iterable<string> | null | undefined, defaultValue: OtherReturnType): string | OtherReturnType`

Joins strings with a separator, providing a default value if the iterable is empty. Preserves the type of the default
value.

```typescript
import joinDefault from '@tokenring-ai/utility/string/joinDefault';

joinDefault(', ', ['a', 'b', 'c']);       // 'a, b, c'
joinDefault(', ', null, 'none');          // 'none'
joinDefault(', ', ['single']);            // 'single'
joinDefault(', ', null, 0);               // 0 (preserves type)
```

#### `formatLogMessages(msgs: (string | Error)[]): string`

Formats log messages similar to console.log with special handling for errors. Error objects include their stack trace if
available.

```typescript
import formatLogMessages from '@tokenring-ai/utility/string/formatLogMessage';

const output = formatLogMessages([
  'User loaded',
  new Error('Connection failed')
]);
// 'User loaded Error: Connection failed\n    at...'
```

#### `createAsciiTable(data: string[][], options: TableOptions): string`

Generates an ASCII table with wrapping and spacing. Supports automatic text wrapping for long content and optional table
borders.

**TableOptions interface:**

```typescript
interface TableOptions {
  columnWidths: number[];
  padding?: number;
  header?: string[];
  grid?: boolean;
}
```

```typescript
import { createAsciiTable } from '@tokenring-ai/utility/string/asciiTable';

const table = createAsciiTable(
  [
    ['Name', 'Age', 'Email'],
    ['Alice', '30', 'alice@example.com'],
    ['Bob', '25', 'bob@example.com']
  ],
  {
    columnWidths: [10, 5, 20],
    padding: 1,
    grid: true
  }
);
```

#### `wrapText(text: string, maxWidth: number): string[]`

Wraps text into an array of strings based on max width, preserving paragraphs.

```typescript
import { wrapText } from '@tokenring-ai/utility/string/wrapText';

const lines = wrapText('This is a long line of text that needs to be wrapped', 20);
// ['This is a long', 'line of text that', 'needs to be', 'wrapped']
```

#### `wrapPlainText(text: string, width: number): string[]`

Wraps plain text into an array of strings based on width, handling tabs and newlines.

```typescript
import { wrapPlainText } from '@tokenring-ai/utility/string/wrapPlainText';

const lines = wrapPlainText('This is a long line of text that needs to be wrapped', 20);
// ['This is a long line', 'of text that needs', 'to be wrapped']
```

#### `flattenWrappedLines(lines: string[], width: number, prefix = ""): string[]`

Flattens already wrapped lines, re-wrapping them with a specified prefix and width.

```typescript
import { flattenWrappedLines } from '@tokenring-ai/utility/string/flattenWrappedLines';

const lines = ['Line 1', 'Line 2 with more text'];
const flattened = flattenWrappedLines(lines, 20, '> ');
// ['> Line 1', '> Line 2 with more text']
```

#### `visibleLength(text: string): number`

Calculates the visible length of a string (number of characters).

```typescript
import { visibleLength } from '@tokenring-ai/utility/string/visibleLength';

visibleLength('hello');  // 5
visibleLength('⠋⠙⠹');    // 3
```

#### `truncateVisible(text: string, width: number): string`

Truncates text to a specified visible width, adding an ellipsis if truncated.

```typescript
import { truncateVisible } from '@tokenring-ai/utility/string/truncateVisible';

truncateVisible('hello world', 8);  // 'hello wo…'
truncateVisible('hi', 10);          // 'hi'
```

#### `indent(input: string | string[], level: number): string`

Indents lines of text by a specified level. Handles both string and array of strings input. Trims each line before
indenting.

```typescript
import indent from '@tokenring-ai/utility/string/indent';

indent('line1\nline2', 2);
// '  line1\n  line2'

indent(['line1', 'line2', 'line3'], 3);
// '     line1\n     line2\n     line3'
```

#### `markdownList(items: string[], indentLevel: number = 1): string`

Creates a markdown list with the specified items and indentation level.

```typescript
import markdownList from '@tokenring-ai/utility/string/markdownList';

markdownList(['Item 1', 'Item 2', 'Item 3']);
// '- Item 1\n- Item 2\n- Item 3'

markdownList(['Item 1', 'Item 2'], 3);
// '   - Item 1\n   - Item 2'
```

#### `numberedList(items: string[], indentLevel: number = 1): string`

Creates a numbered list with the specified items and indentation level.

```typescript
import numberedList from '@tokenring-ai/utility/string/numberedList';

numberedList(['Item 1', 'Item 2', 'Item 3']);
// '1. Item 1\n2. Item 2\n3. Item 3'

numberedList(['Item 1', 'Item 2'], 3);
// '   1. Item 1\n   2. Item 2'
```

#### `codeBlock(code: string, language: string = ''): string`

Wraps code in a Markdown code block with optional language specification.

```typescript
import codeBlock from '@tokenring-ai/utility/string/codeBlock';

const code = 'console.log("Hello, world!");';
const block = codeBlock(code, 'typescript');
// ```typescript
// console.log("Hello, world!");
// ```
```

#### `markdownTable(columns: string[], rows: string[][]): string`

Generates a Markdown table from columns and rows.

```typescript
import markdownTable from '@tokenring-ai/utility/string/markdownTable';

const table = markdownTable(
  ['Name', 'Age'],
  [
    ['Alice', '30'],
    ['Bob', '25']
  ]
);
// | Name  | Age |
// |-------|-----|
// | Alice | 30  |
// | Bob   | 25  |
```

#### `dedupe(items: string[]): string[]`

Removes duplicate strings from an array while preserving order.

```typescript
import { dedupe } from '@tokenring-ai/utility/string/dedupe';

const items = ['a', 'b', 'a', 'c', 'b'];
const unique = dedupe(items);
// ['a', 'b', 'c']
```

#### `like(likeName: string, thing: string): boolean`

Checks if a string matches a pattern. If the pattern ends with `*`, it performs a prefix match. Otherwise, it performs
an exact match (case-insensitive).

```typescript
import { like } from '@tokenring-ai/utility/string/like';

like('db*', 'database');      // true
like('db', 'database');       // false
like('database', 'database'); // true
like('DB', 'database');       // true (case-insensitive)
```

#### `generateHumanId(): string`

Generates a human-readable unique identifier using the `human-id` library with a random number suffix.

```typescript
import { generateHumanId } from '@tokenring-ai/utility/string/generateHumanId';

const id = generateHumanId();
// 'clever-hamster-427'
```

#### `intelligentTruncate(str: string, options: TruncateOptions): string`

Truncates a string to a specified length or number of lines, ensuring it doesn't break words and handles whitespace
cleanly.

**TruncateOptions interface:**

```typescript
interface TruncateOptions {
  maxLength: number;
  suffix?: string;        // Defaults to "..."
  maxLines?: number;      // Maximum number of lines to display
}
```

```typescript
import intelligentTruncate from '@tokenring-ai/utility/string/intelligentTruncate';

intelligentTruncate('This is a long sentence that needs truncating', { maxLength: 20 });
// 'This is a long...'

intelligentTruncate('Short', { maxLength: 10 });
// 'Short'

// With maxLines
intelligentTruncate('Line 1\nLine 2\nLine 3', { maxLength: 20, maxLines: 2 });
// 'Line 1\nLine 2'
```

#### `oneOf(str: string, ...args: string[]): boolean`

Checks if a string is one of the provided options.

```typescript
import oneOf from '@tokenring-ai/utility/string/oneOf';

oneOf('red', 'red', 'green', 'blue');  // true
oneOf('yellow', 'red', 'green', 'blue'); // false
```

#### `getRandomItem(items: string[], seed: number = Math.random() * 1000): string`

Returns a random item from an array. Optionally accepts a seed for reproducibility.

```typescript
import getRandomItem from '@tokenring-ai/utility/string/getRandomItem';

const colors = ['red', 'green', 'blue'];
const randomColor = getRandomItem(colors);
// 'green' (or any other color)

// With seed for reproducibility
const sameColor = getRandomItem(colors, 42);
```

#### `workingMessages: string[]`

An array of working/status messages for use in loading indicators.

```typescript
import workingMessages from '@tokenring-ai/utility/string/workingMessages';

// ['Processing...', 'Planning...', 'Investigating...', 'Working...', 'Thinking...']
```

#### `ridiculousMessages: string[]`

An array of humorous/fun messages for use in loading indicators.

```typescript
import ridiculousMessages from '@tokenring-ai/utility/string/ridiculousMessages';

// ['Reticulating splines', 'Charging flux capacitor', 'Herding cats', ...]
```

#### `brailleSpinner: string[]`

An array of braille characters for creating spinner animations.

```typescript
import { brailleSpinner } from '@tokenring-ai/utility/string/brailleSpinner';

// ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

// Use in a spinner animation
let index = 0;
setInterval(() => {
  process.stdout.write(`\r${brailleSpinner[index % brailleSpinner.length]} Loading...`);
  index++;
}, 100);
```

### Timer Utilities

#### `throttle<T extends (...args: any[]) => any>(func: T): (minWait: number, ...args: Parameters<T>) => void`

Creates a throttled function that only invokes the provided function if at least `minWait` milliseconds have elapsed
since the last invocation. The `minWait` parameter is passed when calling the throttled function, not during creation.

**Technical details:**

- Uses a timestamp-based throttling mechanism
- Clears any pending timeout if a new call comes in within the period
- Executes immediately if enough time has passed since the last call
- Uses `Date.now()` for precise time tracking

```typescript
import throttle from '@tokenring-ai/utility/timer/throttle';

const throttledLog = throttle((message: string) => console.log(message));

// Will only log the first and last calls within 1 second
throttledLog(1000, 'Log 1');
throttledLog(1000, 'Log 2'); // Will be ignored
throttledLog(1000, 'Log 3'); // Will be ignored
// Output: 'Log 1'

// With zero minWait, executes immediately
throttledLog(0, 'Immediate'); // Executes immediately
```

#### `debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void`

Creates a debounced function that delays invoking the provided function until after `delay` milliseconds have elapsed
since the last time the debounced function was invoked.

**Technical details:**

- Clears any pending timeout if a new function call comes in
- Uses a single timeout that is reset on each call
- Prevents multiple executions within the delay period

```typescript
import debounce from '@tokenring-ai/utility/timer/debounce';

const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
  // Call search API
}, 300);

// Will only call the search function once after 300ms of inactivity
debouncedSearch('react');
debouncedSearch('react hooks'); // Cancels previous call
debouncedSearch('react components'); // Cancels previous call
// Output after 300ms: 'Searching for: react components'
```

### Type Definitions

#### `PrimitiveType`

Type representing primitive JavaScript types.

```typescript
import { PrimitiveType } from '@tokenring-ai/utility/types';

const value: PrimitiveType = 'string'; // or number, boolean, null, undefined
```

**Type definition:**

```typescript
type PrimitiveType = string | number | boolean | null | undefined;
```

## Usage Examples

### Basic Object Manipulation

```typescript
import pick from '@tokenring-ai/utility/object/pick';
import omit from '@tokenring-ai/utility/object/omit';
import transform from '@tokenring-ai/utility/object/transform';
import pickValue from '@tokenring-ai/utility/object/pickValue';
import deepMerge from '@tokenring-ai/utility/object/deepMerge';
import deepEquals from '@tokenring-ai/utility/object/deepEquals';
import isEmpty from '@tokenring-ai/utility/object/isEmpty';
import parametricObjectFilter from '@tokenring-ai/utility/object/parametricObjectFilter';
import requireFields from '@tokenring-ai/utility/object/requireFields';
import deepClone from '@tokenring-ai/utility/object/deepClone';

const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret'
};

// Pick specific fields
const publicUser = pick(user, ['id', 'name']);
// { id: 1, name: 'Alice' }

// Remove sensitive fields
const safeUser = omit(user, ['password']);
// { id: 1, name: 'Alice', email: 'alice@example.com' }

// Transform values
const stringifiedUser = transform(user, (value, key) => String(value));
// { id: '1', name: 'Alice', email: 'alice@example.com', password: 'secret' }

// Get single value safely
const id = pickValue(user, 'id');
// 1

// Check if object is empty
isEmpty(user);     // false
isEmpty({});       // true
isEmpty([]);       // true

// Deep merge
const configA = { port: 3000, host: 'localhost' };
const configB = { host: '127.0.0.1', cache: true };
const merged = deepMerge(configA, configB);
// { port: 3000, host: '127.0.0.1', cache: true }

// Deep equals
deepEquals({ a: 1 }, { a: 1 }); // true

// Deep clone
const clone = deepClone(user);
clone.name = 'Bob';
// user.name remains 'Alice'

// Parametric filtering
const filter = parametricObjectFilter({
  age: '>20',
  name: 'Alice'
});

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 18 },
  { name: 'Charlie', age: 30 }
];

const filtered = users.filter(filter);
// [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 30 }]

// Require fields
try {
  requireFields(user, ['id', 'name', 'email']);
  console.log('All required fields present');
} catch (error) {
  console.error(error.message);
}
```

### String Formatting Examples

```typescript
import convertBoolean from '@tokenring-ai/utility/string/convertBoolean';
import trimMiddle from '@tokenring-ai/utility/string/trimMiddle';
import { shellEscape } from '@tokenring-ai/utility/string/shellEscape';
import joinDefault from '@tokenring-ai/utility/string/joinDefault';
import { createAsciiTable } from '@tokenring-ai/utility/string/asciiTable';
import { wrapText } from '@tokenring-ai/utility/string/wrapText';
import { wrapPlainText } from '@tokenring-ai/utility/string/wrapPlainText';
import { flattenWrappedLines } from '@tokenring-ai/utility/string/flattenWrappedLines';
import { truncateVisible } from '@tokenring-ai/utility/string/truncateVisible';
import { visibleLength } from '@tokenring-ai/utility/string/visibleLength';
import formatLogMessages from '@tokenring-ai/utility/string/formatLogMessage';
import markdownList from '@tokenring-ai/utility/string/markdownList';
import numberedList from '@tokenring-ai/utility/string/numberedList';
import indent from '@tokenring-ai/utility/string/indent';
import codeBlock from '@tokenring-ai/utility/string/codeBlock';
import markdownTable from '@tokenring-ai/utility/string/markdownTable';
import intelligentTruncate from '@tokenring-ai/utility/string/intelligentTruncate';
import oneOf from '@tokenring-ai/utility/string/oneOf';
import getRandomItem from '@tokenring-ai/utility/string/getRandomItem';

// Boolean conversion
convertBoolean('true');   // true
convertBoolean('yes');    // true
convertBoolean('false');  // false
convertBoolean('no');     // false

// String shrinking
trimMiddle('FullDocumentWithLotsOfText', 10, 10);
// 'FullDocumen...omitted...xt'

// Shell escaping
const filename = "my file's name.txt";
const command = `rm ${shellEscape(filename)}`;

// Join with default
const items = null;
const joined = joinDefault(', ', items, 'none');
// 'none'

// ASCII table
const table = createAsciiTable(
  [
    ['Name', 'Age', 'Email'],
    ['Alice', '30', 'alice@example.com'],
    ['Bob', '25', 'bob@example.com']
  ],
  { columnWidths: [10, 5, 20], padding: 1, grid: true }
);

// Text wrapping
const lines = wrapText('This is a long line of text that needs to be wrapped', 30);

// Plain text wrapping
const plainLines = wrapPlainText('This is plain text that needs wrapping', 20);

// Flatten wrapped lines
const flattened = flattenWrappedLines(plainLines, 40, '> ');

// Truncate visible
const truncated = truncateVisible('Hello world', 8);
// 'Hello wo…'

// Visible length
const len = visibleLength('hello');  // 5

// Log formatting
const output = formatLogMessages([
  'User loaded',
  new Error('Connection failed')
]);

// Markdown list
const list = markdownList(['Item 1', 'Item 2', 'Item 3'], 2);

// Markdown table
const mdTable = markdownTable(
  ['Name', 'Age'],
  [['Alice', '30'], ['Bob', '25']]
);

// Code block
const code = codeBlock('console.log("hello")', 'typescript');

// Indent text
const indented = indent('line1\nline2', 2);

// Intelligent truncation
const truncated = intelligentTruncate('This is a long sentence', { maxLength: 15 });
// 'This is...'

// One of check
const isValid = oneOf('red', 'red', 'green', 'blue'); // true

// Random item
const colors = ['red', 'green', 'blue'];
const random = getRandomItem(colors);
```

### HTTP Retriever Example

```typescript
import { HTTPRetriever } from '@tokenring-ai/utility/http/HTTPRetriever';
import { z } from 'zod';

const retriever = new HTTPRetriever({
  baseUrl: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

// Fetch JSON
const data = await retriever.fetchJson({
  url: '/users/123',
  context: 'getUser',
  timeout: 3000
});

// Fetch and validate JSON
const UserSchema = z.object({ id: z.number(), name: z.string() });
const user = await retriever.fetchValidatedJson({
  url: '/users/123',
  context: 'getUser',
  schema: UserSchema
});
```

### Cached Data Retriever Example

```typescript
import cachedDataRetriever from '@tokenring-ai/utility/http/cachedDataRetriever';

// Create a cached retriever for API data
const getApiData = cachedDataRetriever('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer token' },
  cacheTime: 60000,  // Cache for 1 minute
  timeout: 5000      // 5 second timeout
});

// First call fetches data
const data1 = await getApiData();

// Second call within cache period returns cached data
const data2 = await getApiData(); // Returns cached data

// After cacheTime expires, fetches fresh data
```

### Registry Pattern Example

```typescript
import KeyedRegistry from '@tokenring-ai/utility/registry/KeyedRegistry';
import TypedRegistry from '@tokenring-ai/utility/registry/TypedRegistry';

// Create a keyed registry for connections
const dbRegistry = new KeyedRegistry<string>();

// Register different database connections
dbRegistry.set('postgres', 'postgresql://localhost:5432');
dbRegistry.set('mysql', 'mysql://localhost:3306');
dbRegistry.set('cache', 'redis://localhost:6379');

// Get all registered items
const allItems = dbRegistry.valuesArray();
// ['postgresql://localhost:5432', 'mysql://localhost:3306', 'redis://localhost:6379']

// Pattern matching
const matchingItems = dbRegistry.keysLike('my*');
// ['mysql', 'cache']

// With callback (waits for registration if needed)
dbRegistry.waitFor('postgres', (item) => {
  console.log('Postgres registered:', item);
});

// Using TypedRegistry
interface Database {
  connect(): void;
}

class PostgresDatabase implements Database {
  connect() { /* ... */
  }
}

class MySqlDatabase implements Database {
  connect() { /* ... */
  }
}

const typedRegistry = new TypedRegistry<Database>();
typedRegistry.register(new PostgresDatabase(), new MySqlDatabase());

const db = typedRegistry.getItemByType(PostgresDatabase);
db?.connect();
```

### Timer Utilities Example

```typescript
import throttle from '@tokenring-ai/utility/timer/throttle';
import debounce from '@tokenring-ai/utility/timer/debounce';

// Throttle example - limit function calls to once per second
const throttledApiCall = throttle(async (param: string) => {
  console.log('API call with:', param);
  // Make API call
});

throttledApiCall(1000, 'param1');
throttledApiCall(1000, 'param2'); // Will be ignored
throttledApiCall(1000, 'param3'); // Will be ignored

// Debounce example - delay execution until user stops typing
const debouncedSearch = debounce(async (query: string) => {
  console.log('Performing search for:', query);
  // Call search API
}, 300);

debouncedSearch('react');
debouncedSearch('react hooks'); // Will cancel previous call
debouncedSearch('react components'); // Will cancel previous call
// Output after 300ms: 'Performing search for: react components'
```

### Promise Utilities Example

```typescript
import { backoff } from '@tokenring-ai/utility/promise/backoff';
import waitForAbort from '@tokenring-ai/utility/promise/waitForAbort';

// Exponential backoff with retry
await backoff(
  { times: 3, interval: 1000, multiplier: 2 },
  async ({ attempt }) => {
    // Try to connect to service
    const result = await connectToService();
    if (result) return result;
    throw new Error('Connection failed');
  }
);

// Wait for abort signal
const controller = new AbortController();
const signal = controller.signal;

const result = await waitForAbort(signal, (ev) => {
  console.log('Aborted:', ev);
  return Promise.resolve('aborted');
});
```

### Buffer Detection Example

```typescript
import { isBinaryData } from '@tokenring-ai/utility/buffer/isBinaryData';
import fs from 'node:fs';

// Check if a file is binary
const buffer = fs.readFileSync('image.png');
const isBinary = isBinaryData(buffer);
console.log('Is binary:', isBinary);

const textBuffer = Buffer.from('hello world', 'utf-8');
const isText = isBinaryData(textBuffer);
console.log('Is text:', isText);
```

### Environment Utilities Example

```typescript
import { defaultEnv, isProductionEnvironment, isDevelopmentEnvironment } from '@tokenring-ai/utility/env';

// Get environment variable with fallback
const port = defaultEnv('PORT', '3000');

// Get secret from file (if API_KEY_FILE is set)
const apiKey = defaultEnv('API_KEY', '');

// Check environment
if (isDevelopmentEnvironment()) {
  console.log('Running in development mode');
}

if (isProductionEnvironment()) {
  console.log('Running in production mode');
}
```

### Human ID Generation Example

```typescript
import { generateHumanId } from '@tokenring-ai/utility/string/generateHumanId';

// Generate unique human-readable IDs
const userId = generateHumanId();
// 'clever-hamster-427'

const sessionId = generateHumanId();
// 'brave-eagle-891'
```

### Working Messages Example

```typescript
import workingMessages from '@tokenring-ai/utility/string/workingMessages';
import ridiculousMessages from '@tokenring-ai/utility/string/ridiculousMessages';

// Use working messages for status updates
const status = workingMessages[Math.floor(Math.random() * workingMessages.length)];
console.log(status); // 'Processing...'

// Use ridiculous messages for fun loading indicators
const funStatus = ridiculousMessages[Math.floor(Math.random() * ridiculousMessages.length)];
console.log(funStatus); // 'Reticulating splines'
```

### Braille Spinner Example

```typescript
import { brailleSpinner } from '@tokenring-ai/utility/string/brailleSpinner';

// Create a spinner animation
let index = 0;
const spinner = setInterval(() => {
  process.stdout.write(`\r${brailleSpinner[index % brailleSpinner.length]} Loading...`);
  index++;
}, 100);

// Stop spinner
// clearInterval(spinner);
process.stdout.write('\r\x1b[K'); // Clear line
```

### Clamp Example

```typescript
import { clamp } from '@tokenring-ai/utility/number/clamp';

// Clamp values to a range
clamp(5, 0, 10);     // 5
clamp(-1, 0, 10);    // 0
clamp(15, 0, 10);    // 10
clamp(3.5, 1, 5);    // 3.5
```

### Safe Parse Example

```typescript
import safeParse from '@tokenring-ai/utility/json/safeParse';

// Parse JSON with fallback
const config = safeParse('{"port": 3000, "host": "localhost"}', { port: 8080 });
// { port: 3000, host: 'localhost' }

// Handle invalid JSON
const invalid = safeParse('not valid json', { port: 8080 });
// { port: 8080 }

// Parse with type safety
const numbers = safeParse('[1, 2, 3]', [] as number[]);
// [1, 2, 3]
```

### Error Utilities Example

```typescript
import errorAsString from '@tokenring-ai/utility/error/errorAsString';
import unknownAsError from '@tokenring-ai/utility/error/unknownAsError';

// Convert error to string
const errorMsg = errorAsString(new Error('Something went wrong'));
console.log(errorMsg);

// Convert unknown to error
const err = unknownAsError(someUnknownValue);
throw err;
```

## Best Practices

### Import Organization

Import utilities from their specific paths for better tree-shaking:

```typescript
// Good - specific imports
import pick from '@tokenring-ai/utility/object/pick';
import { clamp } from '@tokenring-ai/utility/number/clamp';

// Avoid - importing entire modules
import * as ObjectUtils from '@tokenring-ai/utility/object';
```

### Error Handling

Always handle errors appropriately when using utilities that can throw:

```typescript
try {
  convertBoolean(userInput);
} catch (error) {
  console.error('Invalid boolean input:', error.message);
}
```

### Registry Usage

When using registries, always check if items exist before requiring them:

```typescript
const item = registry.get('myItem');
if (item) {
  // Use item
} else {
  // Handle missing item
}
```

### Caching

Take advantage of built-in caching in utilities like `defaultEnv` and `cachedDataRetriever` for better performance.

## Testing and Development

This package uses vitest for unit testing.

Run tests:

```bash
bun test
```

Run tests in watch mode:

```bash
bun test:watch
```

Run tests with coverage:

```bash
bun test:coverage
```

## Build

```bash
bun build
```

This runs TypeScript type checking without emitting files.

## Dependencies

- `human-id`: ^4.1.3
- `zod`: ^4.3.6

## Development Dependencies

- `vitest`: ^4.1.1
- `typescript`: ^6.0.2

## License

MIT License - see [LICENSE](./LICENSE) file for details.
