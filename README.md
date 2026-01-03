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

- **Object utilities** (`object/`) - Object manipulation functions
- **String utilities** (`string/`) - String processing and formatting functions
- **HTTP utilities** (`http/`) - HTTP client helpers with retry logic
- **Promise utilities** (`promise/`) - Promise handling utilities
- **Registry utilities** (`registry/`) - Registry and selector classes
- **Timer utilities** (`timer/`) - Throttle and debounce functions
- **Type definitions** (`types.ts`) - Common type definitions

## API Documentation

### Object Utilities

#### `pick<T, K>(obj: T, keys: K[]): Pick<T, K>`

Creates an object composed of the picked object properties.

```typescript
import pick from '@tokenring-ai/utility/object/pick';

const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const userInfo = pick(user, ['id', 'name']);
// { id: 1, name: 'Alice' }
```

#### `omit<T, K>(obj: T, keys: K[]): Omit<T, K>`

Creates an object composed of the properties not included in the given keys array.

```typescript
import omit from '@tokenring-ai/utility/object/omit';

const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
const publicInfo = omit(user, ['email']);
// { id: 1, name: 'Alice' }
```

#### `transform<T, R>(obj: T, transformer: (value: T[keyof T], key: keyof T) => R): { [K in keyof T]: R}`

Transforms an object's values using a transformer function.

```typescript
import transform from '@tokenring-ai/utility/object/transform';

const config = { port: 3000, host: 'localhost' };
const stringConfig = transform(config, (value) => String(value));
// { port: '3000', host: 'localhost' }
```

#### `requireFields<T>(obj: T, required: (keyof T)[], context?: string): void`

Validates that required fields exist in an object.

```typescript
import requireFields from '@tokenring-ai/utility/object/requireFields';

const config = { port: 3000 };
requireFields(config, ['port', 'host'], 'ServerConfig');
// Throws: ServerConfig: Missing required field "host"
```

#### `pickValue<T, K extends keyof T>(obj: T, key: K): T[K] | undefined`

Safely picks a single value from an object.

```typescript
import pickValue from '@tokenring-ai/utility/object/pickValue';

const user = { id: 1, name: 'Alice' };
const id = pickValue(user, 'id');
// 1
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

#### `parametricObjectFilter(requirements: ParametricObjectRequirements): (obj: Record<string, unknown>) => boolean`

Creates a filter function based on parameter requirements. Supports numeric comparisons (>, <, >=, <=, =) and string equality.

```typescript
import parametricObjectFilter from '@tokenring-ai/utility/object/parametricObjectFilter';

const filter = parametricObjectFilter({
  age: '>20',
  name: 'Alice'
});

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 18 }
];

const filtered = users.filter(filter);
// [{ name: 'Alice', age: 25 }]
```

### String Utilities

#### `convertBoolean(text: string | null | undefined): boolean`

Converts string representations to boolean values.

```typescript
import convertBoolean from '@tokenring-ai/utility/string/convertBoolean';

convertBoolean('true');   // true
convertBoolean('yes');    // true
convertBoolean('1');      // true
convertBoolean('false');  // false
convertBoolean('no');     // false
convertBoolean('0');      // false
```

#### `trimMiddle(str: string, startLength: number, endLength: number): string`

Truncates the middle of a string, keeping the beginning and end.

```typescript
import trimMiddle from '@tokenring-ai/utility/string/trimMiddle';

trimMiddle('abcdefghijklmnopqrstuvwxyz', 5, 5);
// 'abcde...vwxyz'
```

#### `shellEscape(arg: string): string`

Safely escapes a string for use in shell commands.

```typescript
import { shellEscape } from '@tokenring-ai/utility/string/shellEscape';

const filename = "my file's name.txt";
const command = `cat ${shellEscape(filename)}`;
// "cat 'my file'\\\\''s name.txt'"
```

#### `joinDefault<T>(separator: string, iterable: Iterable<string> | null | undefined, defaultValue?: T): string | T`

Joins strings with a separator, providing a default value if the iterable is empty.

```typescript
import joinDefault from '@tokenring-ai/utility/string/joinDefault';

joinDefault(', ', ['a', 'b', 'c']);       // 'a, b, c'
joinDefault(', ', null, 'default');       // 'default'
joinDefault(', ', ['single']);            // 'single'
```

#### `formatLogMessages(msgs: (string | Error)[]): string`

Formats log messages similar to console.log with special handling for errors.

```typescript
import formatLogMessages from '@tokenring-ai/utility/string/formatLogMessage';

