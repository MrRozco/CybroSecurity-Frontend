import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getBlogsByCategory } from '@/lib/strapi';
import BlogFeed from '@/components/custom/BlogFeed';

export default async function CategoryPage({ params }) {
  // Await the params object to access the slug (App Router)
  const { slug } = await params;

  try {
    // Debug environment variable and categories
    console.log('NEXT_PUBLIC_STRAPI_API_URL in CategoryPage:', process.env.NEXT_PUBLIC_STRAPI_API_URL);
    
    // Fetch categories and find the matching category
    const categories = await getCategories();
    console.log('Categories:', JSON.stringify(categories, null, 2)); // Debug log
    
    const category = categories.find((cat) => cat.Slug === slug);

    if (!category) {
      return <div>Category not found</div>;
    }

    // Fetch blogs for the category
    const blogs = await getBlogsByCategory(slug);

    return <BlogFeed category={category} blogs={blogs} />;
  } catch (error) {
    console.error('Error loading category page:', error);
    return <div>Error loading content: {error.message}</div>;
  }
}