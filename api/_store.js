import { put, list } from '@vercel/blob';
export async function read(name, fallback) {
  try {
    const { blobs } = await list({ prefix: name });
    if (!blobs.length) return fallback;
    const r = await fetch(blobs[0].url + '?t=' + Date.now());
    return await r.json();
  } catch (e) { return fallback; }
}
export async function write(name, data) {
  await put(name, JSON.stringify(data), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 0 });
}
