export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
}
