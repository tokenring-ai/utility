# @tokenring-ai/utility

A comprehensive collection of general-purpose utility functions and classes used across the Token Ring ecosystem. This package provides reusable helpers for common programming tasks including object manipulation, string processing, HTTP operations, promise handling, registry management, and timer utilities.

## Overview

The `@tokenring-ai/utility` package is designed to be a small, focused library of utilities that can be used across multiple projects within the Token Ring ecosystem. It's built with TypeScript and provides type-safe utilities for common development tasks.

## Installation

This package is part of the Token Ring monorepo and is typically consumed within the workspace. If you need to depend on it directly, add it to your dependencies:

```bash
bun install @tokenring-ai/utility
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@tokenring-ai/utility": "^0.2.0"
  }
}
```

## Package Structure

The package is organized into logical modules:

- **Buffer** (`buffer/`) - Binary data detection utilities
- **Object utilities** (`object/`) - Object manipulation functions including `pick`, `omit`, `transform`, `isEmpty`, `deepMerge`, `deepEquals`, `parametricObjectFilter`, `pickValue`, `requireFields`, and `pick`
- **String utilities** (`string/`) - String processing and formatting functions including `convertBoolean`, `trimMiddle`, `shellEscape`, `joinDefault`, `formatLogMessages`, `wrapText`, `markdownList`, `numberedList`, `indent`, `codeBlock`, `errorToString`, `markdownTable`, `dedupe`, `like`, `numberedList`, and `createAsciiTable`
- **HTTP utilities** (`http/`) - HTTP client helpers with retry logic including `HttpService` abstract class and `doFetchWithRetry`
- **Promise utilities** (`promise/`) - Promise handling utilities including `abandon`, `waitForAbort`, and `backoff`
- **Registry utilities** (`registry/`) - Registry and selector classes including `KeyedRegistry` and `TypedRegistry`
- **Timer utilities** (`timer/`) - Throttle and debounce functions
- **Type definitions** (`types.ts`) - Common type definitions

## API Documentation

### Buffer Utilities

#### `isBinaryData(buffer: Buffer): boolean`

Detects if a buffer contains binary data by checking for null bytes and other non-text characters in the first 8KB of the file. Binary data is detected if:
- The buffer contains null bytes (strong indicator)
- More than 30% of bytes in the first 8KB are non-printable ASCII characters

```typescript
import isBinaryData from '@tokenring-ai/utility/buffer/isBinaryData';

const buffer = Buffer.from('hello world');
const isBinary = isBinaryData(buffer); // false

const binaryBuffer = Buffer.concat([Buffer.from('image'), Buffer.from([0x00, 0x01])]);
const isBinaryResult = isBinaryData(binaryBuffer); // true
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

#### `transform<T extends object, R>(obj: T, transformer: <K extends keyof T>(value: T[K], key: K) => R): { [K in keyof T]: R }`

Transforms an object's values using a transformer function. The transformer function should accept both the value and the key.

```typescript
import transform from '@tokenring-ai/utility/object/transform';

const config = { port: 3000, host: 'localhost' };
const stringConfig = transform(config, (value, key) => String(value));
// { port: '3000', host: 'localhost' }
```

#### `isEmpty(obj: Object | Array<any> | Map<any, any> | Set<any> | null | undefined): boolean`

Checks if the provided object is empty. An object is considered empty if it is null, undefined, an empty array, an empty Map/Set, or an object with no own properties.

```typescript
import isEmpty from '@tokenring-ai/utility/object/isEmpty';

isEmpty(null);         // true
isEmpty(undefined);    // true
isEmpty([]);           // true
isEmpty([1, 2]);       // false
isEmpty({});           // true
isEmpty({ a: 1 });     // false
```

#### `deepMerge<T extends object, S extends object>(target: T | null | undefined, source: S | null | undefined): T & S`

Deep merges two objects together. Plain objects are recursively merged, while special objects (Date, Array, etc.) are replaced.

```typescript
import deepMerge from '@tokenring-ai/utility/object/deepMerge';

const configA = { port: 3000, host: 'localhost' };
const configB = { host: '127.0.0.1', cache: true };
const merged = deepMerge(configA, configB);
// { port: 3000, host: '127.0.0.1', cache: true }
```

#### `deepEquals(a: unknown, b: unknown): boolean`

Deeply compares two values for equality. Handles objects, arrays, and primitives.

```typescript
import deepEquals from '@tokenring-ai/utility/object/deepEquals';

