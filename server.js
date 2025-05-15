const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Remove this route:
// app.get('/', (req, res) => {
//   res.send('Welcome to CineNovaTv API!');
// });

app.get('/api/trending/:time', async (req, res) => {
  const { time } = req.params;
  const url = `https://api.themoviedb.org/3/trending/movie/${time}?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.get('/api/genres', async (req, res) => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.get('/api/search', async (req, res) => {
  const { query, page } = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.get('/api/movie/:id/trailer', async (req, res) => {
  const { id } = req.params;
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
