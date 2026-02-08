import { useState } from 'react';

export default function Subscribe({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Store in localStorage for now (can be replaced with actual API)
      const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');

      if (subscribers.includes(email)) {
        setStatus('error');
        setMessage('This email is already subscribed!');
        return;
      }

      subscribers.push(email);
      localStorage.setItem('subscribers', JSON.stringify(subscribers));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for confirmation.');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'inline') {
    return (
      <div className="subscribe-inline">
        <div className="subscribe-inline-content">
          <div className="subscribe-inline-text">
            <h4>Stay Updated</h4>
            <p>Get the latest movie news and trailers delivered to your inbox</p>
          </div>
          <form onSubmit={handleSubmit} className="subscribe-inline-form">
            <div className="subscribe-input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <span className="btn-spinner"></span>
                ) : status === 'success' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            {message && (
              <p className={`subscribe-message ${status}`}>{message}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="subscribe-section">
      <div className="subscribe-container">
        <div className="subscribe-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2>Never Miss a Trailer</h2>
        <p>
          Subscribe to our newsletter and get the latest movie trailers,
          reviews, and exclusive content delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="subscribe-form">
          <div className="subscribe-input-wrapper">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className={status === 'error' ? 'error' : ''}
            />
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <span className="btn-spinner"></span>
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </div>
          {message && (
            <p className={`subscribe-message ${status}`}>{message}</p>
          )}
        </form>

        <p className="subscribe-privacy">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