deepEquals({ a: 1 }, { a: 1 }); // true
deepEquals([1, 2], [1, 2]);     // true
deepEquals({ a: 1 }, { a: 2 }); // false
```

#### `parametricObjectFilter(requirements: ParametricObjectRequirements): (obj: Record<string, unknown>) => boolean`

Creates a filter function based on parameter requirements. Supports numeric comparisons (>, <, >=, <=, =) and string equality. The 'name' field is treated specially - it will only match if the value exactly equals the given value and the comparison is not a string comparison operator.

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

**ParametricObjectRequirements Type:**

```typescript
type ParametricObjectRequirements = Record<string, number | string | null | undefined>;
```

**Supported Operators:**
- Numeric: `>`, `<`, `>=`, `<=`, `=`, `` (no operator)
- String: `` (no operator) only for 'name' field

#### `pickValue<T extends object>(obj: T, key: unknown): T[keyof T] | undefined`

Safely picks a single value from an object by key. Returns undefined if the key is not found or is not a string.

```typescript
import pickValue from '@tokenring-ai/utility/object/pickValue';

const user = { id: 1, name: 'Alice' };
const id = pickValue(user, 'id');
// 1

const invalidKey = pickValue(user, 'invalid');
// undefined
```

#### `requireFields<T extends Object>(obj: T, required: (keyof T)[], context: string = "Config"): void`

Validates that an object contains all required fields. Throws an error if any required field is missing or empty.

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

**Parameters:**
- `obj`: The object to validate
- `required`: Array of required field names
- `context`: Optional context string for error messages

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

Truncates the middle of a string, keeping the beginning and end. Supports up to 13 characters of omitted text (`...omitted...`). If the string is too short, returns the original string.

```typescript
import trimMiddle from '@tokenring-ai/utility/string/trimMiddle';

trimMiddle('abcdefghijklmnopqrstuvwxyz', 5, 5);
// 'abcde...vwxyz'

trimMiddle('hello', 2, 2);
// 'hello' (too short, returns original)
```

#### `shellEscape(arg: string): string`

Safely escapes a string for use in shell commands.

```typescript
import { shellEscape } from '@tokenring-ai/utility/string/shellEscape';

const filename = "my file's name.txt";
const command = `cat ${shellEscape(filename)}`;
// "cat 'my file's'\"\"\"'s name.txt'"

**Behavior:**
- Returns `''` if arg is falsy
- Returns arg as-is if it matches `^[a-zA-Z0-9_\\-./:]+$` (no special characters)
- Otherwise wraps in single quotes and escapes any single quotes within

#### `joinDefault(separator: string, iterable: Iterable<string> | null | undefined, defaultValue?: OtherReturnType): string | OtherReturnType`

Joins strings with a separator, providing a default value if the iterable is empty. Preserves the type of the default value.

```typescript
import joinDefault from '@tokenring-ai/utility/string/joinDefault';

joinDefault(', ', ['a', 'b', 'c']);       // 'a, b, c'
joinDefault(', ', null, 'none');           // 'none'
joinDefault(', ', ['single']);            // 'single'
joinDefault(', ', null, 0);               // 0 (preserves type)
```

#### `formatLogMessages(msgs: (string | Error)[]): string`

Formats log messages similar to console.log with special handling for errors. Error objects include their stack trace if available.

```typescript
import formatLogMessages from '@tokenring-ai/utility/string/formatLogMessage';

const output = formatLogMessages([
  'User loaded',
  new Error('Connection failed')
]);
// 'User loaded Error: Connection failed\n    at...'

// Note: Non-string, non-Error values are converted to strings using String()
const outputWithObject = formatLogMessages(['User', { id: 1 }]);
// 'User [object Object]'
```

#### `createAsciiTable(data: string[][], options: TableOptions): string`

Generates an ASCII table with wrapping and spacing. Supports automatic text wrapping for long content and optional table borders.

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
import wrapText from '@tokenring-ai/utility/string/wrapText';

const lines = wrapText('This is a long line of text that needs to be wrapped', 20);
// ['This is a long', 'line of text that', 'needs to be', 'wrapped']
```

#### `indent(input: string | string[], level: number): string`

Indents lines of text by a specified level. Handles both string and array of strings input.

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

#### `errorToString(error: any): string`

Converts an error or error-like value to a string representation.

```typescript
import errorToString from '@tokenring-ai/utility/string/errorToString';

