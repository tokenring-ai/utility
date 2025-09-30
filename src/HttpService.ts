import {doFetchWithRetry} from "./doFetchWithRetry.ts";

export abstract class HttpService {
  protected abstract baseUrl: string;
  protected abstract defaultHeaders: Record<string, string>;

  protected async fetchJson(path: string, opts: RequestInit = {}, context: string): Promise<any> {
    const url = `${this.baseUrl}${path}`;
    const res = await doFetchWithRetry(url, {
      ...opts,
      headers: {...this.defaultHeaders, ...(opts.headers ?? {})},
    });
    return this.parseJsonOrThrow(res, context);
  }

  async parseJsonOrThrow(res: Response, context: string): Promise<any> {
    const text = await res.text().catch(() => "");
    let json: any;
    try { 
      json = text ? JSON.parse(text) : undefined; 
    } catch {}
    
    if (!res.ok) {
      const err: any = new Error(`${context} failed (${res.status})`);
      err.status = res.status;
      err.details = json ?? text?.slice(0, 500);
      throw err;
    }
    return json ?? {};
  }
}