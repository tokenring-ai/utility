import type { ZodType, z } from "zod";
import { doFetchWithRetry } from "./doFetchWithRetry.ts";

export type FetchJSONOpts = {
  url: string | URL;
  context: string;
  opts?: Omit<RequestInit, "headers"> & { headers?: Record<string, string> };
  timeout?: number;
};

export type HTTPRetrieverOpts = {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout: number;
};

export class HTTPError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: string,
  ) {
    super(message);
  }
}

export class HTTPRetriever {
  constructor(private readonly opts: HTTPRetrieverOpts) {}

  async fetchText({ url, opts, context, timeout }: FetchJSONOpts): Promise<string> {
    const abortController = new AbortController();
    const handleParentAbort = () => abortController.abort();
    if (opts?.signal) opts.signal.addEventListener("abort", handleParentAbort);

    const timeoutId = setTimeout(() => abortController.abort("Request timed out"), timeout ?? this.opts.timeout);

    const absoluteURL = new URL(url, this.opts.baseUrl);
    try {
      const res = await doFetchWithRetry(absoluteURL, {
        ...opts,
        headers: { ...this.opts.headers, ...opts?.headers },
        signal: abortController.signal,
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) {
        throw new HTTPError(`${context} failed (${res.status})`, res.status, text.slice(0, 500));
      }

      return text;
    } finally {
      clearTimeout(timeoutId);
      if (opts?.signal) opts.signal.removeEventListener("abort", handleParentAbort);
    }
  }

  async fetchJson({ url, opts, context, timeout }: FetchJSONOpts): Promise<z.JSONType> {
    const abortController = new AbortController();
    const handleParentAbort = () => abortController.abort();
    if (opts?.signal) opts.signal.addEventListener("abort", handleParentAbort);

    const timeoutId = setTimeout(() => abortController.abort("Request timed out"), timeout ?? this.opts.timeout);

    const absoluteURL = new URL(url, this.opts.baseUrl);

    const res = await doFetchWithRetry(absoluteURL, {
      ...opts,
      headers: { ...this.opts.headers, ...opts?.headers },
      signal: abortController.signal,
    });

    const text = await res.text().catch(() => "");

    if (!res.ok) {
      throw new HTTPError(`${context} failed (${res.status})`, res.status, text.slice(0, 500));
    }

    if (text.length === 0) {
      throw new HTTPError(`${context} failed (empty response)`, 400, text.slice(0, 500));
    }

    try {
      return JSON.parse(text) as z.JSONType;
    } finally {
      clearTimeout(timeoutId);
      if (opts?.signal) opts.signal.removeEventListener("abort", handleParentAbort);
    }
  }

  async fetchValidatedJson<T extends ZodType>({ schema, ...args }: FetchJSONOpts & { schema: T }): Promise<z.output<T>> {
    const json = await this.fetchJson(args);
    return schema.parse(json);
  }
}
