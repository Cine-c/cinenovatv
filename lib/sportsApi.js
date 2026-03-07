const cache = new Map();

function getCacheKey(host, endpoint) {
  return `${host}${endpoint}`;
}

export async function fetchSports(host, endpoint, ttl = 600) {
  const key = getCacheKey(host, endpoint);
  const cached = cache.get(key);

  if (cached && Date.now() - cached.ts < ttl * 1000) {
    return cached.data;
  }

  const apiKey = process.env.APISPORTS_KEY;
  if (!apiKey) {
    throw new Error('Missing APISPORTS_KEY');
  }

  const res = await fetch(`https://${host}${endpoint}`, {
    headers: {
      'x-apisports-key': apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`API-Sports error: ${res.status}`);
  }

  const data = await res.json();

  cache.set(key, { data, ts: Date.now() });

  return data;
}

export function footballApi(endpoint, ttl) {
  return fetchSports('v3.football.api-sports.io', endpoint, ttl);
}

// TODO: remove fallback once API-Sports plan is upgraded
const MAX_FREE_SEASON = 2025;

export function getCurrentSeason() {
  const now = new Date();
  const season = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  return Math.min(season, MAX_FREE_SEASON);
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}
