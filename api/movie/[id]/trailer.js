import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error('TMDB_API_KEY is missing from environment variables');
    return res.status(500).json({ error: 'Server configuration error: missing API key' });
  }

  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TMDB API error (${response.status}):`, errorText);
      return res.status(response.status).json({ error: 'TMDB API error', details: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error('Failed to fetch trailer:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
