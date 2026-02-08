import SEOHead from '../components/seo/SEOHead';
import { useWatchLater } from '../components/WatchLaterContext';
import MovieGrid from '../components/trailers/MovieGrid';
import TrailerModal from '../components/trailers/TrailerModal';
import { useState } from 'react';
import Link from 'next/link';

export default function WatchLaterPage() {
  const { items } = useWatchLater();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <>
      <SEOHead
        title="Watch Later - CineNovaTV"
        description="Your saved movies to watch later."
        url="/watchlater"
      />

      <div className="watchlater-page">
        <section className="watchlater-hero">
          <h1>Watch Later</h1>
          <p>
            {items.length > 0
              ? `You have ${items.length} movie${items.length !== 1 ? 's' : ''} saved`
              : 'Your watch list is empty'}
          </p>
        </section>

        {items.length > 0 ? (
          <MovieGrid movies={items} onWatchTrailer={setSelectedMovie} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies saved yet</h3>
            <p>Browse trailers and tap the bookmark icon to save movies for later.</p>
            <Link href="/trailers" className="btn btn-primary">
              Browse Trailers
            </Link>
          </div>
        )}

        {selectedMovie && (
          <TrailerModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </div>
    </>
  );
}