errorToString('Error message');                    // 'Error message'
errorToString(new Error('Something went wrong'));  // 'Error: Something went wrong\n    at...'
errorToString(null);                               // 'Error was null'
errorToString(undefined);                          // 'Error was undefined'
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

Checks if a string matches a pattern. If the pattern ends with '*', it performs a prefix match. Otherwise, it performs an exact match (case-insensitive).

```typescript
import { like } from '@tokenring-ai/utility/string/like';

like('db*', 'database');      // true
like('db', 'database');       // false
like('database', 'database'); // true
like('DB', 'database');       // true (case-insensitive)
```

### HTTP Utilities

#### `HttpService` (abstract base class)

Base class for HTTP services with automatic JSON parsing and error handling. Extend this class to create typed HTTP clients.

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `fetchJson` | `fetchJson(path: string, opts: RequestInit, context: string): Promise<any>` | Performs a JSON fetch with automatic retry logic |
| `parseJsonOrThrow` | `parseJsonOrThrow(res: Response, context: string): Promise<any>` | Parses JSON response or throws an error |

**Abstract Properties:**
- `baseUrl`: string - The base URL for all requests
- `defaultHeaders`: Record<string, string> - Default headers for all requests

```typescript
import { HttpService } from '@tokenring-ai/utility/http/HttpService';

export class UserService extends HttpService {
  protected baseUrl = 'https://api.example.com';
  protected defaultHeaders = {
    'Content-Type': 'application/json'
  };

  async getUser(id: string) {
    return this.fetchJson(`/users/${id}`, {}, 'getUser');
  }

  async createUser(userData: any) {
    return this.fetchJson('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }, 'createUser');
  }
}
```

#### `doFetchWithRetry(url: string, init?: RequestInit): Promise<Response>`

Fetch with automatic retry logic for network errors and rate limiting. Retries up to 3 times with exponential backoff for 429 (rate limit) and 5xx server errors.

```typescript
import { doFetchWithRetry } from '@tokenring-ai/utility/http/doFetchWithRetry';

const response = await doFetchWithRetry('https://api.example.com/data', {
  method: 'GET'
});
```

**Retry logic:**
- Max retries: 3
- Initial delay: 500ms (with random jitter up to 250ms)
- Backoff multiplier: 2
- Retries on: 429 (rate limit), 500-599 (server errors)
- Immediate return on: 200-299, 300-399, 400-499 (other errors)

### Promise Utilities

#### `abandon<T>(promise: Promise<T>): void`

Intentionally abandons a promise by consuming its result and any errors without doing anything with them. This is useful to prevent unhandled promise rejection warnings when you don't care about the promise's outcome.

```typescript
import { abandon } from '@tokenring-ai/utility/promise/abandon';

const fetchPromise = fetch('https://api.example.com/data');
abandon(fetchPromise); // Consumes the promise silently
```

#### `waitForAbort<T>(signal: AbortSignal, callback: (ev: Event) => Promise<T>): Promise<T>`

Waits for an AbortSignal to be triggered and resolves a promise with the result of the provided callback function.

```typescript
import { waitForAbort } from '@tokenring-ai/utility/promise/waitForAbort';

const controller = new AbortController();
const signal = controller.signal;

// Wait for abort signal with callback
const result = await waitForAbort(signal, (ev) => {
  console.log('Aborted:', ev);
  return Promise.resolve('aborted');
});
```

#### `backoff<T>(options: BackoffOptions, fn: ({ attempt }: { attempt: number }) => Promise<T | null | undefined>): Promise<T>`

Retries an async function with exponential backoff. Returns the first non-null/undefined result, or throws an error if all attempts fail.

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

### Registry Utilities

#### `KeyedRegistry<T>`

