import { read } from './_store.js';
export default async function handler(req, res) {
  const [products, settings] = await Promise.all([read('products.json', null), read('settings.json', null)]);
  res.setHeader('Cache-Control', 'no-store');
  res.json({ products, settings });
}
