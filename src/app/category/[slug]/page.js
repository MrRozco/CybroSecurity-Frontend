import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/strapi';
import BlogFeed from '@/components/custom/BlogFeed';

export default async function CategoryPage({ params }) {
  // Await the params object to access the slug
  const { slug } = await params;

  const categories = await getCategories();
  const category = categories.find((cat) => cat.Slug === slug);

  if (!category) {
    return <div>Category not found</div>;

    
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blogs?filters[category][Slug][$eq]=${slug}&populate=*`
  );
  const blogs = (await response.json()).data;

  console.log('NEXT_PUBLIC_STRAPI_API_URL:', process.env.NEXT_PUBLIC_STRAPI_API_URL);

  return (
    <BlogFeed category={category} blogs={blogs} />
  );
}