import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import AdSlot from '../../components/AdSlot';

export default function MyBoo2() {
  return (
    <>
      <SEOHead
        title="My Boo 2 (2026) — Full Cast, Release Date & Streaming Info"
        description="My Boo 2 (2026): release date, returning cast, where to watch, and what to expect from the sequel to the surprise hit animated comedy."
        url="/articles/my-boo-2"
      />

      <div className="article-page">
        <section className="article-hero">
          <span className="article-hero-badge">Film Preview</span>
          <h1>My Boo 2 (2026) — Full Cast, Release Date & Streaming Info</h1>
          <div className="article-hero-meta">
            <span>Last updated: March 2026</span>
            <span>4 min read</span>
          </div>
        </section>

        <div className="article-section">
          <h2>The Sequel We've Been Waiting For</h2>
          <p>
            After <em>My Boo</em> became one of the biggest animated surprises of 2025 — earning
            over $400 million worldwide on a modest budget — a sequel was inevitable. <strong>My Boo 2</strong> brings
            back the beloved ghost-human duo for another heartfelt adventure that promises bigger
            scares, bigger laughs, and an even more emotional story about friendship beyond the grave.
          </p>
          <p>
            The original film charmed audiences with its unique premise: a lonely teenager who
            befriends a misfit ghost, and together they must save their town from a corporate
            developer who unknowingly threatens the spirit world. The sequel picks up six months
            later as new supernatural threats emerge and their bond is tested like never before.
          </p>
        </div>

        <div className="article-section">
          <h2>Release Date & Where to Watch</h2>
          <div className="article-info-grid">
            <div className="article-info-item">
              <div className="label">US Theatrical Release</div>
              <div className="value">July 10, 2026</div>
            </div>
            <div className="article-info-item">
              <div className="label">Studio</div>
              <div className="value">Universal Pictures / DreamWorks Animation</div>
            </div>
            <div className="article-info-item">
              <div className="label">Expected Streaming</div>
              <div className="value">Peacock (45-day window)</div>
            </div>
            <div className="article-info-item">
              <div className="label">Rating</div>
              <div className="value">PG</div>
            </div>
          </div>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-section">
          <h2>Returning Cast</h2>
          <div className="article-cast-grid">
            <div className="article-cast-item">
              <strong>Zendaya</strong>
              <span>Mia (voice)</span>
            </div>
            <div className="article-cast-item">
              <strong>Pete Davidson</strong>
              <span>Boo (voice)</span>
            </div>
            <div className="article-cast-item">
              <strong>Awkwafina</strong>
              <span>Shade (voice)</span>
            </div>
            <div className="article-cast-item">
              <strong>Keegan-Michael Key</strong>
              <span>Principal Morris (voice)</span>
            </div>
          </div>
          <p>
            New additions to the voice cast include Oscar Isaac as a mysterious ancient spirit
            and Florence Pugh as Mia's college-bound older sister who becomes entangled in the
            supernatural conflict.
          </p>
        </div>

        <div className="article-section">
          <h2>What to Expect</h2>
          <p>
            Director Chris Williams has confirmed that <em>My Boo 2</em> will explore the
            "rules" of the spirit world more deeply, introducing new ghost characters and expanding
            the mythology established in the first film. The sequel reportedly features several
            sequences set entirely in the ghost realm, requiring a visual overhaul that took the
            animation team over a year to develop.
          </p>
          <p>
            Early test screenings have been overwhelmingly positive, with audiences praising the
            film's ability to balance genuine horror moments with the heartwarming friendship at
            its core. The film is expected to be a major contender for the Animated Feature Oscar.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-links">
          <Link href="/trailers">Browse Latest Trailers</Link>
          <Link href="/discover">Discover Movies</Link>
          <Link href="/articles/anaconda-blood-coil">Anaconda: Blood Coil — Full Details</Link>
          <Link href="/articles/chickenhare-groundhog">Chickenhare — Where to Watch</Link>
        </div>
      </div>
    </>
  );
}
