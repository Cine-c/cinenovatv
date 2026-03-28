import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import { BlogPostingJsonLd } from '../../components/seo/JsonLd';
import AdSlot from '../../components/AdSlot';

export default function WhereToWatchGoat2026() {
  return (
    <>
      <SEOHead
        title="Where to Watch The G.O.A.T. (2026) — Streaming, Theatres & Release Info"
        description="Find where to watch The G.O.A.T. (2026) starring Dwayne Johnson. Streaming availability, theatrical release dates, and ticket information."
        url="/articles/where-to-watch-goat-2026"
        type="article"
        article={{ publishedTime: '2026-04-03T08:00:00Z', author: 'CineNovaTV' }}
      />
      <BlogPostingJsonLd
        post={{
          title: 'Where to Watch The G.O.A.T. (2026)',
          description: 'Find where to watch The G.O.A.T. (2026) starring Dwayne Johnson.',
          publishedAt: '2026-04-03T08:00:00Z',
          author: 'CineNovaTV',
          slug: 'where-to-watch-goat-2026',
        }}
      />

      <div className="article-page">
        <section className="article-hero">
          <span className="article-hero-badge">Streaming Guide</span>
          <h1>Where to Watch The G.O.A.T. (2026)</h1>
          <div className="article-hero-meta">
            <span>Published: April 3, 2026</span>
            <span>4 min read</span>
          </div>
        </section>

        <div className="article-section">
          <h2>Overview</h2>
          <p>
            <strong>The G.O.A.T.</strong> is a 2026 action-comedy starring Dwayne &quot;The Rock&quot;
            Johnson as a retired MMA fighter who is drawn back into the ring by a new generation of
            competitors. Blending high-octane fight choreography with buddy-comedy dynamics, the
            film has been a massive box-office hit since its theatrical debut.
          </p>
          <p>
            Directed by Rawson Marshall Thurber (who previously teamed with Johnson on <em>Red
            Notice</em> and <em>Central Intelligence</em>), the film co-stars Kevin Hart, Awkwafina,
            and Idris Elba as the main antagonist.
          </p>
        </div>

        <div className="article-section">
          <h2>Where to Watch</h2>
          <div className="article-info-grid">
            <div className="article-info-item">
              <div className="label">Theatrical Release</div>
              <div className="value">March 14, 2026</div>
            </div>
            <div className="article-info-item">
              <div className="label">Streaming</div>
              <div className="value">Amazon Prime Video (expected May 2026)</div>
            </div>
            <div className="article-info-item">
              <div className="label">Digital Purchase</div>
              <div className="value">Apple TV, Google Play, Vudu</div>
            </div>
            <div className="article-info-item">
              <div className="label">Rating</div>
              <div className="value">PG-13</div>
            </div>
          </div>
          <p>
            The G.O.A.T. is currently available in theatres nationwide. Digital rental and purchase
            options are expected within 45 days of the theatrical release, with Amazon Prime Video
            likely securing the streaming window.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-section">
          <h2>Cast</h2>
          <div className="article-cast-grid">
            <div className="article-cast-item">
              <strong>Dwayne Johnson</strong>
              <span>Marcus &quot;The Goat&quot; Cole</span>
            </div>
            <div className="article-cast-item">
              <strong>Kevin Hart</strong>
              <span>Danny &mdash; Marcus&apos;s manager</span>
            </div>
            <div className="article-cast-item">
              <strong>Idris Elba</strong>
              <span>Viktor Kozlov</span>
            </div>
            <div className="article-cast-item">
              <strong>Awkwafina</strong>
              <span>Reporter / comic relief</span>
            </div>
          </div>
        </div>

        <div className="article-section">
          <h2>Box Office & Reception</h2>
          <p>
            The G.O.A.T. opened to $85 million domestically and has crossed the $300 million mark
            worldwide, making it one of the highest-grossing films of early 2026. Critics have
            praised the chemistry between Johnson and Hart, though some noted the formulaic plot.
            Audience scores, however, have been overwhelmingly positive.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-links">
          <Link href="/trailers">Browse Latest Trailers</Link>
          <Link href="/discover">Discover Movies</Link>
          <Link href="/articles/best-movies-netflix-april-2026">Best on Netflix April 2026</Link>
        </div>
      </div>
    </>
  );
}
