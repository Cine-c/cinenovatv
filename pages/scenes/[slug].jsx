import React from 'react';
import SEOHead from '../../components/seo/SEOHead';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Disqus from '../../components/Disqus';
import AdSlot from '../../components/AdSlot';

const iconicScenes = [
  {
    slug: 'ill-be-back-terminator',
    title: "I'll Be Back",
    movie: "The Terminator",
    year: "1984",
    director: "James Cameron",
    description: "Arnold Schwarzenegger's robotic promise became one of cinema's most quoted lines, defining an era of action movies.",
    fullDescription: "In this unforgettable moment from James Cameron's sci-fi masterpiece, Arnold Schwarzenegger's T-800 delivers a line that would become synonymous with action cinema itself. The scene occurs when the Terminator, searching for Sarah Connor at a police station, is told to wait. His cold, mechanical response - 'I'll be back' - precedes one of the most explosive sequences in 80s cinema as he crashes a car through the station's entrance.\n\nWhat makes this moment iconic isn't just the quote, but the perfect marriage of deadpan delivery, impending violence, and the audience's growing understanding of just how unstoppable this killing machine truly is. Schwarzenegger reportedly wanted to say 'I will be back,' feeling it was more natural for the robotic character, but Cameron insisted on the contraction, creating a phrase that would define a career.\n\nThe scene exemplifies everything that made 1980s action cinema great: practical effects, genuine tension, and a star presence that couldn't be manufactured. It launched Schwarzenegger into the stratosphere and gave us one of film's most versatile catchphrases.",
    image: "https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    category: "Action",
    trivia: [
      "Schwarzenegger wanted to say 'I will be back' instead",
      "The police station massacre used over 400 blank rounds",
      "James Cameron wrote the script in just one week"
    ]
  },
  {
    slug: 'heres-looking-at-you-casablanca',
    title: "Here's Looking at You, Kid",
    movie: "Casablanca",
    year: "1942",
    director: "Michael Curtiz",
    description: "Humphrey Bogart's tender farewell to Ingrid Bergman remains the gold standard for romantic cinema moments.",
    fullDescription: "The foggy airport farewell between Rick Blaine and Ilsa Lund represents the pinnacle of Hollywood's Golden Age romance. As Humphrey Bogart delivers his iconic lines to Ingrid Bergman, we witness a sacrifice that defines true love - letting go for the greater good.\n\nThe phrase 'Here's looking at you, kid' had been used earlier in the film during happier Paris flashbacks, making its final utterance devastatingly poignant. Shot in the studio with cardboard plane cutouts and little people as mechanics to create forced perspective, this scene proves that movie magic lies not in effects, but in emotion.\n\nWhat's remarkable is how much of Casablanca was improvised on set. The script was being rewritten daily, and neither Bergman nor Bogart knew until the final days whether Ilsa would stay with Rick or leave with Victor. This uncertainty infused their performances with genuine emotion that audiences have felt for over 80 years.",
    image: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    category: "Romance",
    trivia: [
      "The ending was written just days before filming",
      "Ingrid Bergman didn't know which man her character would choose",
      "The plane in the background was a small-scale cardboard cutout"
    ]
  },
  {
    slug: 'bullet-time-matrix',
    title: "The Bullet Time",
    movie: "The Matrix",
    year: "1999",
    director: "The Wachowskis",
    description: "Neo's rooftop dodge revolutionized visual effects and inspired countless imitations in action filmmaking.",
    fullDescription: "When Neo bends backward to dodge bullets on that rooftop, cinema itself seemed to bend with him. The Wachowskis, working with VFX supervisor John Gaeta, created 'bullet time' using 120 still cameras arranged in an arc, capturing sequential moments that could be assembled into a fluid, time-manipulating shot.\n\nThis wasn't just a cool visual trick - it externalized the film's themes of perception, reality, and human potential. The sequence took weeks to set up and seconds to shoot, but its impact on filmmaking lasted decades, spawning countless imitations and parodies while remaining unmatched in its original execution.\n\nThe technical achievement required custom software to interpolate between the still images, creating smooth motion that had never been seen before. Keanu Reeves trained for four months in martial arts to perform the physical aspects, while the cameras captured his movement from angles that would have been impossible with traditional filming techniques.",
    image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    category: "Sci-Fi",
    trivia: [
      "120 cameras were used to create the bullet time effect",
      "Keanu Reeves trained for 4 months before filming",
      "The effect inspired countless imitations in film and advertising"
    ]
  },
  {
    slug: 'i-am-your-father-empire-strikes-back',
    title: "I Am Your Father",
    movie: "The Empire Strikes Back",
    year: "1980",
    director: "Irvin Kershner",
    description: "The greatest plot twist in cinema history that shocked audiences and redefined the Star Wars saga forever.",
    fullDescription: "In the carbon freezing chamber of Cloud City, cinema history was made. Mark Hamill, dangling above the abyss, didn't even know the real line until filming - the script read 'Obi-Wan killed your father' to prevent leaks. Only director Irvin Kershner and James Earl Jones knew the truth.\n\nWhen Darth Vader's revelation echoed through theaters in 1980, audiences gasped collectively. This wasn't just a plot twist; it transformed Star Wars from a simple good-versus-evil tale into a complex family tragedy. The scene's power lies in its simplicity - no elaborate effects, just two figures, one terrible truth, and a son's anguished denial.\n\nThe secrecy around this twist was unprecedented for its time. Even David Prowse, who physically portrayed Vader on set, spoke a different line. The deception was so complete that when the actual dialogue was revealed, cast and crew were as shocked as audiences would be.",
    image: "https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
    category: "Sci-Fi",
    trivia: [
      "Mark Hamill was only told the real line moments before filming",
      "The script had a fake line to prevent leaks",
      "David Prowse spoke different dialogue on set"
    ]
  },
  {
    slug: 'shower-scene-psycho',
    title: "The Shower Scene",
    movie: "Psycho",
    year: "1960",
    director: "Alfred Hitchcock",
    description: "78 camera setups, 52 cuts, and pure terror. Hitchcock's masterpiece changed horror forever.",
    fullDescription: "Alfred Hitchcock spent seven days filming what would become the most analyzed scene in cinema history. Janet Leigh stands under the shower, unaware that Norman Bates approaches. What follows is a masterclass in suggestion over explicit violence - we never actually see the knife penetrate skin, yet the rapid montage of 78 setups and 52 cuts creates an illusion of brutal murder.\n\nBernard Herrmann's shrieking violin strings became inseparable from the imagery. Hitchcock broke every rule: killing his star 47 minutes in, showing a toilet onscreen (a first), and proving that horror's greatest weapon isn't what we see, but what we imagine.\n\nThe technical precision of the sequence is staggering. Hitchcock used chocolate syrup for blood (it photographed better in black and white), and a body double for some shots. Janet Leigh later admitted she could never take showers again after filming, only baths - and always with the doors locked.",
    image: "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
    category: "Horror",
    trivia: [
      "The scene took 7 days to film",
      "Chocolate syrup was used as blood",
      "Janet Leigh never took showers again after filming"
    ]
  },
  {
    slug: 'you-talking-to-me-taxi-driver',
    title: "You Talking to Me?",
    movie: "Taxi Driver",
    year: "1976",
    director: "Martin Scorsese",
    description: "Robert De Niro's improvised mirror monologue became an iconic symbol of urban isolation and madness.",
    fullDescription: "The script simply read: 'Travis talks to himself in the mirror.' What Robert De Niro created from that sparse direction became one of cinema's most quoted moments. Alone in his dingy apartment, Travis Bickle practices quick-drawing his concealed weapons, rehearsing confrontations that exist only in his fractured mind.\n\n'You talkin' to me?' he challenges his reflection, cycling through threat and mock-surprise. The scene is deeply unsettling because we're watching a man lose himself in violent fantasy, yet De Niro makes it almost seductive. It captures the dangerous allure of reinvention through aggression that would explode in the film's bloody climax.\n\nDe Niro's improvisation drew from his extensive preparation for the role, which included actually driving a taxi through New York City for weeks. The mirror scene was shot in one afternoon, with Scorsese giving De Niro complete freedom to explore Travis's psyche.",
    image: "https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    category: "Drama",
    trivia: [
      "The entire monologue was improvised by De Niro",
      "De Niro actually drove a taxi to prepare for the role",
      "The script only said 'Travis talks to himself in the mirror'"
    ]
  },
  {
    slug: 'heeeeres-johnny-the-shining',
    title: "Here's Johnny!",
    movie: "The Shining",
    year: "1980",
    director: "Stanley Kubrick",
    description: "Jack Nicholson's manic improvisation through a splintered door became horror's most chilling moment.",
    fullDescription: "Stanley Kubrick, known for demanding dozens of takes, reportedly shot this scene around 60 times. The door was made of real wood (prop doors broke too easily under Nicholson's force), and Shelley Duvall's terror was genuine after months of Kubrick's psychological pressure.\n\nWhen Jack Torrance axes through the bathroom door and leers 'Here's Johnny!' (an ad-lib referencing The Tonight Show that Kubrick, unfamiliar with American TV, almost cut), we see a man completely consumed by the Overlook Hotel's evil. The cramped bathroom, Duvall's screams, and Nicholson's gleeful madness create horror's most suffocating moment.\n\nNicholson prepared for the door-breaking scene by training with a real firefighter. His physical intensity destroyed prop doors too quickly, so the production used real doors instead - Nicholson chopped through each one so efficiently they had to keep rebuilding the set.",
    image: "https://image.tmdb.org/t/p/w500/6GnBODtWrNPEVNQTVhY0LGr1eFU.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/6GnBODtWrNPEVNQTVhY0LGr1eFU.jpg",
    category: "Horror",
    trivia: [
      "The scene was shot approximately 60 times",
      "'Here's Johnny!' was improvised by Nicholson",
      "Real doors were used because Nicholson destroyed prop doors too quickly"
    ]
  },
  {
    slug: 'i-could-have-gotten-more-schindlers-list',
    title: "I Could Have Gotten More",
    movie: "Schindler's List",
    year: "1993",
    director: "Steven Spielberg",
    description: "Liam Neeson's breakdown delivers one of cinema's most emotionally devastating moments.",
    fullDescription: "As the war ends and his workers present Oskar Schindler with a ring inscribed with a Talmudic quote, something breaks inside him. 'I could have gotten more,' he sobs, looking at his car, his Nazi pin, calculating how many more lives those possessions could have bought.\n\nLiam Neeson's performance strips away the confident businessman we've watched throughout, revealing a man crushed by the weight of six million ghosts. Spielberg shot in black and white to capture historical gravity, but nothing is more colorful than Neeson's raw grief. It's the moment when the magnitude of the Holocaust becomes unbearably personal.\n\nSpielberg didn't watch dailies during production, finding the material too emotionally overwhelming. Robin Williams called him weekly just to make him laugh. The ring given to Schindler in the scene was inscribed with 'Whoever saves one life, saves the world entire' - a quote that encapsulates the film's profound message.",
    image: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    category: "Drama",
    trivia: [
      "Spielberg didn't watch dailies due to emotional difficulty",
      "Robin Williams called Spielberg weekly to make him laugh",
      "The film was shot almost entirely in black and white"
    ]
  }
];

