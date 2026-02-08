import SEOHead from '../components/seo/SEOHead';

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn about how CineNovaTV collects, uses, and protects your personal information."
        url="/privacy"
      />

      <div className="static-page">
        <h1>Privacy Policy</h1>
        <p>
          At CineNovaTV, your privacy is important to us. This page explains what
          information we collect, how we use it, and your rights regarding your data.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Cookies and browsing data to improve your experience.</li>
          <li>
            Optional account information if you register or interact with our
            services.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>To display relevant content and trending posts.</li>
          <li>To improve website functionality and performance.</li>
          <li>For analytics and website optimization.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use cookies to enhance your experience. You can manage cookies via
          the cookie settings on the site.
        </p>

        <h2>Your Rights</h2>
        <p>
          You can opt out of cookies at any time and review, update, or delete
          your data if applicable.
        </p>

        <p>
          For more details, contact us at{' '}
          <a href="mailto:privacy@cinenovatv.com">privacy@cinenovatv.com</a>.
        </p>
      </div>
    </>
  );
}
