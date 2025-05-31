const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix MIME type for .js files (serve as application/javascript)
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// === Custom Routes for Static HTML Pages ===

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/trailer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trailer.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// === TMDB API Routes ===

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
