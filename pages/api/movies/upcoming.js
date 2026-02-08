export default async function handler(req, res) {
  const { page = 1 } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
}
