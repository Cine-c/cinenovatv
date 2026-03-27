export default async function handler(req, res) {
  const { movieId } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  if (!movieId || !/^\d+$/.test(movieId)) {
    return res.status(400).json({ error: 'Missing or invalid movieId parameter' });
  }

  const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `TMDB API error: ${response.status}` });
    }
    const data = await response.json();
    const us = data.results && data.results.US;
    if (!us) {
      return res.status(200).json({ providers: [] });
    }
    const flat = [...(us.flatrate || []), ...(us.ads || [])];
    const providers = flat.map(p => p.provider_name).slice(0, 4);
    res.status(200).json({ providers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watch providers' });
  }
}
