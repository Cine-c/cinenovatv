import { useState } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import MatchCard from '../../components/sports/MatchCard';
import StandingsTable from '../../components/sports/StandingsTable';
import AdSlot from '../../components/AdSlot';
import { footballApi, getCurrentSeason, getTodayDate } from '../../lib/sportsApi';

const LEAGUES = [
  { id: '39', name: 'Premier League' },
  { id: '140', name: 'La Liga' },
  { id: '135', name: 'Serie A' },
  { id: '78', name: 'Bundesliga' },
  { id: '61', name: 'Ligue 1' },
  { id: '2', name: 'Champions League' },
];

export default function Football({ initialFixtures, initialStandings, initialLeague }) {
  const [activeLeague, setActiveLeague] = useState(initialLeague);
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [standings, setStandings] = useState(initialStandings);
  const [loading, setLoading] = useState(false);

  const switchLeague = async (leagueId) => {
    if (leagueId === activeLeague) return;
    setActiveLeague(leagueId);
    setLoading(true);

    try {
      const [fixRes, standRes] = await Promise.all([
        fetch(`/api/sports/football/fixtures?league=${leagueId}`),
        fetch(`/api/sports/football/standings?league=${leagueId}`),
      ]);
      const [fixData, standData] = await Promise.all([
        fixRes.json(),
        standRes.json(),
      ]);
      setFixtures(Array.isArray(fixData) ? fixData : []);
      setStandings(Array.isArray(standData) ? standData : []);
    } catch {
      setFixtures([]);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  const leagueName = LEAGUES.find((l) => l.id === activeLeague)?.name || 'Football';

  return (
    <>
      <SEOHead
        title={`${leagueName} - Live Scores & Standings | CineNovaTV Sports`}
        description={`Live ${leagueName} scores, fixtures, and league standings. Follow your favorite football league.`}
        url="/sports/football"
      />

      <section className="sports-hero sports-hero--football">
        <div className="sports-hero-content">
          <h1>
            <span className="sports-hero-icon">{'\u26BD'}</span>
            Football
          </h1>
          <p>Live scores, standings & fixtures from top leagues</p>
        </div>
      </section>

      <div className="league-tabs">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            className={`league-tab${activeLeague === league.id ? ' league-tab--active' : ''}`}
            onClick={() => switchLeague(league.id)}
          >
            {league.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="sports-loading">
          <div className="sports-spinner" />
          <p>Loading {leagueName}...</p>
        </div>
      ) : (
        <>
          <section className="home-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <span className="section-icon">{'\uD83D\uDCC5'}</span>
                  Today's Matches
                </h2>
                <p className="section-subtitle">{leagueName} fixtures for today</p>
              </div>
            </div>
            {fixtures.length > 0 ? (
              <div className="match-grid">
                {fixtures.map((f) => (
                  <MatchCard key={f.fixture.id} fixture={f} />
                ))}
              </div>
            ) : (
              <div className="sports-empty">
                <p>No {leagueName} matches scheduled for today.</p>
              </div>
            )}
          </section>

          <AdSlot slot="9497514084" />

          <section className="home-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <span className="section-icon">{'\uD83C\uDFC6'}</span>
                  Standings
                </h2>
                <p className="section-subtitle">{leagueName} table</p>
              </div>
            </div>
            <StandingsTable standings={standings} />
          </section>
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const season = getCurrentSeason();
  const today = getTodayDate();
  const defaultLeague = '39';

  let initialFixtures = [];
  let initialStandings = [];

  try {
    const [fixData, standData] = await Promise.all([
      footballApi(`/fixtures?league=${defaultLeague}&season=${season}&date=${today}`, 600),
      footballApi(`/standings?league=${defaultLeague}&season=${season}`, 3600),
    ]);
    initialFixtures = fixData.response || [];
    initialStandings = standData.response?.[0]?.league?.standings?.[0] || [];
  } catch (err) {
    console.error('Football page fetch error:', err);
  }

  return {
    props: {
      initialFixtures,
      initialStandings,
      initialLeague: defaultLeague,
    },
  };
}
