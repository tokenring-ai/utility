export async function doFetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  const maxRetries = 3;
  let delay = 500;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, init);
    if (res.ok) return res;
    if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
      if (attempt === maxRetries) return res;
      await new Promise((r) => setTimeout(r, delay + Math.floor(Math.random() * 250)));
      delay *= 2;
      continue;
    }
    return res;
  }
  return await fetch(url, init);
}