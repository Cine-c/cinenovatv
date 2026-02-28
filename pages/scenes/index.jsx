import React from 'react';
import SEOHead from '../../components/seo/SEOHead';
import Link from 'next/link';
import Image from 'next/image';

const iconicScenes = [
  {
    slug: 'ill-be-back-terminator',
    title: "I'll Be Back",
    movie: "The Terminator",
    year: "1984",
    director: "James Cameron",
    description: "Arnold Schwarzenegger's robotic promise became one of cinema's most quoted lines, defining an era of action movies.",
    fullDescription: "In this unforgettable moment from James Cameron's sci-fi masterpiece, Arnold Schwarzenegger's T-800 delivers a line that would become synonymous with action cinema itself. The scene occurs when the Terminator, searching for Sarah Connor at a police station, is told to wait. His cold, mechanical response - 'I'll be back' - precedes one of the most explosive sequences in 80s cinema as he crashes a car through the station's entrance. What makes this moment iconic isn't just the quote, but the perfect marriage of deadpan delivery, impending violence, and the audience's growing understanding of just how unstoppable this killing machine truly is.",
    image: "https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    category: "Action"
  },
  {
    slug: 'heres-looking-at-you-casablanca',
    title: "Here's Looking at You, Kid",
    movie: "Casablanca",
    year: "1942",
    director: "Michael Curtiz",
    description: "Humphrey Bogart's tender farewell to Ingrid Bergman remains the gold standard for romantic cinema moments.",
    fullDescription: "The foggy airport farewell between Rick Blaine and Ilsa Lund represents the pinnacle of Hollywood's Golden Age romance. As Humphrey Bogart delivers his iconic lines to Ingrid Bergman, we witness a sacrifice that defines true love - letting go for the greater good. The phrase 'Here's looking at you, kid' had been used earlier in the film during happier Paris flashbacks, making its final utterance devastatingly poignant. Shot in the studio with cardboard plane cutouts and little people as mechanics to create forced perspective, this scene proves that movie magic lies not in effects, but in emotion.",
    image: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    category: "Romance"
  },
  {
    slug: 'bullet-time-matrix',
    title: "The Bullet Time",
    movie: "The Matrix",
    year: "1999",
    director: "The Wachowskis",
    description: "Neo's rooftop dodge revolutionized visual effects and inspired countless imitations in action filmmaking.",
    fullDescription: "When Neo bends backward to dodge bullets on that rooftop, cinema itself seemed to bend with him. The Wachowskis, working with VFX supervisor John Gaeta, created 'bullet time' using 120 still cameras arranged in an arc, capturing sequential moments that could be assembled into a fluid, time-manipulating shot. This wasn't just a cool visual trick - it externalized the film's themes of perception, reality, and human potential. The sequence took weeks to set up and seconds to shoot, but its impact on filmmaking lasted decades, spawning countless imitations and parodies while remaining unmatched in its original execution.",
    image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    category: "Sci-Fi"
  },
  {
    slug: 'i-am-your-father-empire-strikes-back',
    title: "I Am Your Father",
    movie: "The Empire Strikes Back",
    year: "1980",
    director: "Irvin Kershner",
    description: "The greatest plot twist in cinema history that shocked audiences and redefined the Star Wars saga forever.",
    fullDescription: "In the carbon freezing chamber of Cloud City, cinema history was made. Mark Hamill, dangling above the abyss, didn't even know the real line until filming - the script read 'Obi-Wan killed your father' to prevent leaks. Only director Irvin Kershner and James Earl Jones knew the truth. When Darth Vader's revelation echoed through theaters in 1980, audiences gasped collectively. This wasn't just a plot twist; it transformed Star Wars from a simple good-versus-evil tale into a complex family tragedy. The scene's power lies in its simplicity - no elaborate effects, just two figures, one terrible truth, and a son's anguished denial.",
    image: "https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg",
    category: "Sci-Fi"
  },
  {
    slug: 'shower-scene-psycho',
    title: "The Shower Scene",
    movie: "Psycho",
    year: "1960",
    director: "Alfred Hitchcock",
    description: "78 camera setups, 52 cuts, and pure terror. Hitchcock's masterpiece changed horror forever.",
    fullDescription: "Alfred Hitchcock spent seven days filming what would become the most analyzed scene in cinema history. Janet Leigh stands under the shower, unaware that Norman Bates approaches. What follows is a masterclass in suggestion over explicit violence - we never actually see the knife penetrate skin, yet the rapid montage of 78 setups and 52 cuts creates an illusion of brutal murder. Bernard Herrmann's shrieking violin strings became inseparable from the imagery. Hitchcock broke every rule: killing his star 47 minutes in, showing a toilet onscreen (a first), and proving that horror's greatest weapon isn't what we see, but what we imagine.",
    image: "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
    category: "Horror"
  },
  {
    slug: 'you-talking-to-me-taxi-driver',
    title: "You Talking to Me?",
    movie: "Taxi Driver",
    year: "1976",
    director: "Martin Scorsese",
    description: "Robert De Niro's improvised mirror monologue became an iconic symbol of urban isolation and madness.",
    fullDescription: "The script simply read: 'Travis talks to himself in the mirror.' What Robert De Niro created from that sparse direction became one of cinema's most quoted moments. Alone in his dingy apartment, Travis Bickle practices quick-drawing his concealed weapons, rehearsing confrontations that exist only in his fractured mind. 'You talkin' to me?' he challenges his reflection, cycling through threat and mock-surprise. The scene is deeply unsettling because we're watching a man lose himself in violent fantasy, yet De Niro makes it almost seductive. It captures the dangerous allure of reinvention through aggression that would explode in the film's bloody climax.",
    image: "https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    category: "Drama"
  },
  {
    slug: 'heeeeres-johnny-the-shining',
    title: "Here's Johnny!",
    movie: "The Shining",
    year: "1980",
    director: "Stanley Kubrick",
    description: "Jack Nicholson's manic improvisation through a splintered door became horror's most chilling moment.",
    fullDescription: "Stanley Kubrick, known for demanding dozens of takes, reportedly shot this scene around 60 times. The door was made of real wood (prop doors broke too easily under Nicholson's force), and Shelley Duvall's terror was genuine after months of Kubrick's psychological pressure. When Jack Torrance axes through the bathroom door and leers 'Here's Johnny!' (an ad-lib referencing The Tonight Show that Kubrick, unfamiliar with American TV, almost cut), we see a man completely consumed by the Overlook Hotel's evil. The cramped bathroom, Duvall's screams, and Nicholson's gleeful madness create horror's most suffocating moment.",
    image: "https://image.tmdb.org/t/p/w500/6GnBODtWrNPEVNQTVhY0LGr1eFU.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/6GnBODtWrNPEVNQTVhY0LGr1eFU.jpg",
    category: "Horror"
  },
  {
    slug: 'i-could-have-gotten-more-schindlers-list',
    title: "I Could Have Gotten More",
    movie: "Schindler's List",
    year: "1993",
    director: "Steven Spielberg",
    description: "Liam Neeson's breakdown delivers one of cinema's most emotionally devastating moments.",
    fullDescription: "As the war ends and his workers present Oskar Schindler with a ring inscribed with a Talmudic quote, something breaks inside him. 'I could have gotten more,' he sobs, looking at his car, his Nazi pin, calculating how many more lives those possessions could have bought. Liam Neeson's performance strips away the confident businessman we've watched throughout, revealing a man crushed by the weight of six million ghosts. Spielberg shot in black and white to capture historical gravity, but nothing is more colorful than Neeson's raw grief. It's the moment when the magnitude of the Holocaust becomes unbearably personal.",
    image: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    category: "Drama"
  }
];