const output = formatLogMessages([
  'User loaded',
  { id: 1, name: 'Alice' },
  new Error('Connection failed')
]);
```

#### `createAsciiTable(data: string[][], options: TableOptions): string`

Generates an ASCII table with wrapping and spacing.

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

**TableOptions interface:**

| Property | Type | Description |
|----------|------|-------------|
| `columnWidths` | `number[]` | Array specifying the width of each column |
| `padding?` | `number` | Optional padding between cell content and borders (default: 0) |
| `grid?` | `boolean` | Optional flag to enable table borders (default: false) |

#### `wrapText(text: string, maxWidth: number): string[]`

Wraps text into an array of strings based on max width.

```typescript
import wrapText from '@tokenring-ai/utility/string/wrapText';

const lines = wrapText('This is a long line of text that needs to be wrapped', 20);
```

### HTTP Utilities

#### `HttpService` (abstract base class)

Base class for HTTP services with automatic JSON parsing and error handling.

```typescript
import { HttpService } from '@tokenring-ai/utility/http/HttpService';

export class MyApiService extends HttpService {
  protected baseUrl = 'https://api.example.com';
  protected defaultHeaders = { 'Content-Type': 'application/json' };

  async getUser(id: string) {
    return this.fetchJson(`/users/${id}`, {}, 'getUser');
  }
}
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `fetchJson` | `fetchJson(path: string, opts: RequestInit, context: string): Promise<any>` | Performs a JSON fetch with automatic retry logic |
| `parseJsonOrThrow` | `parseJsonOrThrow(res: Response, context: string): Promise<any>` | Parses JSON response or throws an error |

#### `doFetchWithRetry(url: string, init?: RequestInit): Promise<Response>`

Fetch with automatic retry logic for network errors and rate limiting.

```typescript
import { doFetchWithRetry } from '@tokenring-ai/utility/http/doFetchWithRetry';

const response = await doFetchWithRetry('https://api.example.com/data', {
  method: 'GET'
});
```

### Promise Utilities

#### `abandon<T>(promise: Promise<T>): void`

Intentionally abandons a promise to prevent unhandled rejection warnings.

```typescript
import { abandon } from '@tokenring-ai/utility/promise/abandon';

const fetchPromise = fetch('https://api.example.com/data');
abandon(fetchPromise); // Consume resolution/rejection quietly
```

#### `waitForAbort<T>(signal: AbortSignal, callback: (ev: Event) => Promise<T>): Promise<T>`

Waits for an AbortSignal to be triggered and resolves a promise with the callback result.

```typescript
import { waitForAbort } from '@tokenring-ai/utility/promise/waitForAbort';

const controller = new AbortController();
const signal = controller.signal;

// Wait for abort signal with callback
await waitForAbort(signal, (ev) => Promise.resolve('aborted'));
```

#### `backoff<T>(options: BackoffOptions, fn: ({ attempt }: { attempt: number }) => Promise<T | null | undefined>): Promise<T>`

Retries an async function with exponential backoff.

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

A generic registry for storing and retrieving items by string keys.

```typescript
import KeyedRegistry from '@tokenring-ai/utility/registry/KeyedRegistry';

const registry = new KeyedRegistry<string>();
registry.register('db', 'postgresql://localhost:5432');
registry.register('cache', 'redis://localhost:6379');

const dbUrl = registry.getItemByName('db');
// 'postgresql://localhost:5432'
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `register(name: string, resource: T): void` | Registers an item by name |
| `unregister` | `unregister(name: string): void` | Unregisters an item by name |
| `waitForItemByName` | `waitForItemByName(name: string, callback: (item: T) => void): void` | Waits for an item to be registered |
| `getItemByName` | `getItemByName(name: string): T \| undefined` | Gets an item by name |
| `requireItemByName` | `requireItemByName(name: string): T` | Gets an item by name or throws |
| `ensureItems` | `ensureItems(names: string[]): void` | Ensures all items exist |
| `getAllItemNames` | `getAllItemNames(): string[]` | Gets all registered item names |
| `getAllItems` | `getAllItems(): Record<string, T>` | Gets all items as a record |
| `getAllItemValues` | `getAllItemValues(): T[]` | Gets all items as an array |
| `getItemNamesLike` | `getItemNamesLike(likeName: string): string[]` | Finds items matching a pattern |
| `ensureItemNamesLike` | `ensureItemNamesLike(likeName: string): string[]` | Finds items matching a pattern or throws |
| `getItemEntriesLike` | `getItemEntriesLike(likeName: string): [string, T][]` | Gets entries matching a pattern |
| `forEach` | `forEach(callback: (key: string, item: T) => void): void` | Iterates over all items |
| `entries` | `entries(): [string, T][]` | Gets all entries |
| `registerAll` | `registerAll(items: Record<string, T>): void` | Registers multiple items |

**Pattern matching with `getItemNamesLike`:**

The `likeName` parameter supports wildcard patterns:
- Prefix matching: `'db*'` matches 'database', 'dbconnection', etc.
- Exact matching: `'db'` matches 'db' exactly

#### `TypedRegistry<MinimumType extends NamedClass>`

Registry for classes with a `name` property.

```typescript
import TypedRegistry, { NamedClass } from '@tokenring-ai/utility/registry/TypedRegistry';

