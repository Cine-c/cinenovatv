import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useWatchLater } from '../WatchLaterContext';
import useSwipeGesture from '../hooks/useSwipeGesture';
import ReelSlide from './ReelSlide';
import PreRollOverlay from '../PreRollOverlay';

const ANIMATION_MS = 350;

export default function ReelsView({ movie, movies, onNextMovie, onPrevMovie, onClose }) {
  const currentIndex = movies.findIndex((m) => m.id === movie?.id);
  const hasNext = currentIndex < movies.length - 1;
  const hasPrev = currentIndex > 0;

  const [animating, setAnimating] = useState(false);
  const [animateOffset, setAnimateOffset] = useState(0);
  const [showUpNext, setShowUpNext] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreRoll, setShowPreRoll] = useState(true);
  const containerRef = useRef(null);

  const { toggle, has } = useWatchLater();
  const isSaved = has(movie?.id);

  // Fade out swipe hint after 4s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Reset showUpNext when movie changes
  useEffect(() => {
    setShowUpNext(false);
  }, [movie?.id]);

  const goNext = useCallback(() => {
    if (!hasNext || animating) return;
    setShowUpNext(false);
    setAnimating(true);
    setAnimateOffset(-1);
    setTimeout(() => {
      onNextMovie();
      setAnimateOffset(0);
      setAnimating(false);
    }, ANIMATION_MS);
  }, [hasNext, animating, onNextMovie]);

  const goPrev = useCallback(() => {
    if (!hasPrev || animating) return;
    setShowUpNext(false);
    setAnimating(true);
    setAnimateOffset(1);
    setTimeout(() => {
      onPrevMovie();
      setAnimateOffset(0);
      setAnimating(false);
    }, ANIMATION_MS);
  }, [hasPrev, animating, onPrevMovie]);

  const { onTouchStart, onTouchMove, onTouchEnd, dragOffset, isDragging } =
    useSwipeGesture({ onSwipeUp: goNext, onSwipeDown: goPrev });

  // Video end handler → show up-next card
  const handleVideoEnd = useCallback(() => {
    if (hasNext) setShowUpNext(true);
  }, [hasNext]);

  // Up-next auto-advance after 5s
  useEffect(() => {
    if (!showUpNext || !hasNext) return;
    const timer = setTimeout(goNext, 5000);
    return () => clearTimeout(timer);
  }, [showUpNext, hasNext, goNext]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.cinenovatv.com/movies/${movie.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Compute visual translateY
  let translateY = 0;
  if (animateOffset !== 0) {
    translateY = animateOffset * 100; // percentage
  } else if (isDragging && dragOffset !== 0) {
    // Rubber-band at boundaries
    if ((dragOffset < 0 && !hasNext) || (dragOffset > 0 && !hasPrev)) {
      translateY = dragOffset * 0.2; // resist
    } else {
      translateY = dragOffset;
    }
  }

  const trackStyle = {
    transform: animateOffset !== 0
      ? `translateY(${translateY}%)`
      : `translateY(${translateY}px)`,
    transition: animating ? `transform ${ANIMATION_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
  };

  const prevMovie = hasPrev ? movies[currentIndex - 1] : null;
  const nextMovie = hasNext ? movies[currentIndex + 1] : null;

  const releaseYear = movie?.release_date
    ? movie.release_date.split('-')[0]
    : movie?.releaseYear || '';

  return (
    <div
      className="reels-container"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="reels-track" style={trackStyle}>
        {/* Previous slide (above) */}
        <div className="reels-slide-wrapper reels-slide-prev">
          {prevMovie && <ReelSlide movie={prevMovie} isActive={false} />}
        </div>

        {/* Current slide (visible) */}
        <div className="reels-slide-wrapper reels-slide-current">
          <ReelSlide
            movie={movie}
            isActive={!animating && !showPreRoll}
            onVideoEnd={handleVideoEnd}
          />
        </div>

        {/* Next slide (below) */}
        <div className="reels-slide-wrapper reels-slide-next">
          {nextMovie && <ReelSlide movie={nextMovie} isActive={false} />}
        </div>
      </div>

      {/* Pre-roll ad overlay */}
      {showPreRoll && (
        <PreRollOverlay onSkip={() => setShowPreRoll(false)} />
      )}

      {/* Overlay UI */}
      <div className="reels-overlay">
        {/* Top bar */}
        <div className="reels-top-bar">
          <span className="reels-counter">
            {currentIndex + 1} / {movies.length}
          </span>
          <button className="reels-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Bottom info */}
        <div className="reels-bottom">
          <div className="reels-info">
            <h3 className="reels-title">{movie?.title}</h3>
            {releaseYear && <span className="reels-year">{releaseYear}</span>}
          </div>

          {/* Action rail */}
          <div className="reels-actions">
            <button
              className={`reels-action-btn${isSaved ? ' saved' : ''}`}
              onClick={() => toggle(movie)}
              aria-label={isSaved ? 'Remove from Watch Later' : 'Add to Watch Later'}
            >
              <svg viewBox="0 0 24 24" width="26" height="26">
                {isSaved ? (
                  <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                ) : (
                  <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
                )}
              </svg>
              <span className="reels-action-label">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button className="reels-action-btn" onClick={handleShare} aria-label="Share">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
              <span className="reels-action-label">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <Link href={`/movies/${movie?.id}`} className="reels-action-btn" onClick={onClose}>
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="reels-action-label">Details</span>
            </Link>
          </div>
        </div>

        {/* Swipe hint */}
        {showHint && (
          <div className="reels-hint">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
            </svg>
            <span>Swipe up for next trailer</span>
          </div>
        )}

        {/* Up Next card */}
        {showUpNext && nextMovie && (
          <div className="reels-up-next">
            <div className="reels-up-next-card">
              <span className="reels-up-next-label">Up Next</span>
              <span className="reels-up-next-title">{nextMovie.title}</span>
              <div className="reels-up-next-progress">
                <div className="reels-up-next-bar" />
              </div>
              <div className="reels-up-next-actions">
                <button className="reels-up-next-play" onClick={goNext}>
                  Play Now
                </button>
                <button className="reels-up-next-cancel" onClick={() => setShowUpNext(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
