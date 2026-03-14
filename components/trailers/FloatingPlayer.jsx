import { useRef, useCallback, useEffect } from 'react';

export default function FloatingPlayer({ movie, trailerKey, onExpand, onClose }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  // Ensure autoplay on iOS: start muted, then unmute after playback begins
  useEffect(() => {
    if (!trailerKey) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const unmuteAfterPlay = () => {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          'https://www.youtube.com'
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          'https://www.youtube.com'
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          'https://www.youtube.com'
        );
      } catch {
        // Cross-origin may block — no-op
      }
    };

    const timer = setTimeout(unmuteAfterPlay, 1800);
    return () => clearTimeout(timer);
  }, [trailerKey]);

  if (!movie || !trailerKey) return null;

  return (
    <div className="floating-player" ref={containerRef}>
      <div className="floating-player-video">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title={`${movie.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Top controls overlay */}
      <div className="floating-player-controls">
        <button
          className="fp-btn"
          onClick={onExpand}
          aria-label="Expand to full player"
          title="Expand"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M5 19h14V5H5v14zm2-8h4V7h2v4h4v2h-4v4h-2v-4H7v-2z" />
          </svg>
        </button>
        <button
          className="fp-btn"
          onClick={handleFullscreen}
          aria-label="Fullscreen"
          title="Fullscreen"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        </button>
        <button
          className="fp-btn fp-btn-close"
          onClick={onClose}
          aria-label="Close mini player"
          title="Close"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Bottom title bar */}
      <div className="floating-player-info">
        <span className="fp-title">{movie.title}</span>
      </div>
    </div>
  );
}
