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
      const contentType = response.headers.get('content-type') || '';
      let errorDetails;

      if (contentType.includes('application/json')) {
        const errorJson = await response.json();
        errorDetails = errorJson;
      } else {
        const text = await response.text();
        errorDetails = { message: text.slice(0, 300) }; // trim to avoid huge logs
      }

      console.error(`TMDB API error (${response.status}):`, errorDetails);
      return res.status(response.status).json({
        error: 'TMDB API error',
        status: response.status,
        details: errorDetails
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('Failed to fetch trailer:', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
}
