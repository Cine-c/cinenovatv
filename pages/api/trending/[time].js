// api/trending/[time].js

export default async function handler(req, res) {
  const { time, page = 1 } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  if (!['day', 'week'].includes(time)) {
    return res.status(400).json({ error: 'Invalid time parameter (must be "day" or "week")' });
  }

  const url = `https://api.themoviedb.org/3/trending/movie/${time}?api_key=${apiKey}&page=${page}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error(`TMDB error: ${text}`);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Trending fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
}