A generic registry for storing and retrieving items by string keys. Includes support for asynchronous item retrieval with callbacks.

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `register(name: string, resource: T): void` | Registers an item by name |
| `unregister` | `unregister(name: string): void` | Unregisters an item by name |
| `waitForItemByName` | `waitForItemByName(name: string, callback: (item: T) => void): void` | Waits for an item to be registered (or returns immediately if already exists) |
| `getItemByName` | `getItemByName(name: string): T | undefined` | Gets an item by name |
| `requireItemByName` | `requireItemByName(name: string): T` | Gets an item by name or throws |
| `ensureItems` | `ensureItems(names: string[]): void` | Ensures all specified items exist (throws if any missing) |
| `getAllItemNames` | `getAllItemNames(): string[]` | Gets all registered item names |
| `getAllItemValues` | `getAllItemValues(): T[]` | Gets all items as an array |
| `getItemNamesLike` | `getItemNamesLike(likeName: string | string[]): string[]` | Finds items matching a prefix or exact name |
| `ensureItemNamesLike` | `ensureItemNamesLike(likeName: string | string[]): string[]` | Finds items matching a pattern or throws |
| `getItemEntriesLike` | `getItemEntriesLike(likeName: string | string[]): [string, T][]` | Gets entries matching a pattern |
| `forEach` | `forEach(callback: (key: string, item: T) => void): void` | Iterates over all items |
| `entries` | `entries(): [string, T][]` | Gets all entries |
| `registerAll` | `registerAll(items: Record<string, T> | Map<string, T>): void` | Registers multiple items |
| `getLongestPrefixMatch` | `getLongestPrefixMatch(input: string): { key: string; item: T; remainder: string } | undefined` | Finds the longest matching key prefix |

**Pattern matching with `getItemNamesLike`:**
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
dbRegistry.register('postgres', 'postgresql://localhost:5432');
dbRegistry.register('mysql', 'mysql://localhost:3306');

// Get all registered items
const allItems = dbRegistry.getAllItemValues();
// ['postgresql://localhost:5432', 'mysql://localhost:3306']

// Pattern matching
const matchingItems = dbRegistry.getItemNamesLike('my*');
// ['mysql']

