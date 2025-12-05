import Image from 'next/image';
import { getBlogBySlug, getBlogs } from '@/lib/strapi';
import Link from 'next/link';

// Generate metadata dynamically based on blog
export async function generateMetadata({ params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    return {
      title: blog.Title,
      description: blog.Content?.substring(0, 160) || "Read our latest blog post",
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
    <div className="container mx-auto p-4">
      {blog?.FeaturedImage && (
        <Image
          src={`${blog.FeaturedImage.url}`}
          alt={blog.Title || 'Blog Featured Image!'}
          width={800}
          height={400}
          className="object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{blog.Title}</h1>
      <p className="text-gray-500 mb-4">
        By {blog.author?.Name || 'Unknown'} |{' '}
        {new Date(blog.publishedAt).toLocaleDateString()}
        </p>
        {blog.Content && (
            <div
                className="prose prose-xl prose-invert mb-6 font-sans ck-content"
                dangerouslySetInnerHTML={{ __html: blog.Content }}
            />
            )}
        {blog.category && (
        <div className="mt-4 text-2xl">
            <strong>Category: </strong>
            {
            <Link href={`/category/${blog.category.Slug}`} key={blog.category.id} className="mr-2 text-blue-500">
                {blog.category.Name}
            </Link>
            }
        </div>
          )}
    </div>
  );
}