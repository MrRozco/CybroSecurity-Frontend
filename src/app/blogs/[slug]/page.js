import Image from 'next/image';
import { getBlogBySlug, getBlogs } from '@/lib/strapi';
import Link from 'next/link';
import Script from 'next/script';
import BlogContent from '@/components/custom/BlogContent';
import { formatAuthorName } from '@/lib/author';
import styles from './styles.module.scss';

// Generate metadata dynamically based on blog
export async function generateMetadata({ params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    
    // Strip HTML tags for the description
    const plainTextContent = blog.Content?.replace(/<[^>]+>/g, '') || "";
    
    return {
      title: blog.Title,
      description: plainTextContent.substring(0, 160) || "Read our latest blog post",
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
    };
  }
}

// Generate static params for all blogs at build time
export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((blog) => ({
      slug: blog.Slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blogs:', error);
    return [];
  }
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }) {
  const blog = await getBlogBySlug(params.slug);


  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className={`container ${styles.blogPost}`}>
      {blog?.FeaturedImage && (
        <Image
          src={`${blog.FeaturedImage.url}`}
          alt={blog.Title || 'Blog Featured Image!'}
          width={800}
          height={400}
          className={styles.blogPost__image}
        />
      )}
      <h1 className={styles.blogPost__title}>{blog.Title}</h1>
      <p className={styles.blogPost__meta}>
        By {formatAuthorName(blog.author?.Name) || 'Unknown'} |{' '}
        {new Date(blog.publishedAt).toLocaleDateString()}
        </p>
        {blog.Content && <BlogContent content={blog.Content} />}
        {blog.category && (
        <div className={styles.blogPost__category}>
            <strong>Category: </strong>
            {
            <Link href={`/category/${blog.category.Slug}`} key={blog.category.id}>
                {blog.category.Name}
            </Link>
            }
        </div>
          )}
    </div>
  );
}