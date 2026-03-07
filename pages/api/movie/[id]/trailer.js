export default async function handler(req, res) {
  const { id, language = 'en-US' } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=${language}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Fallback to English if no results in chosen language
    if ((!data.results || data.results.length === 0) && language !== 'en-US') {
      const fallbackRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`);
      const fallbackData = await fallbackRes.json();
      return res.status(200).json(fallbackData);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trailer' });
  }
}
