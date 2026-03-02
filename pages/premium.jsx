import SEOHead from '../components/seo/SEOHead';
import { PREMIUM_PRICING } from '../lib/affiliates';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthContext';
import { useAdFree } from '../components/AdFreeContext';

const FEATURES = [
  { icon: '🚫', title: 'Ad-Free Experience', desc: 'Browse without any ads or interruptions' },
  { icon: '💜', title: 'Support Creators', desc: 'Help us keep CineNovaTV running and growing' },
  { icon: '⚡', title: 'Faster Loading', desc: 'Pages load quicker without ad scripts' },
  { icon: '🎬', title: 'Early Access', desc: 'Be the first to try new features and content' },
];

const FAQ = [
  {
    q: 'How does the ad-free experience work?',
    a: 'Once subscribed, all ads are automatically removed across the entire site. No browser extensions needed.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards through our secure payment processor, Stripe.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We don\'t currently offer a free trial, but you can cancel within the first 7 days for a full refund.',
  },
];

export default function PremiumPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(null); // 'monthly' | 'portal' | null
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { adFree } = useAdFree();

  // Show success message when returning from Stripe
  useEffect(() => {
    if (router.query.session_id) {
      setSuccessMsg('Your subscription is now active! Ads will be removed shortly.');
      // Clean up the URL
      router.replace('/premium', undefined, { shallow: true });
    }
  }, [router.query.session_id]);

  async function handleCheckout(interval) {
    if (!user) {
      router.push('/login?redirect=/premium');
      return;
    }

    setLoading(interval);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong.');
        setLoading(null);
      }
    } catch {
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  }

  async function handleManage() {
    if (!user) return;
    setLoading('portal');
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong.');
        setLoading(null);
      }
    } catch {
      alert('Failed to open billing portal. Please try again.');
      setLoading(null);
    }
  }

  function renderButton(interval) {
    if (adFree) {
      return (
        <button
          className="btn btn-secondary btn-large pricing-btn"
          onClick={handleManage}
          disabled={loading === 'portal'}
        >
          {loading === 'portal' ? 'Loading...' : 'Manage Subscription'}
        </button>
      );
    }

    if (!user) {
      return (
        <button
          className="btn btn-primary btn-large pricing-btn"
          onClick={() => router.push('/login?redirect=/premium')}
        >
          Sign In to Subscribe
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary btn-glow btn-large pricing-btn"
        onClick={() => handleCheckout(interval)}
        disabled={loading === interval}
      >
        {loading === interval ? 'Loading...' : 'Subscribe'}
      </button>
    );
  }

  return (
    <>
      <SEOHead
        title="Premium - CineNovaTV"
        description="Go ad-free and support CineNovaTV. Enjoy a faster, cleaner browsing experience."
        url="/premium"
      />

      <div className="premium-page">
        {/* Hero */}
        <section className="premium-hero">
          <span className="premium-badge">Premium</span>
          <h1>Enjoy CineNovaTV Ad-Free</h1>
          <p>
            Support independent film journalism and get a faster, cleaner experience.
          </p>
        </section>

        {successMsg && (
          <div className="premium-success">{successMsg}</div>
        )}

        {/* Pricing */}
        <section className="premium-pricing">
          <div className="pricing-card pricing-featured">
            <h3>Monthly</h3>
            <div className="pricing-amount">
              <span className="pricing-dollar">$</span>
              <span className="pricing-value">{PREMIUM_PRICING.monthly.price}</span>
              <span className="pricing-period">/mo</span>
            </div>
            <p className="pricing-desc">Cancel anytime</p>
            {renderButton('monthly')}
          </div>
        </section>

        {/* Features */}
        <section className="premium-features">
          <h2>What You Get</h2>
          <div className="premium-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="premium-feature-card">
                <span className="premium-feature-icon">{f.icon}</span>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="premium-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <button
                key={i}
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={openFaq === i ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                  </svg>
                </div>
                {openFaq === i && <p className="faq-answer">{item.a}</p>}
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
