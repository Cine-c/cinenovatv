import { useState } from 'react';
import { NEWSLETTER_ENDPOINT } from '../lib/affiliates';

export default function NewsletterSignup({ variant = 'inline' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      if (NEWSLETTER_ENDPOINT) {
        const res = await fetch(NEWSLETTER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error('Signup failed');
      } else {
        // Fallback: store locally until endpoint is configured
        const stored = JSON.parse(localStorage.getItem('newsletter_signups') || '[]');
        stored.push({ email, date: new Date().toISOString() });
        localStorage.setItem('newsletter_signups', JSON.stringify(stored));
      }

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'newsletter_signup', {
          event_category: 'Newsletter',
          event_label: variant,
        });
      }

      setStatus('success');
      setMessage('You\'re subscribed! Check your inbox.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={`newsletter-signup newsletter-${variant}`}>
        <p className="newsletter-success">{message}</p>
      </div>
    );
  }

  return (
    <div className={`newsletter-signup newsletter-${variant}`}>
      {variant === 'inline' && (
        <>
          <h3 className="newsletter-title">Stay in the Loop</h3>
          <p className="newsletter-subtitle">
            Get weekly movie picks, trailer drops, and exclusive content straight
            to your inbox.
          </p>
        </>
      )}
      {variant === 'compact' && (
        <h4 className="newsletter-title">Newsletter</h4>
      )}
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="newsletter-error">{message}</p>}
    </div>
  );
}
