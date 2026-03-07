import SEOHead from '../../components/seo/SEOHead';
import MatchCard from '../../components/sports/MatchCard';
import SportCard from '../../components/sports/SportCard';
import AdSlot from '../../components/AdSlot';
import { footballApi, getCurrentSeason, getTodayDate } from '../../lib/sportsApi';

const SPORTS = [
  {
    name: 'Football',
    icon: '\u26BD',
    description: 'Live scores, standings & fixtures from top leagues worldwide.',
    href: '/sports/football',
    color: '#10b981',
  },
  {
    name: 'Formula 1',
    icon: '\uD83C\uDFCE\uFE0F',
    description: 'Race results, driver standings & circuit schedules.',
    href: '/sports/f1',
    color: '#ef4444',
    comingSoon: true,
  },
  {
    name: 'NBA',
    icon: '\uD83C\uDFC0',
    description: 'Basketball scores, stats & playoff brackets.',
    href: '/sports/nba',
    color: '#f97316',
    comingSoon: true,
  },
  {
    name: 'NFL',
    icon: '\uD83C\uDFC8',
    description: 'Football scores, rankings & game highlights.',
    href: '/sports/nfl',
    color: '#3b82f6',
    comingSoon: true,
  },
  {
    name: 'MLB',
    icon: '\u26BE',
    description: 'Baseball scores, standings & season stats.',
    href: '/sports/mlb',
    color: '#8b5cf6',
    comingSoon: true,
  },
  {
    name: 'NHL',
    icon: '\uD83C\uDFD2',
    description: 'Hockey scores, standings & playoff updates.',
    href: '/sports/nhl',
    color: '#06b6d4',
    comingSoon: true,
  },
];

export default function SportsHub({ fixtures }) {
  return (
    <>
      <SEOHead
        title="Sports - Live Scores & Standings | CineNovaTV"
        description="Live sports scores, standings, and fixtures. Follow football, F1, NBA, NFL and more."
        url="/sports"
      />

      <section className="sports-hero">
        <div className="sports-hero-content">
          <h1>
            <span className="sports-hero-icon">{'\uD83C\uDFC6'}</span>
            Sports Center
          </h1>
          <p>Live scores, standings & fixtures from top leagues worldwide</p>
        </div>
      </section>

      {fixtures.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span className="section-icon">{'\u26BD'}</span>
                Today's Matches
              </h2>
              <p className="section-subtitle">Live and upcoming football fixtures</p>
            </div>
          </div>
          <div className="match-grid">
            {fixtures.slice(0, 12).map((f) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-icon">{'\uD83C\uDFAF'}</span>
              Browse Sports
            </h2>
            <p className="section-subtitle">Pick your favorite sport</p>
          </div>
        </div>
        <div className="sport-card-grid">
          {SPORTS.map((sport) => (
            <SportCard key={sport.name} sport={sport} />
          ))}
        </div>
      </section>

      <AdSlot slot="9497514084" />
    </>
  );
}

export async function getServerSideProps() {
  let fixtures = [];

  try {
    const season = getCurrentSeason();
    const today = getTodayDate();
    // Fetch fixtures from top 3 leagues for the hub
    const leagues = ['39', '140', '135'];
    const results = await Promise.all(
      leagues.map((id) =>
        footballApi(`/fixtures?league=${id}&season=${season}&date=${today}`, 600)
          .then((d) => d.response || [])
          .catch(() => [])
      )
    );
    fixtures = results.flat();
  } catch (err) {
    console.error('Sports hub fetch error:', err);
  }

  return {
    props: { fixtures },
  };
}