export default function SceneDetail({ scene }) {
  const router = useRouter();

  if (router.isFallback || !scene) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${scene.title} - ${scene.movie} | Iconic Movie Scenes`}
        description={scene.description}
        url={`/scenes/${scene.slug}`}
        image={scene.image}
      />

      <article className="scene-detail">
        {/* Hero Section */}
        <section
          className="scene-detail-hero"
          style={{
            backgroundImage: `url(${scene.backdrop})`
          }}
        >
          <div className="scene-detail-hero-overlay"></div>
          <div className="scene-detail-hero-content">
            <Link href="/scenes" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Scenes
            </Link>
            <span className="scene-category-tag">{scene.category}</span>
            <h1>"{scene.title}"</h1>
            <div className="scene-detail-meta">
              <span className="scene-movie-name">{scene.movie}</span>
              <span className="scene-divider">•</span>
              <span className="scene-year">{scene.year}</span>
              <span className="scene-divider">•</span>
              <span className="scene-director">Directed by {scene.director}</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="scene-detail-content">
          <div className="scene-detail-grid">
            {/* Main Content */}
            <div className="scene-detail-main">
              <div className="scene-detail-image">
                <Image
                  src={scene.image}
                  alt={scene.title}
                  width={800}
                  height={450}
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              <div className="scene-detail-text">
                <h2>The Scene</h2>
                {scene.fullDescription.split('\n\n').map((paragraph, index) => (
                  <React.Fragment key={index}>
                    <p>{paragraph}</p>
                    {index === 0 && <AdSlot format="in-article" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="scene-detail-sidebar">
              <div className="scene-info-card">
                <h3>Quick Facts</h3>
                <ul className="scene-facts-list">
                  <li>
                    <span className="fact-label">Film</span>
                    <span className="fact-value">{scene.movie}</span>
                  </li>
                  <li>
                    <span className="fact-label">Year</span>
                    <span className="fact-value">{scene.year}</span>
                  </li>
                  <li>
                    <span className="fact-label">Director</span>
                    <span className="fact-value">{scene.director}</span>
                  </li>
                  <li>
                    <span className="fact-label">Genre</span>
                    <span className="fact-value">{scene.category}</span>
                  </li>
                </ul>
              </div>

              {scene.trivia && (
                <div className="scene-trivia-card">
                  <h3>Did You Know?</h3>
                  <ul className="scene-trivia-list">
                    {scene.trivia.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="scene-cta-card">
                <h3>Explore More</h3>
                <p>Discover more iconic moments in cinema history</p>
                <Link href="/scenes" className="btn btn-primary">
                  View All Scenes
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Disqus Comments */}
        <section className="scene-comments">
          <div className="scene-comments-container">
            <Disqus
              identifier={`scene-${scene.slug}`}
              title={`${scene.title} - ${scene.movie}`}
              url={typeof window !== 'undefined' ? `${window.location.origin}/scenes/${scene.slug}` : ''}
            />
          </div>
        </section>

        {/* Related Scenes */}
        <section className="scene-related">
          <div className="scene-related-container">
            <h2>More Iconic Scenes</h2>
            <div className="scene-related-grid">
              {iconicScenes
                .filter(s => s.slug !== scene.slug)
                .slice(0, 3)
                .map((relatedScene) => (
                  <Link
                    key={relatedScene.slug}
                    href={`/scenes/${relatedScene.slug}`}
                    className="scene-related-card"
                  >
                    <div className="scene-related-image">
                      <Image
                        src={relatedScene.image}
                        alt={relatedScene.title}
                        width={300}
                        height={170}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="scene-related-info">
                      <span className="scene-related-movie">{relatedScene.movie}</span>
                      <h4>"{relatedScene.title}"</h4>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const paths = iconicScenes.map((scene) => ({
    params: { slug: scene.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const scene = iconicScenes.find((s) => s.slug === params.slug);

  if (!scene) {
    return { notFound: true };
  }

  return {
    props: { scene },
    revalidate: 3600,
  };
}
