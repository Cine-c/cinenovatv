import { footballApi, getCurrentSeason } from '../../../../lib/sportsApi';

export default async function handler(req, res) {
  const { league = '39', season } = req.query;
  const s = season || String(getCurrentSeason());

  try {
    const data = await footballApi(
      `/standings?league=${league}&season=${s}`,
      3600
    );

    const standings =
      data.response?.[0]?.league?.standings?.[0] || [];

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );
    res.status(200).json(standings);
  } catch (err) {
    console.error('Football standings error:', err);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
}