class Database implements NamedClass {
  static name = 'database';
  connect() { /* ... */ }
}

class Cache implements NamedClass {
  static name = 'cache';
  connect() { /* ... */ }
}

const registry = new TypedRegistry<Database>();
registry.register(Database, Cache);

const db = registry.getItemByType(Database);
```

**Interface:**

```typescript
interface NamedClass {
  name: string;
}
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `register` | `register(...items: MinimumType[]): void` | Registers items |
| `unregister` | `unregister(...items: MinimumType[]): void` | Unregisters items |
| `getItems` | `getItems: MinimumType[]` | Gets all registered items |
| `waitForItemByType` | `waitForItemByType\<R\>(type: new () => R, callback: (item: R) => void): void` | Waits for item by type |
| `getItemByType` | `getItemByType\<R\>(type: new () => R): R \| undefined` | Gets item by type |
| `requireItemByType` | `requireItemByType\<R\>(type: new () => R): R` | Gets item by type or throws |
| `getItemByName` | `getItemByName(name: string): MinimumType \| undefined` | Gets item by name |
| `requireItemByName` | `requireItemByName(name: string): MinimumType` | Gets item by name or throws |

### Timer Utilities

#### `throttle<T extends (...args: any[]) => any>(func: T): (minWait: number, ...args: Parameters<T>) => void`

Creates a throttled function that only invokes the provided function if at least `minWait` milliseconds have elapsed since the last invocation.

```typescript
import throttle from '@tokenring-ai/utility/timer/throttle';

const throttledLog = throttle((message: string) => console.log(message));

// Will only log the first and last calls within 1 second
throttledLog(1000, 'Log 1');
throttledLog(1000, 'Log 2'); // Will be ignored
throttledLog(1000, 'Log 3'); // Will be ignored
```

#### `debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void`

Creates a debounced function that delays invoking the provided function until after `delay` milliseconds have elapsed since the last time the debounced function was invoked.

```typescript
import debounce from '@tokenring-ai/utility/timer/debounce';

const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// Will only call the search function once after 300ms of inactivity
debouncedSearch('react');
debouncedSearch('react hooks'); // Will cancel previous call
debouncedSearch('react components'); // Will cancel previous call
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
import { pick, omit, transform, pickValue } from '@tokenring-ai/utility/object';

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
const stringifiedUser = transform(user, (value) => String(value));
// { id: '1', name: 'Alice', email: 'alice@example.com', password: 'secret' }

// Get single value safely
const id = pickValue(user, 'id');
// 1
```

### Parametric Object Filtering Example

```typescript
import parametricObjectFilter from '@tokenring-ai/utility/object/parametricObjectFilter';

const filter = parametricObjectFilter({
  age: '>20',
  name: 'Alice'
});

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 18 }
];

const filtered = users.filter(filter);
// [{ name: 'Alice', age: 25 }]
```

### String Formatting Examples

```typescript
import {
  shellEscape,
  joinDefault,
  createAsciiTable,
  wrapText,
  formatLogMessages
} from '@tokenring-ai/utility/string';

// Shell escape example
const filename = "my file's name.txt";
const command = `rm ${shellEscape(filename)}`;
// "rm 'my file'\\\\''s name.txt'"

// Join with default
const items = null;
const joined = joinDefault(', ', items, 'none');
// 'none'

// ASCII table
const table = createAsciiTable(
  [
    ['Name', 'Age'],
    ['Alice', '30'],
    ['Bob', '25']
  ],
  { columnWidths: [10, 5], grid: true }
);

// Text wrapping
const lines = wrapText('This is a long line that needs to be wrapped at 30 characters', 30);
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

// Get all registered items
const allItems = dbRegistry.getAllItemValues();
// ['postgresql://localhost:5432', 'mysql://localhost:3306']

// Pattern matching
const matchingItems = dbRegistry.getItemNamesLike('my*');
// ['mysql']

// Using TypedRegistry
interface Database extends NamedClass {
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
```

### Timer Utilities Example

```typescript
import { throttle, debounce } from '@tokenring-ai/utility/timer';

// Throttle example - limit function calls to once per second
const throttledApiCall = throttle(async (param: string) => {
  console.log('API call with:', param);
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
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.
