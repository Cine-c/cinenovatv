import Image from 'next/image';
import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import { BlogPostingJsonLd } from '../../components/seo/JsonLd';
import Disqus from '../../components/Disqus';


export default function BlogPost({ post, relatedPosts }) {

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
          url={`https://www.cinenovatv.com/blog/${post.slug}`}
        />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  let slugs = [];

  try {
    const { getAllPostSlugs } = await import('../../lib/firestore');
    slugs = await getAllPostSlugs();
  } catch (err) {
    console.error('Error fetching slugs:', err);
  }

  return {
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: 'blocking',
  };
}

// Strip dangerous HTML at build time to prevent XSS
function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  let post = null;
  let relatedPosts = [];

  try {
    const { getPostBySlug, getRelatedPosts } = await import('../../lib/firestore');
    post = await getPostBySlug(slug);

    if (post) {
      post.content = sanitizeHtml(post.content);
      relatedPosts = await getRelatedPosts(slug, 3);
    }
  } catch (err) {
    console.error('Error fetching post:', err);
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      relatedPosts,
    },
    revalidate: 3600,
  };
}
