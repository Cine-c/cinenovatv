import Head from 'next/head';

export default function SEOHead({
  title = 'CineNovaTV',
  description = 'Your source for movie trailers, reviews, and the latest film news.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  article = null,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cinenovatv.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullTitle = title === 'CineNovaTV' ? title : `${title} | CineNovaTV`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="CineNovaTV" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cinenovatv" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article-specific meta */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
        </>
      )}
    </Head>
  );
}
