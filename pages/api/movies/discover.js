export default async function handler(req, res) {
  const {
    page = 1,
    genre,
    year,
    sort = 'popularity.desc',
    provider,
    region = 'US',
    rating,
    search,
    language = 'en-US',
  } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing TMDB API key' });
  }

  try {
    let url;

    if (search) {
      // Search mode — uses /search/movie (doesn't support genre/sort/provider)
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${encodeURIComponent(search)}&language=${language}`;
    } else {
      // Discover mode — supports all filters
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sort}&language=${language}`;

      if (genre) {
        url += `&with_genres=${genre}`;
      }

      if (year) {
        url += `&primary_release_year=${year}`;
      }

      if (provider) {
        // Convert comma-separated to pipe-separated for TMDB OR logic
        const providerIds = provider.replace(/,/g, '|');
        url += `&with_watch_providers=${providerIds}&watch_region=${region}`;
      }

      if (rating) {
        url += `&vote_average.gte=${rating}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `TMDB API error: ${response.status}` });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to discover movies' });
  }
}
