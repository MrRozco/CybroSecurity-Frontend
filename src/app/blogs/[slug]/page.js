import Image from 'next/image';
import { getBlogBySlug } from '@/lib/strapi';
import Link from 'next/link';

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
                className="prose mb-6"
                dangerouslySetInnerHTML={{ __html: blog.Content }}
            />
            )}
        {blog.category && (
        <div className="mt-4">
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