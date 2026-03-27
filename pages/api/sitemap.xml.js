
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cinenovatv.com';

function urlEntry({ loc, lastmod, changefreq = 'weekly', priority = '0.5' }) {
  return `
  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSiteMap({ posts, movieIds, celebritySlugs, sceneSlugs }) {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/trailers', priority: '0.9', changefreq: 'daily' },
    { url: '/discover', priority: '0.9', changefreq: 'daily' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/blockbuster', priority: '0.7', changefreq: 'weekly' },
    { url: '/scenes', priority: '0.7', changefreq: 'weekly' },
    { url: '/oscars-2026', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
    { url: '/academy/acting-masterclass', priority: '0.6', changefreq: 'monthly' },
    { url: '/academy/cinematography', priority: '0.6', changefreq: 'monthly' },
    { url: '/academy/editing-magic', priority: '0.6', changefreq: 'monthly' },
    { url: '/academy/film-scores', priority: '0.6', changefreq: 'monthly' },
    { url: '/celebrity', priority: '0.7', changefreq: 'weekly' },
    { url: '/articles/anaconda-blood-coil', priority: '0.8', changefreq: 'weekly' },
    { url: '/articles/my-boo-2', priority: '0.8', changefreq: 'weekly' },
    { url: '/articles/chickenhare-groundhog', priority: '0.8', changefreq: 'weekly' },
    { url: '/articles/sydney-sweeney-career', priority: '0.8', changefreq: 'weekly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  ];

  const entries = [];

  // Static pages
  for (const page of staticPages) {
    entries.push(urlEntry({ loc: `${SITE_URL}${page.url}`, changefreq: page.changefreq, priority: page.priority }));
  }

  // Blog posts
  for (const post of posts) {
    entries.push(urlEntry({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: post.updatedAt ? post.updatedAt.split('T')[0] : undefined,
      changefreq: 'weekly',
      priority: '0.7',
    }));
  }

  // Movie detail pages
  for (const id of movieIds) {
    entries.push(urlEntry({
      loc: `${SITE_URL}/movies/${id}`,
      changefreq: 'weekly',
      priority: '0.8',
    }));
  }

  // Celebrity pages
  for (const slug of celebritySlugs) {
    entries.push(urlEntry({
      loc: `${SITE_URL}/celebrity/${slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    }));
  }

  // Scene pages
  for (const slug of sceneSlugs) {
    entries.push(urlEntry({
      loc: `${SITE_URL}/scenes/${slug}`,
      changefreq: 'monthly',
      priority: '0.6',
    }));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

export default async function handler(req, res) {
  let posts = [];
  let movieIds = [];
  const sceneSlugs = [
    'ill-be-back-terminator',
    'heres-looking-at-you-casablanca',
    'bullet-time-matrix',
    'i-am-your-father-empire-strikes-back',
    'shower-scene-psycho',
    'you-talking-to-me-taxi-driver',
    'heeeeres-johnny-the-shining',
    'i-could-have-gotten-more-schindlers-list',
  ];

  // Load blog posts
  try {
    const { getAllPostSlugs } = await import('../../lib/firestore');
    posts = await getAllPostSlugs();
  } catch (err) {
    console.error('Error fetching posts for sitemap:', err);
  }

  // Load celebrity slugs
  let celebritySlugs = [];
  try {
    const data = require('../../data/celebrities.json');
    celebritySlugs = (data.celebrities || []).map((c) => c.slug);
  } catch (err) {
    console.error('Error loading celebrities for sitemap:', err);
  }

  // Fetch 5 pages from each of 4 TMDB endpoints (up to ~400 unique movies)
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) {
    try {
      const endpoints = [
        'trending/movie/day',
        'movie/popular',
        'movie/now_playing',
        'movie/top_rated',
      ];
      const pages = [1, 2, 3, 4, 5];
      const fetches = [];
      for (const endpoint of endpoints) {
        for (const page of pages) {
          fetches.push(
            fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&page=${page}`)
          );
        }
      }

      const results = await Promise.allSettled(fetches);
      const ids = new Set();
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const data = await result.value.json();
          for (const m of data.results || []) {
            ids.add(m.id);
          }
        }
      }
      movieIds = [...ids];
    } catch (err) {
      console.error('Error fetching movies for sitemap:', err);
    }
  }

  const sitemap = generateSiteMap({ posts, movieIds, celebritySlugs, sceneSlugs });

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();
}
