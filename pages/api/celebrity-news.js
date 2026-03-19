/**
 * Celebrity News API Route
 *
 * Fetches latest news for a celebrity using GNews API.
 * Set GNEWS_API_KEY in your .env.local to enable.
 * Free tier: 100 requests/day at https://gnews.io
 *
 * GET /api/celebrity-news?q=Tom+Hanks+2026+movie
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    // No API key configured — return empty so client shows fallback
    return res.status(200).json({ articles: [] });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=6&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(200).json({ articles: [] });
    }

    const data = await response.json();
    const articles = (data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.image,
      source: a.source?.name || '',
      publishedAt: a.publishedAt,
    }));

    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ articles });
  } catch {
    return res.status(200).json({ articles: [] });
  }
}
