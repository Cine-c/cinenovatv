import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cinenovatv.com';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CineNovaTV',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
    description: 'Your source for movie trailers, reviews, and the latest film news.',
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineNovaTV',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/trailers?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function BlogPostingJsonLd({ post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.description,
    image: post.image || `${siteUrl}/og-image.jpg`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'CineNovaTV',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CineNovaTV',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function MovieJsonLd({ movie, trailerUrl }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    datePublished: movie.release_date,
    ...(trailerUrl && {
      trailer: {
        '@type': 'VideoObject',
        name: `${movie.title} - Official Trailer`,
        embedUrl: trailerUrl,
        thumbnailUrl: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          : null,
      },
    }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function ItemListJsonLd({ items, type = 'Movie' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': type,
        name: item.title,
        url: type === 'BlogPosting'
          ? `${siteUrl}/blog/${item.slug}`
          : `${siteUrl}/trailers?movie=${item.id}`,
      },
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
