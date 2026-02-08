export default async function handler(req, res) {
  const { id } = req.query;
  const omdbKey = process.env.OMDB_API_KEY;
  const tmdbKey = process.env.TMDB_API_KEY;

  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  if (!omdbKey) {
    return res.status(500).json({ error: 'Missing OMDb API key' });
  }

  try {
    // First get IMDB ID from TMDB
    let imdbId = id;

    // If it's a TMDB ID (numeric), fetch the IMDB ID
    if (!id.startsWith('tt')) {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${tmdbKey}`
      );
      const tmdbData = await tmdbRes.json();
      imdbId = tmdbData.imdb_id;

      if (!imdbId) {
        return res.status(404).json({ error: 'IMDB ID not found for this movie' });
      }
    }

    // Fetch from OMDb
    const omdbRes = await fetch(
      `http://www.omdbapi.com/?i=${imdbId}&apikey=${omdbKey}&plot=full`
    );
    const omdbData = await omdbRes.json();

    if (omdbData.Response === 'False') {
      return res.status(404).json({ error: omdbData.Error || 'Movie not found' });
    }

    res.status(200).json(omdbData);
  } catch (err) {
    console.error('OMDb fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
}
