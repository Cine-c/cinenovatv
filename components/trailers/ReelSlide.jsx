import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdFree } from '../useAdFree';
import { getConsentStatus } from '../CookieConsent';
import PreRollOverlay from '../PreRollOverlay';

export default function ReelSlide({ movie, isActive, onVideoEnd }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreRoll, setShowPreRoll] = useState(false);
  const iframeRef = useRef(null);
  const fetchedRef = useRef(null);

  const { adFree } = useAdFree();
  const shouldShowPreRoll = !adFree && getConsentStatus() === 'accepted';

  // Fetch trailer key when slide becomes active
  useEffect(() => {
    if (!isActive || !movie?.id) return;
    if (fetchedRef.current === movie.id) return;

    setIsLoading(true);
    setTrailerKey(null);
    fetchedRef.current = movie.id;

    fetch(`/api/movie/${movie.id}/details`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.videos?.results?.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        const key = trailer?.key || null;
        setTrailerKey(key);
        if (key && shouldShowPreRoll) {
          setShowPreRoll(true);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [isActive, movie?.id, shouldShowPreRoll]);

  // Reset when movie changes (different slide recycled)
  useEffect(() => {
    if (fetchedRef.current !== movie?.id) {
      setTrailerKey(null);
      setIsLoading(true);
      setShowPreRoll(false);
      fetchedRef.current = null;
    }
  }, [movie?.id]);

  // YouTube end detection via postMessage
  useEffect(() => {
    if (!isActive || !trailerKey || showPreRoll) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const sendListening = () => {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'listening' }),
          'https://www.youtube.com'
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
          'https://www.youtube.com'
        );
      } catch {
        // Cross-origin may block
      }
    };

    const timer = setTimeout(sendListening, 1500);

    const handleMessage = (e) => {
      if (e.origin !== 'https://www.youtube.com') return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'onStateChange' && data.info === 0) {
          onVideoEnd?.();
        }
      } catch {
        // Not a JSON message we care about
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [isActive, trailerKey, showPreRoll, onVideoEnd]);

  const releaseYear = movie?.release_date
    ? movie.release_date.split('-')[0]
    : movie?.releaseYear || '';

  return (
    <div className="reel-slide">
      {isActive && (
        <>
          {isLoading ? (
            <div className="reel-loading">
              <div className="trailer-loading-spinner" />
            </div>
          ) : trailerKey ? (
            <div className="reel-video-wrap">
              <iframe
                ref={iframeRef}
                className="reel-iframe"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${showPreRoll ? 0 : 1}&rel=0&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {showPreRoll && (
                <PreRollOverlay key={trailerKey} onSkip={() => setShowPreRoll(false)} />
              )}
            </div>
          ) : (
            <div className="reel-no-trailer">
              <p>No trailer available</p>
            </div>
          )}
        </>
      )}

      {/* Poster placeholder when not active */}
      {!isActive && movie?.poster_path && (
        <div className="reel-poster">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      )}
    </div>
  );
}
