import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import { BlogPostingJsonLd } from '../../components/seo/JsonLd';
import AdSlot from '../../components/AdSlot';

export default function WhereToWatchPeakyBlindersImmortalMan() {
  return (
    <>
      <SEOHead
        title="Where to Watch Peaky Blinders: The Immortal Man (2026) — Streaming & Tickets"
        description="Find out where to watch Peaky Blinders: The Immortal Man online or in theatres. Streaming platforms, ticket links, and release date details for the 2026 film."
        url="/articles/where-to-watch-peaky-blinders-immortal-man"
        type="article"
        article={{ publishedTime: '2026-04-01T08:00:00Z', author: 'CineNovaTV' }}
      />
      <BlogPostingJsonLd
        post={{
          title: 'Where to Watch Peaky Blinders: The Immortal Man (2026)',
          description: 'Find out where to watch Peaky Blinders: The Immortal Man online or in theatres.',
          publishedAt: '2026-04-01T08:00:00Z',
          author: 'CineNovaTV',
          slug: 'where-to-watch-peaky-blinders-immortal-man',
        }}
      />

      <div className="article-page">
        <section className="article-hero">
          <span className="article-hero-badge">Streaming Guide</span>
          <h1>Where to Watch Peaky Blinders: The Immortal Man (2026)</h1>
          <div className="article-hero-meta">
            <span>Published: April 1, 2026</span>
            <span>4 min read</span>
          </div>
        </section>

        <div className="article-section">
          <h2>Overview</h2>
          <p>
            The Shelby saga reaches the big screen. <strong>Peaky Blinders: The Immortal Man</strong> is
            the highly anticipated feature-film continuation of the BBC/Netflix series that captivated
            audiences for six seasons. Directed by Tom Harper and written by creator Steven Knight,
            the film picks up in the aftermath of World War II as Tommy Shelby faces one final
            reckoning with both his enemies and his own legacy.
          </p>
          <p>
            With Cillian Murphy reprising his BAFTA-nominated role and a supporting cast that
            includes Barry Keoghan and Rebecca Ferguson, this is positioned as one of the biggest
            event films of 2026.
          </p>
        </div>

        <div className="article-section">
          <h2>Where to Watch</h2>
          <div className="article-info-grid">
            <div className="article-info-item">
              <div className="label">Theatrical Release</div>
              <div className="value">June 2026 (date TBC)</div>
            </div>
            <div className="article-info-item">
              <div className="label">Streaming</div>
              <div className="value">Netflix (expected post-theatrical window)</div>
            </div>
            <div className="article-info-item">
              <div className="label">Region</div>
              <div className="value">Worldwide theatrical + Netflix global</div>
            </div>
            <div className="article-info-item">
              <div className="label">Previous Seasons</div>
              <div className="value">Netflix (all 6 seasons)</div>
            </div>
          </div>
          <p>
            The film will debut exclusively in cinemas before moving to Netflix as part of their
            ongoing partnership with the franchise. If you want to catch up on the series before the
            film, all six seasons are currently streaming on Netflix worldwide.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-section">
          <h2>Cast & Crew</h2>
          <div className="article-cast-grid">
            <div className="article-cast-item">
              <strong>Cillian Murphy</strong>
              <span>Tommy Shelby</span>
            </div>
            <div className="article-cast-item">
              <strong>Barry Keoghan</strong>
              <span>Role TBC</span>
            </div>
            <div className="article-cast-item">
              <strong>Rebecca Ferguson</strong>
              <span>Role TBC</span>
            </div>
          </div>
          <p>
            Creator Steven Knight has confirmed the film will serve as a definitive ending to
            Tommy Shelby&apos;s story, while also laying groundwork for potential spin-off projects
            set in the same universe.
          </p>
        </div>

        <div className="article-section">
          <h2>What to Expect</h2>
          <p>
            Set in the late 1940s and early 1950s, <em>The Immortal Man</em> reportedly deals with
            the dawn of the Cold War and Tommy&apos;s entanglement with emerging geopolitical
            power plays. Expect the signature blend of stylish violence, family drama, and
            period atmosphere that made the series a cultural phenomenon.
          </p>
          <p>
            The production shot across Liverpool, Manchester, and several locations in continental
            Europe. Cinematographer George Steel (who shot the final two seasons) returns to give the
            film the same moody, desaturated look fans love.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-links">
          <Link href="/trailers">Browse Latest Trailers</Link>
          <Link href="/discover">Discover Movies</Link>
          <Link href="/articles/movies-like-peaky-blinders">Movies Like Peaky Blinders</Link>
        </div>
      </div>
    </>
  );
}
