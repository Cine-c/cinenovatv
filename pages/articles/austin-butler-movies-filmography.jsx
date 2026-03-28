import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import { BlogPostingJsonLd } from '../../components/seo/JsonLd';
import AdSlot from '../../components/AdSlot';

export default function AustinButlerMoviesFilmography() {
  return (
    <>
      <SEOHead
        title="Austin Butler Movies — Complete Filmography & Career Guide | CineNovaTV"
        description="Every Austin Butler movie ranked and reviewed. From Elvis to Dune: Part Two to Caught Stealing — explore his complete filmography and career trajectory."
        url="/articles/austin-butler-movies-filmography"
        type="article"
        article={{ publishedTime: '2026-04-17T08:00:00Z', author: 'CineNovaTV' }}
      />
      <BlogPostingJsonLd
        post={{
          title: 'Austin Butler Movies — Complete Filmography & Career Guide',
          description: 'Every Austin Butler movie ranked and reviewed.',
          publishedAt: '2026-04-17T08:00:00Z',
          author: 'CineNovaTV',
          slug: 'austin-butler-movies-filmography',
        }}
      />

      <div className="article-page">
        <section className="article-hero">
          <span className="article-hero-badge">Actor Spotlight</span>
          <h1>Austin Butler Movies &mdash; Complete Filmography &amp; Career Guide</h1>
          <div className="article-hero-meta">
            <span>Published: April 17, 2026</span>
            <span>8 min read</span>
          </div>
        </section>

        <div className="article-section">
          <h2>From Disney Channel to Oscar Nominee</h2>
          <p>
            Austin Butler&apos;s journey from teen TV actor to one of Hollywood&apos;s most
            in-demand leading men is a masterclass in reinvention. His Oscar-nominated turn as
            Elvis Presley in Baz Luhrmann&apos;s 2022 biopic was the inflection point, but his
            career trajectory since then proves it was no fluke. Here&apos;s his complete filmography
            with our take on each performance.
          </p>
        </div>

        <div className="article-section">
          <h2>Career-Defining Roles</h2>

          <h3>Elvis (2022) &mdash; Elvis Presley</h3>
          <p>
            The role that changed everything. Butler committed to a two-year transformation process,
            learning to sing, move, and embody the King of Rock and Roll from his teenage years
            through his Las Vegas residency. He earned an Oscar nomination, a BAFTA win, and the
            respect of the Presley family. A towering, career-defining performance.
          </p>

          <h3>Dune: Part Two (2024) &mdash; Feyd-Rautha</h3>
          <p>
            Butler&apos;s menacing turn as the Harkonnen heir proved his range extended far beyond
            Elvis. With a shaved head, pale skin, and predatory physicality, he created one of
            sci-fi&apos;s most memorable villains in recent years. The gladiatorial combat scene
            is a standout.
          </p>

          <h3>The Bikeriders (2024) &mdash; Benny</h3>
          <p>
            Jeff Nichols&apos; period drama about a 1960s motorcycle club. Butler plays the
            enigmatic, soft-spoken Benny with a magnetic cool that channels Brando and Dean. A
            quieter performance that showcases his ability to do more with less.
          </p>

          <h3>Caught Stealing (2026) &mdash; Hank Thompson</h3>
          <p>
            Butler&apos;s latest, directed by Darren Aronofsky. He plays a washed-up bartender in
            1990s New York who accidentally takes possession of a bag of stolen money. It&apos;s his
            most physical role yet — gritty, kinetic, and surprisingly funny. Currently in theatres.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-section">
          <h2>Earlier Work</h2>

          <h3>Once Upon a Time in Hollywood (2019) &mdash; Tex Watson</h3>
          <p>
            A small but unforgettable role in Quentin Tarantino&apos;s love letter to 1960s Los
            Angeles. Butler plays Charles Manson follower Tex Watson with unsettling conviction.
            This was the role that put him on the radar of major directors.
          </p>

          <h3>The Dead Don&apos;t Die (2019)</h3>
          <p>
            Jim Jarmusch&apos;s deadpan zombie comedy gave Butler a minor role alongside an
            all-star cast. Not a showcase for his talents, but it connected him with the arthouse
            world.
          </p>

          <h3>TV Origins</h3>
          <p>
            Butler got his start on Nickelodeon and Disney Channel shows including
            <em> Zoey 101</em>, <em>Switched at Birth</em>, and <em>The Shannara Chronicles</em>.
            While these early roles bear little resemblance to his current work, they built the
            foundation of his craft.
          </p>
        </div>

        <div className="article-section">
          <h2>What&apos;s Next</h2>
          <p>
            Butler has several high-profile projects in various stages of development. He&apos;s
            been linked to Ari Aster&apos;s next film and a rumoured Enzo Ferrari biopic. With
            his ability to disappear into roles and his willingness to take creative risks,
            Austin Butler is building one of the most exciting filmographies of his generation.
          </p>
        </div>

        <AdSlot slot="1594520752" format="in-article" />

        <div className="article-links">
          <Link href="/celebrity">Browse All Celebrity Profiles</Link>
          <Link href="/articles/best-thriller-movies-2026">Best Thrillers of 2026</Link>
          <Link href="/discover">Discover Movies</Link>
        </div>
      </div>
    </>
  );
}
