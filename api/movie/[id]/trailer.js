import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}`;

  try {
    const response = await fetch(url);

    // Check if TMDB responded OK, else return error text as JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch trailer:', err);
    res.status(500).json({ error: 'Failed to fetch trailer' });
  }
}

