import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SEOHead from '../components/seo/SEOHead';
import { ItemListJsonLd } from '../components/seo/JsonLd';
import AdSlot from '../components/AdSlot';

export default function Blockbuster({ posts, categories }) {
  const [activeCategory, setActiveCategory] = useState('');

  const filtered = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const hero = !activeCategory ? posts[0] : filtered[0];
  const spotlight = !activeCategory ? posts.slice(1, 3) : filtered.slice(1, 3);
  const rest = !activeCategory ? posts.slice(3) : filtered.slice(3);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  return (
    <>
      <SEOHead
        title="Blockbuster"
        description="The biggest stories in film. Deep dives into the actors, directors, and moments shaping cinema today."
        url="/blockbuster"
      />
      <ItemListJsonLd items={posts.slice(0, 10)} type="BlogPosting" />

      <div className="bb-page">
        {/* ── Film Reviews ─────────────────────────── */}
        <section className="bb-reviews-section">
          <div className="bb-reviews-header">
            <h2 className="bb-section-label">Film Reviews</h2>
            <p className="bb-reviews-sub">In-depth editorial coverage of the biggest releases in theaters now.</p>
          </div>
          <div className="bb-reviews-grid">
            {[
              { slug: 'sinners-2025', title: 'Sinners', genre: 'Horror', accent: '#b5362a', tagline: 'Some sins can never be washed clean.', tmdb: 'https://image.tmdb.org/t/p/w500/qTvFWCGeGXgBRaINLY1zqgTPSpn.jpg' },
              { slug: 'superman-2025', title: 'Superman', genre: 'Superhero', accent: '#3a7ae8', tagline: 'Truth. Justice. A better tomorrow.', tmdb: 'https://image.tmdb.org/t/p/w500/oe5TVF6GQDESLsGiFrN6GyJEekh.jpg' },
              { slug: 'thunderbolts-2025', title: 'Thunderbolts*', genre: 'Superhero', accent: '#e8c240', tagline: 'Every hero has a dark side. These are the dark sides.', tmdb: 'https://image.tmdb.org/t/p/w500/hqcexYHbiTBfDIdDWxrxPtVndBX.jpg' },
              { slug: 'mission-impossible-final-reckoning-2025', title: 'Mission: Impossible – The Final Reckoning', genre: 'Action', accent: '#d44020', tagline: 'Every mission has a price. This is the final one.', tmdb: 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg' },
              { slug: 'f1-2025', title: 'F1', genre: 'Action', accent: '#e83020', tagline: 'Speed is everything. Survival is everything else.', tmdb: 'https://image.tmdb.org/t/p/w500/vqBmyAj0Xm9LnS1xe1MSlMAJyHq.jpg' },
              { slug: '28-years-later-2025', title: '28 Years Later', genre: 'Horror', accent: '#c83a00', tagline: 'The infection survived. So did they.', tmdb: 'https://image.tmdb.org/t/p/w500/n5FygjEppOvac6yEaowi26nTyw3.jpg' },
              { slug: 'avatar-fire-and-ash-2025', title: 'Avatar: Fire and Ash', genre: 'Sci-Fi', accent: '#ff8040', tagline: 'Pandora burns. The Na\'vi rise.', tmdb: 'https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg' },
              { slug: 'wicked-for-good-2025', title: 'Wicked: For Good', genre: 'Musical', accent: '#c840c8', tagline: 'Because I knew you... I have been changed for good.', tmdb: 'https://image.tmdb.org/t/p/w500/si9tolnefLSUKaqQEGz1bWArOaL.jpg' },
              { slug: 'lilo-stitch-2025', title: 'Lilo & Stitch', genre: 'Family', accent: '#4a9eff', tagline: 'Ohana means family. Nobody gets left behind.', tmdb: 'https://image.tmdb.org/t/p/w500/ckQzKpQJO4ZQDCN5evdpKcfm7Ys.jpg' },
              { slug: 'jurassic-world-rebirth-2025', title: 'Jurassic World: Rebirth', genre: 'Sci-Fi', accent: '#b0d038', tagline: 'Life always finds a way. So does danger.', tmdb: 'https://image.tmdb.org/t/p/w500/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg' },
              { slug: 'the-housemaid-2025', title: 'The Housemaid', genre: 'Thriller', accent: '#e84060', tagline: 'She was hired to serve. She was meant to survive.', tmdb: 'https://image.tmdb.org/t/p/w500/mJGFduBPAzTKzOeCeTjBBOxnalB.jpg' },
              { slug: 'scream-7', title: 'Scream VII', genre: 'Horror', accent: '#cc1a1a', tagline: 'Sidney Prescott returns. Ghostface is still calling.', tmdb: 'https://image.tmdb.org/t/p/w500/jjyuk0edLiW8vOSnlfwWCCLpbh5.jpg' },
              { slug: 'crime-101', title: 'Crime 101', genre: 'Thriller', accent: '#f0c040', tagline: 'The heist movie reborn. Hemsworth at his dramatic best.', tmdb: 'https://image.tmdb.org/t/p/w500/2HoR2x23bqKpopluoBD1FH3tBi7.jpg' },
              { slug: 'wuthering-heights', title: '"Wuthering Heights"', genre: 'Romance', accent: '#c8956a', tagline: 'Fennell\'s bold, erotic reimagining of Bront\u00eb.', tmdb: 'https://image.tmdb.org/t/p/w500/ywRO5dyE8RyyXJd6cvd69jLZeic.jpg' },
              { slug: 'goat', title: 'GOAT', genre: 'Animation', accent: '#38e5a0', tagline: 'One little goat is about to rewrite the rulebook.', tmdb: 'https://image.tmdb.org/t/p/w500/39qQwnjWdQQdFcS5KHOa0p11uRC.jpg' },
              { slug: 'how-to-make-a-killing', title: 'How to Make a Killing', genre: 'Dark Comedy', accent: '#b5200e', tagline: 'Glen Powell. A24. Seven heirs. One billion dollars.', tmdb: 'https://image.tmdb.org/t/p/w500/75eegSmvQXEJulOE1oekOsbVgTU.jpg' },
              { slug: 'captain-america-brave-new-world-2025', title: 'Captain America: Brave New World', genre: 'Superhero', accent: '#3050d0', tagline: 'A new hero. A world already in flames.', tmdb: 'https://image.tmdb.org/t/p/w500/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg' },
              { slug: 'how-to-train-your-dragon-2025', title: 'How to Train Your Dragon', genre: 'Family', accent: '#60a8e0', tagline: 'The legend takes flight in live action.', tmdb: 'https://image.tmdb.org/t/p/w500/53dsJ3oEnBhTBVMigWJ9tkA5bzJ.jpg' },
              { slug: 'minecraft-movie-2025', title: 'A Minecraft Movie', genre: 'Family', accent: '#7fc23a', tagline: 'Build your world. Survive the night.', tmdb: 'https://image.tmdb.org/t/p/w500/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg' },
              { slug: 'final-destination-bloodlines-2025', title: 'Final Destination: Bloodlines', genre: 'Horror', accent: '#b020b0', tagline: 'Death has been watching your family for generations.', tmdb: 'https://image.tmdb.org/t/p/w500/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg' },
              { slug: 'demon-slayer-infinity-castle-2025', title: 'Demon Slayer: Infinity Castle', genre: 'Anime', accent: '#e84060', tagline: 'The castle falls. The battle is everything.', tmdb: 'https://image.tmdb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg' },
              { slug: 'wake-up-dead-man-2025', title: 'Wake Up Dead Man: A Knives Out Mystery', genre: 'Mystery', accent: '#a8803a', tagline: 'God is dead. But the mystery is very much alive.', tmdb: 'https://image.tmdb.org/t/p/w500/qCOGGi8JBVEZMc3DVby8rUivyXz.jpg' },
              { slug: 'the-phoenician-scheme-2025', title: 'The Phoenician Scheme', genre: 'Comedy', accent: '#a0501a', tagline: 'An intrigue so old, only civilization could explain it.', tmdb: 'https://image.tmdb.org/t/p/w500/u2jxeYLXTYfu0bqJmnLGIgZswib.jpg' },
              { slug: 'zootopia-2-2025', title: 'Zootopia 2', genre: 'Animation', accent: '#38c87a', tagline: 'The city is bigger. The mystery goes deeper.', tmdb: 'https://image.tmdb.org/t/p/w500/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg' },
              { slug: 'karate-kid-legends-2025', title: 'Karate Kid: Legends', genre: 'Action', accent: '#e88020', tagline: 'Two masters. One student. One destiny.', tmdb: 'https://image.tmdb.org/t/p/w500/c90Lt7OQGsOmhv6x4JoFdoHzw5l.jpg' },
              { slug: 'the-naked-gun-2025', title: 'The Naked Gun', genre: 'Comedy', accent: '#40c0e8', tagline: 'The law never looked this ridiculous.', tmdb: 'https://image.tmdb.org/t/p/w500/rwla9vqzrKVVKVKiOuROTIXGsxj.jpg' },
              { slug: 'freakier-friday-2025', title: 'Freakier Friday', genre: 'Comedy', accent: '#e04090', tagline: 'They thought Friday was the worst day to switch. They were wrong.', tmdb: 'https://image.tmdb.org/t/p/w500/9wV65OmsjLAqBfDnYTkMPutXH8j.jpg' },
              { slug: 'dog-man-2025', title: 'Dog Man', genre: 'Animation', accent: '#e8a020', tagline: 'Part dog. Part man. All hero.', tmdb: 'https://image.tmdb.org/t/p/w500/89wNiexZdvLQ41OQWIsQy4O6jAQ.jpg' },
              { slug: 'the-bad-guys-2-2025', title: 'The Bad Guys 2', genre: 'Animation', accent: '#e83828', tagline: 'Reformed villains. Unreformed chaos.', tmdb: 'https://image.tmdb.org/t/p/w500/c1msaKf1wyuKcmLjjJd6rIBPFcd.jpg' },
              { slug: 'hamnet-2025', title: 'Hamnet', genre: 'Period Drama', accent: '#5a3a18', tagline: 'The boy who would become Hamlet.', tmdb: 'https://image.tmdb.org/t/p/w500/vbeyOZm2bvBXcbgPD3v6o94epPX.jpg' },
              { slug: 'materialists-2025', title: 'Materialists', genre: 'Romance', accent: '#c04030', tagline: 'Love is a transaction. The question is the exchange rate.', tmdb: 'https://image.tmdb.org/t/p/w500/zh4kaa2dGhVjojHulCWt3AR4b2l.jpg' },
              { slug: 'the-secret-agent-2025', title: 'The Secret Agent', genre: 'Thriller', accent: '#2a2010', tagline: 'Every revolution needs a spark. And someone to blame.', tmdb: 'https://image.tmdb.org/t/p/w500/iLE2YOmeboeTDC7GlOp1dzh1VFo.jpg' },
              { slug: 'the-long-walk-2025', title: 'The Long Walk', genre: 'Sci-Fi', accent: '#d8b060', tagline: 'Walk or die. It\'s that simple.', tmdb: 'https://image.tmdb.org/t/p/w500/wobVTa99eW0ht6c1rNNzLkazPtR.jpg' },
              { slug: 'the-monkey-2025', title: 'The Monkey', genre: 'Horror', accent: '#d02880', tagline: 'You wind it up. It winds you down.', tmdb: 'https://image.tmdb.org/t/p/w500/u4AoFv1549ScS5qqVFAoISvEmrp.jpg' },
              { slug: 'drop-2025', title: 'Drop', genre: 'Thriller', accent: '#c840e8', tagline: 'One date. One threat. No exit.', tmdb: 'https://image.tmdb.org/t/p/w500/hSQPSW8aLjsMBfwqGjgJ6HozTkp.jpg' },
              { slug: 'one-of-them-days-2025', title: 'One of Them Days', genre: 'Comedy', accent: '#f0c840', tagline: '30 days to save her apartment. And her best friend.', tmdb: 'https://image.tmdb.org/t/p/w500/ccn6bFUA5DECjA3Lo0CuJqGNQCv.jpg' },
              { slug: 'fnaf-2-2025', title: 'Five Nights at Freddy\'s 2', genre: 'Horror', accent: '#d04820', tagline: 'The pizzeria is open again. So is the nightmare.', tmdb: 'https://image.tmdb.org/t/p/w500/udAxQEORq2I5wxI97N2TEqdhzBE.jpg' },
              { slug: 'until-dawn-2025', title: 'Until Dawn', genre: 'Horror', accent: '#5080f0', tagline: 'The mountain has been watching. Now it strikes back.', tmdb: 'https://image.tmdb.org/t/p/w500/bLY5yN4MKVynZ2HMZWElTOGBgBe.jpg' },
              { slug: 'anaconda-2025', title: 'Anaconda', genre: 'Action', accent: '#50c830', tagline: 'The Amazon doesn\'t forgive. Neither does she.', tmdb: 'https://image.tmdb.org/t/p/w500/qxMv3HwAB3XPuwNLMhVRg795Ktp.jpg' },
              { slug: 'bring-her-back-2025', title: 'Bring Her Back', genre: 'Horror', accent: '#80d098', tagline: 'Some rituals open doors that cannot be closed.', tmdb: 'https://image.tmdb.org/t/p/w500/1Q3GlCXGYWELifxANYZ5OVMRVZl.jpg' },
              { slug: 'primate-2025', title: 'Primate', genre: 'Horror', accent: '#98c840', tagline: 'Something in the jungle is not an animal anymore.', tmdb: 'https://image.tmdb.org/t/p/w500/rKleYiEj4pFqxedTRWfujLooi84.jpg' },
              { slug: 'pillion-2026', title: 'Pillion', genre: 'Romance', accent: '#d0a040', tagline: 'Hold on. Let go. Both at once.', tmdb: 'https://image.tmdb.org/t/p/w500/7Pd6ChSQjSXy4snJiorSdzg2cG3.jpg' },
              { slug: 'no-other-choice-2026', title: 'No Other Choice', genre: 'Thriller', accent: '#e8e0d0', tagline: 'Vengeance doesn\'t need a reason. But justice might.', tmdb: 'https://image.tmdb.org/t/p/w500/sBpxTGLzKnvPSVtL5yQYpSxvKEb.jpg' },
              { slug: 'the-rip-2026', title: 'The Rip', genre: 'Crime', accent: '#40d8a0', tagline: 'Millions in cash. Zero trust. One rip tide.', tmdb: 'https://image.tmdb.org/t/p/w500/eZo31Dhl5BQ6GfbMNf3oU0tUvPZ.jpg' },
              { slug: 'back-to-the-past-2026', title: 'Back to the Past', genre: 'Sci-Fi', accent: '#60c8ff', tagline: 'Some futures are best left unchanged.', tmdb: 'https://image.tmdb.org/t/p/w500/h3OUaPfCaFmzwB2eMHik50RsXlP.jpg' },
              { slug: 'a-private-life-2026', title: 'A Private Life', genre: 'Mystery', accent: '#2a3060', tagline: 'Some cases are better left closed.', tmdb: 'https://image.tmdb.org/t/p/w500/AnZ9XzhouSSvQH337923RPFTaqK.jpg' },
              { slug: 'greenland-2-2026', title: 'Greenland 2: Migration', genre: 'Disaster', accent: '#80b0d0', tagline: 'The comet passed. The world is not what it was.', tmdb: 'https://image.tmdb.org/t/p/w500/z2tqCJLsw6uEJ8nJV8BsQXGa3dr.jpg' },
              { slug: 'dracula-2026', title: 'Dracula', genre: 'Gothic Horror', accent: '#a020a8', tagline: 'He was a prince. Then he became a god.', tmdb: 'https://image.tmdb.org/t/p/w500/libhghrUSBSEdHgF9uP1SQES0nQ.jpg' },
              { slug: 'the-strangers-chapter-3-2026', title: 'The Strangers: Chapter 3', genre: 'Horror', accent: '#a83020', tagline: 'The masks are back. So is Maya.', tmdb: 'https://image.tmdb.org/t/p/w500/yPHwX78mcwJw3I6YOJ9qh2wQBFr.jpg' },
              { slug: 'scarlet-2026', title: 'Scarlet', genre: 'Fantasy', accent: '#e04030', tagline: 'The fairy tale is over. The battle has just begun.', tmdb: 'https://image.tmdb.org/t/p/w500/iX4UEqQaFLPXmUQfcebMjq0cJZi.jpg' },
              { slug: 'mercy-2026', title: 'Mercy', genre: 'Action', accent: '#c8a040', tagline: 'No mercy for the merciful.', tmdb: 'https://image.tmdb.org/t/p/w500/pyok1kZJCfyuFapYXzHcy7BLlQa.jpg' },
              { slug: 'solo-mio-2026', title: 'Solo Mio', genre: 'Rom-Com', accent: '#c04820', tagline: 'He was left at the altar. He left for Italy anyway.', tmdb: 'https://image.tmdb.org/t/p/w500/efSsZJaddeq0LOABZqpCXdMxv9P.jpg' },
              { slug: 'epif-elvis-presley-concert-2026', title: 'EPiC: Elvis Presley in Concert', genre: 'Concert Film', accent: '#e8b020', tagline: 'The King performs. Again.', tmdb: 'https://image.tmdb.org/t/p/w500/2K2NH5dforjT9kLcUC0eeBpdZkC.jpg' },
              { slug: 'good-luck-have-fun-dont-die-2026', title: 'Good Luck, Have Fun, Don\'t Die', genre: 'Sci-Fi', accent: '#40e8c0', tagline: 'The most dangerous game just got an update.', tmdb: 'https://image.tmdb.org/t/p/w500/rWcfOdY7TU6lTdazWj0ebDZnAfO.jpg' },
              { slug: 'iron-lung-2026', title: 'Iron Lung', genre: 'Horror', accent: '#3050b8', tagline: 'Breathe. You can\'t. Survive anyway.', tmdb: 'https://image.tmdb.org/t/p/w500/sIwakdbMGS1krtgendTWpxTY9Hw.jpg' },
              { slug: 'shelter-2026', title: 'Shelter', genre: 'Thriller', accent: '#78a0d0', tagline: 'The safest place on earth. For now.', tmdb: 'https://image.tmdb.org/t/p/w500/buPFnHZ3xQy6vZEHxbHgL1Pc6CR.jpg' },
            ].map((film) => (
              <a
                key={film.slug}
                href={`/blockbuster/${film.slug}.html`}
                className="bb-review-card"
              >
                {film.tmdb ? (
                  <div className="bb-review-img">
                    <img src={film.tmdb} alt={film.title} loading="lazy" />
                    <div className="bb-review-img-overlay" />
                  </div>
                ) : (
                  <div className="bb-review-accent" style={{ background: film.accent, color: film.accent }} data-initial={film.title[0]} />
                )}
                <div className="bb-review-body">
                  <span className="bb-badge-sm" style={{ color: film.accent, background: `${film.accent}20` }}>{film.genre}</span>
                  <h3 className="bb-review-title">{film.title}</h3>
                  <p className="bb-review-tagline">{film.tagline}</p>
                  <span className="bb-review-link" style={{ color: film.accent }}>
                    Read Review
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <AdSlot />

        {/* ── Hero ────────────────────────────────── */}
        {hero && (
          <section className="bb-hero">
            <div className="bb-hero-bg">
              {hero.imageUrl && (
                <Image
                  src={hero.imageUrl}
                  alt={hero.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              )}
              <div className="bb-hero-overlay" />
            </div>
            <div className="bb-hero-content">
              <span className="bb-badge bb-badge-featured">Featured</span>
              {hero.category && <span className="bb-badge">{hero.category}</span>}
              <h1 className="bb-hero-title">{hero.title}</h1>
              {hero.excerpt && <p className="bb-hero-excerpt">{hero.excerpt}</p>}
              <div className="bb-hero-meta">
                {formatDate(hero.publishedAt) && (
                  <time dateTime={hero.publishedAt}>{formatDate(hero.publishedAt)}</time>
                )}
                {hero.readingTime && <span>{hero.readingTime} min read</span>}
              </div>
              <Link href={`/blog/${hero.slug}`} className="bb-cta">
                Read Full Story
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* ── Category Filter ────────────────────── */}
        <div className="bb-filters">
          <div className="bb-filter-row">
            <h2 className="bb-section-label">Browse</h2>
            <div className="bb-pills">
              <button
                className={`bb-pill${!activeCategory ? ' active' : ''}`}
                onClick={() => setActiveCategory('')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`bb-pill${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Spotlight (2-up) ───────────────────── */}
        {spotlight.length > 0 && (
          <section className="bb-spotlight">
            {spotlight.map((post) => (
              <Link key={post.id || post.slug} href={`/blog/${post.slug}`} className="bb-spot-card">
                <div className="bb-spot-image">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div className="bb-spot-gradient" />
                </div>
                <div className="bb-spot-info">
                  {post.category && <span className="bb-badge">{post.category}</span>}
                  <h3 className="bb-spot-title">{post.title}</h3>
                  <div className="bb-spot-meta">
                    {formatDate(post.publishedAt) && (
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    )}
                    {post.readingTime && <span>{post.readingTime} min read</span>}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* ── Grid ───────────────────────────────── */}
        {rest.length > 0 && (
          <section className="bb-grid-section">
            <h2 className="bb-section-label">More Stories</h2>
            <div className="bb-grid">
              {rest.map((post) => (
                <Link key={post.id || post.slug} href={`/blog/${post.slug}`} className="bb-card">
                  <div className="bb-card-image">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bb-card-placeholder" />
                    )}
                    <div className="bb-card-overlay" />
                  </div>
                  <div className="bb-card-body">
                    <div className="bb-card-top">
                      {post.category && <span className="bb-badge-sm">{post.category}</span>}
                      {post.readingTime && (
                        <span className="bb-card-time">{post.readingTime} min</span>
                      )}
                    </div>
                    <h3 className="bb-card-title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="bb-card-excerpt">{post.excerpt.slice(0, 100)}...</p>
                    )}
                    <div className="bb-card-date">
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="bb-empty">
            <h2>Coming Soon</h2>
            <p>Blockbuster stories are on the way. Stay tuned.</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  let posts = [];

  try {
    const { getAllPublishedPosts } = await import('../lib/firestore');
    posts = await getAllPublishedPosts();
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  return {
    props: { posts, categories },
  };
}
