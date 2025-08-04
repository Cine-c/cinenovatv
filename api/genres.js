// api/genres.js (not genre.js!)
export default async function handler(req, res) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Genre fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
}
