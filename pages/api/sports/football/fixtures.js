import { footballApi, getCurrentSeason, getTodayDate } from '../../../../lib/sportsApi';

export default async function handler(req, res) {
  const { league = '39', season, date } = req.query;
  const s = season || String(getCurrentSeason());
  const d = date || getTodayDate();

  try {
    const data = await footballApi(
      `/fixtures?league=${league}&season=${s}&date=${d}`,
      600
    );

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=1200'
    );
    res.status(200).json(data.response || []);
  } catch (err) {
    console.error('Football fixtures error:', err);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
}
