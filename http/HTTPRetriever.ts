import { z, type ZodType } from "zod";
import type { JSONValue } from "../json/safeParse.ts";
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

export class HTTPRetriever {

  constructor(private readonly opts: HTTPRetrieverOpts) {}

  private async parseJsonOrThrow(res: Response, context: string): Promise<JSONValue> {
    const text = await res.text().catch(() => "");
    let json: JSONValue;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {}

    if (!res.ok) {
      const err: any = new Error(`${context} failed (${res.status})`);
      err.status = res.status;
      err.details = json ?? text?.slice(0, 500);
      throw err;
    }
    return json;
  }

  async fetchJson({url, opts, context, timeout}: FetchJSONOpts) : Promise<JSONValue> {
    const abortController = new AbortController();
    const handleParentAbort = () => abortController.abort();
    if (opts?.signal) opts.signal.addEventListener("abort", handleParentAbort)

    const timeoutId = setTimeout(() => abortController.abort("Request timed out"), timeout ?? this.opts.timeout);

    const absoluteURL = new URL(url, this.opts.baseUrl);

    const res = await doFetchWithRetry(absoluteURL, {
      ...opts,
      headers: { ...this.opts.headers, ...opts?.headers },
      signal: abortController.signal,
    });

    try {
      return this.parseJsonOrThrow(res, context);
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