export default function ScenesPage() {
  return (
    <>
      <SEOHead
        title="Iconic Movie Scenes - Unforgettable Cinema Moments"
        description="Explore the most iconic scenes in cinema history. From classic Hollywood to modern blockbusters, discover the moments that defined filmmaking."
        url="/scenes"
      />

      <div className="scenes-page">
        {/* Hero Section */}
        <section className="scenes-hero">
          <div className="scenes-hero-content">
            <span className="scenes-hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              Cinema History
            </span>
            <h1>Iconic Movie <span className="gradient-text">Scenes</span></h1>
            <p>
              Journey through the moments that shaped cinema. These unforgettable
              scenes transcend their films to become part of our cultural DNA.
            </p>
          </div>
        </section>

        {/* Scenes Grid */}
        <section className="scenes-main">
          <div className="scenes-grid-page">
            {iconicScenes.map((scene, index) => (
              <React.Fragment key={scene.slug}>
              <Link
                href={`/scenes/${scene.slug}`}
                className="scene-card-link"
              >
                <article className="scene-card-page">
                  <div className="scene-card-image-page">
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      width={600}
                      height={340}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="scene-card-overlay-page">
                      <span className="scene-category-badge">{scene.category}</span>
                      <div className="scene-play-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="scene-card-content-page">
                    <span className="scene-movie-tag">{scene.movie} ({scene.year})</span>
                    <h2 className="scene-card-title-page">"{scene.title}"</h2>
                    <p className="scene-card-desc-page">{scene.description}</p>
                    <div className="scene-card-footer-page">
                      <span className="scene-director-tag">Dir: {scene.director}</span>
                      <span className="scene-read-more">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="scenes-cta">
          <div className="scenes-cta-content">
            <h2>Want More Cinema Magic?</h2>
            <p>Explore our full collection of movie trailers and reviews</p>
            <div className="scenes-cta-buttons">
              <Link href="/trailers" className="btn btn-primary btn-large">
                Browse Trailers
              </Link>
              <Link href="/blog" className="btn btn-secondary btn-large">
                Read Reviews
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
