import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getBlogsByCategory } from '@/lib/strapi';
import BlogFeed from '@/components/custom/BlogFeed';

// Generate metadata dynamically based on category
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const categories = await getCategories();
    const category = categories.find((cat) => cat.Slug === slug);
    
    if (!category) {
      return { title: "Category Not Found" };
    }
    
    return {
      title: category.Name,
      description: `Browse all ${category.Name} articles and resources`,
    };
  } catch (error) {
    return {
      title: "Category",
    };
  }
}

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({
      slug: category.Slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export default async function CategoryPage({ params }) {
  // Await the params object to access the slug (App Router)
  const { slug } = await params;

  try {
    const categories = await getCategories();
  
    const category = categories.find((cat) => cat.Slug === slug);

    if (!category) {
      return <div>Category not found</div>;
    }

    // Fetch blogs for the category
    const blogs = await getBlogsByCategory(slug);

    return <BlogFeed category={category} blogs={blogs} />;
  } catch (error) {
    return <div>Error loading content: {error.message}</div>;
  }
}