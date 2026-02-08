import SEOHead from '../components/seo/SEOHead';

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About"
        description="Learn about CineNovaTV - your go-to source for movie trailers, reviews, and the latest film news."
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
      </div>
    </>
  );
}