// With callback (waits for registration if needed)
dbRegistry.waitForItemByName('postgres', (item) => {
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
interface ThingWithConstructor {
  constructor: Function;
}
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `register(...items: MinimumType[] | MinimumType[][]): void` | Registers items by their `constructor.name` property |
| `unregister` | `unregister(...items: MinimumType[]): void` | Unregisters items by their `constructor.name` property |
| `getItems` | `getItems: MinimumType[]` | Gets all registered items |
| `waitForItemByType` | `waitForItemByType<R extends MinimumType>(type: abstract new (...args: any[]) => R, callback: (item: R) => void): void` | Waits for item by type |
| `getItemByType` | `getItemByType<R extends MinimumType>(type: abstract new (...args: any[]) => R): R | undefined` | Gets item by type |
| `requireItemByType` | `requireItemByType<R extends MinimumType>(type: abstract new (...args: any[]) => R): R` | Gets item by type or throws |
| `getItemByName` | `getItemByName(name: string): MinimumType | undefined` | Gets item by name |
| `requireItemByName` | `requireItemByName(name: string): MinimumType` | Gets item by name or throws |

```typescript
import TypedRegistry from '@tokenring-ai/utility/registry/TypedRegistry';

interface Database {
  connect(): void;
}

class PostgresDatabase implements Database {
  static name = 'postgres';
  connect() { /* ... */ }
}

class MySqlDatabase implements Database {
  static name = 'mysql';
  connect() { /* ... */ }
}

const typedRegistry = new TypedRegistry<Database>();
typedRegistry.register(PostgresDatabase, MySqlDatabase);

const db = typedRegistry.getItemByType(PostgresDatabase);
db.connect();
```

### Timer Utilities

#### `throttle<T extends (...args: any[]) => any>(func: T): (minWait: number, ...args: Parameters<T>) => void`

Creates a throttled function that only invokes the provided function if at least `minWait` milliseconds have elapsed since the last invocation. If multiple calls are made within the throttle period, only the last call will be executed at the end of the period.

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

**Technical details:**
- Uses a timestamp-based throttling mechanism
- Clears any pending timeout if a new call comes in within the period
- Executes immediately if enough time has passed since the last call
- Uses `Date.now()` for precise time tracking

#### `debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void`

Creates a debounced function that delays invoking the provided function until after `delay` milliseconds have elapsed since the last time the debounced function was invoked. If multiple calls are made within the debounce period, the function will only execute once at the end of the period.

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

**Technical details:**
- Clears any pending timeout if a new function call comes in
- Uses a single timeout that is reset on each call
- Prevents multiple executions within the delay period

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
import { pick, omit, transform, pickValue, deepMerge, deepEquals, isEmpty, parametricObjectFilter, requireFields } from '@tokenring-ai/utility/object';

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
import {
  convertBoolean,
  trimMiddle,
  shellEscape,
  joinDefault,
  createAsciiTable,
  wrapText,
  formatLogMessages,
  markdownList,
  numberedList,
  indent,
  codeBlock,
  errorToString,
  markdownTable
} from '@tokenring-ai/utility/string';

// Boolean conversion
convertBoolean('true');   // true
convertBoolean('yes');    // true
convertBoolean('false');  // false
convertBoolean('no');     // false

// String shrinking
trimMiddle('FullDocumentWithLotsOfText', 10, 10);
// 'FilenameExa...omitted...xample.txt'

// Shell escaping
const filename = "my file's name.txt";
const command = `rm ${shellEscape(filename)}`;
// "rm 'my file's'\"\"\"'s name.txt'"

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

// Error to string
const errorStr = errorToString(new Error('Something went wrong'));

// Indent text
const indented = indent('line1\nline2', 2);
```

### HTTP Service Example

```typescript
import { HttpService } from '@tokenring-ai/utility/http/HttpService';

class UserService extends HttpService {
  protected baseUrl = 'https://api.example.com';
  protected defaultHeaders = {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  };

  async getUser(id: string) {
    return this.fetchJson(`/users/${id}`, {}, 'getUser');
  }

  async createUser(userData: any) {
    return this.fetchJson('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }, 'createUser');
  }
}

const userService = new UserService();
```

### Registry Pattern Example

```typescript
import KeyedRegistry from '@tokenring-ai/utility/registry/KeyedRegistry';
import TypedRegistry from '@tokenring-ai/utility/registry/TypedRegistry';

// Create a keyed registry for connections
const dbRegistry = new KeyedRegistry<string>();

// Register different database connections
dbRegistry.register('postgres', 'postgresql://localhost:5432');
dbRegistry.register('mysql', 'mysql://localhost:3306');
dbRegistry.register('cache', 'redis://localhost:6379');

// Get all registered items
const allItems = dbRegistry.getAllItemValues();
// ['postgresql://localhost:5432', 'mysql://localhost:3306', 'redis://localhost:6379']

// Pattern matching
const matchingItems = dbRegistry.getItemNamesLike('my*');
// ['mysql', 'cache']

// With callback (waits for registration if needed)
dbRegistry.waitForItemByName('postgres', (item) => {
  console.log('Postgres registered:', item);
});

// Using TypedRegistry
interface Database {
  connect(): void;
}

class PostgresDatabase implements Database {
  static name = 'postgres';
  connect() { /* ... */ }
}

class MySqlDatabase implements Database {
  static name = 'mysql';
  connect() { /* ... */ }
}

const typedRegistry = new TypedRegistry<Database>();
typedRegistry.register(PostgresDatabase, MySqlDatabase);

const db = typedRegistry.getItemByType(PostgresDatabase);
db.connect();
```

### Timer Utilities Example

```typescript
import { throttle, debounce } from '@tokenring-ai/utility/timer';

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
import { abandon, waitForAbort, backoff } from '@tokenring-ai/utility/promise';

// Abandon promise to prevent unhandled rejection warning
const fetchPromise = fetch('https://api.example.com/data');
abandon(fetchPromise);

// Wait for abort signal
const controller = new AbortController();
const signal = controller.signal;

const result = await waitForAbort(signal, (ev) => {
  console.log('Aborted:', ev);
  return Promise.resolve('aborted');
});

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
```

### Buffer Detection Example

```typescript
import isBinaryData from '@tokenring-ai/utility/buffer/isBinaryData';

// Check if a file is binary
const buffer = fs.readFileSync('image.png');
const isBinary = isBinaryData(buffer);
console.log('Is binary:', isBinary);

const textBuffer = Buffer.from('hello world', 'utf-8');
const isText = isBinaryData(textBuffer);
console.log('Is text:', isText);
```

## Testing

This package uses vitest for unit testing. The testing setup is configured in `vitest.config.ts`.

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

## Development

### Build

```bash
bun build
```

This runs TypeScript type checking without emitting files.

### Dependencies

```bash
bun install
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.
