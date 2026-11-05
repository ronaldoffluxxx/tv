import { put } from '@vercel/blob';
import { write } from './_store.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.ADMIN_PASSWORD || req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Wrong password' });
  const b = req.body || {};
  try {
    if (b.action === 'login') return res.json({ ok: true });
    if (b.action === 'save') {
      await write('products.json', b.products || []);
      await write('settings.json', b.settings || {});
      return res.json({ ok: true });
    }
    if (b.action === 'upload') {
      const buf = Buffer.from(String(b.data).split(',')[1], 'base64');
      const f = await put('img/product.jpg', buf, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: true });
      return res.json({ url: f.url });
    }
    res.status(400).json({ error: 'Bad request' });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
