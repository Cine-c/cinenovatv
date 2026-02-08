export default async function handler(req, res) {
  const { query, page } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page || 1}&api_key=${process.env.TMDB_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
