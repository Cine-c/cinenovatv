import SEOHead from '../components/seo/SEOHead';
import SupportButton from '../components/SupportButton';

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About CineNovaTV — Free Movie Discovery Platform"
        description="CineNovaTV is a free movie discovery platform. Learn how we help millions find what to watch with trailers, streaming info, and curated recommendations."
        url="/about"
      />

      <div className="static-page">
        <div className="about-card">
          <h1>About CineNovaTV</h1>
          <p>
            CineNovaTV is your go-to source for movie trailers, reviews, and the
            latest film news. We use data from TMDb with full attribution and aim
            to provide unique, high-quality content and an engaging user experience.
          </p>
          <p>
            Whether you're looking for upcoming releases, honest reviews, or just
            want to stay updated on what's trending in cinema, we've got you covered.
          </p>
        </div>

        <section className="team-section">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Meet the Team
          </h2>
          <div className="team-grid">
            <div className="team-card">
              <img
                src="/images/team1.jpg"
                alt="J"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=J';
                }}
              />
              <h3>J</h3>
              <p>Founder & Editor-in-Chief</p>
            </div>
          </div>
        </section>
        <section className="support-section">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Support Our Work
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            If you enjoy CineNovaTV, consider supporting us so we can keep
            bringing you great movie content.
          </p>
          <SupportButton />
        </section>
      </div>
    </>
  );
}
