import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import { BlogPostingJsonLd } from '../../components/seo/JsonLd';
import Disqus from '../../components/Disqus';
import TaboolaWidget from '../../components/TaboolaWidget';
import { getConsentStatus } from '../../components/CookieConsent';

export default function BlogPost({ post, relatedPosts }) {
  useEffect(() => {
    if (post && getConsentStatus() === 'accepted' && window._taboola) {
      window._taboola.push({ flush: true });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="blog-post">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <Link href="/blog">Back to Blog</Link>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt || post.description || `Read ${post.title} on CineNovaTV`}
        image={post.imageUrl}
        url={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          author: post.author,
        }}
      />
      <BlogPostingJsonLd post={post} />

      <article className="blog-post">
        <header className="blog-post-header">
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            {formattedDate && <time dateTime={post.publishedAt}>{formattedDate}</time>}
            {post.author && <span>by {post.author}</span>}
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </header>

        {post.imageUrl && (
          <div className="blog-post-image">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={450}
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <nav className="blog-post-nav">
          <Link href="/blog" className="back-to-blog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>
        </nav>

        <TaboolaWidget />

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="blog-related">
            <div className="blog-related-container">
              <h2>More Articles</h2>
              <div className="blog-related-grid">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="blog-related-card"
                  >
                    {related.imageUrl && (
                      <div className="blog-related-image">
                        <Image
                          src={related.imageUrl}
                          alt={related.title}
                          width={300}
                          height={170}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="blog-related-info">
                      {related.category && (
                        <span className="blog-related-category">{related.category}</span>
                      )}
                      <h4>{related.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Disqus Comments */}
        <Disqus
          identifier={`blog-${post.slug}`}
          title={post.title}
          url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : ''}
        />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const { getAllPostSlugs } = await import('../../lib/firebase');
  const slugs = await getAllPostSlugs();

  return {
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { getPostBySlug, getAllPublishedPosts } = await import('../../lib/firebase');

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const allPosts = await getAllPublishedPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return {
    props: {
      post,
      relatedPosts,
    },
    revalidate: 600,
  };
}
