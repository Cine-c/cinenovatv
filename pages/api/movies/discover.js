export default async function handler(req, res) {
  const { page = 1, genre, year, sort = 'popularity.desc' } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sort}`;

  if (genre) {
    url += `&with_genres=${genre}`;
  }

  if (year) {
    url += `&primary_release_year=${year}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to discover movies' });
  }
}
