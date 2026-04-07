import { getCategories } from "@/lib/strapi";
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import styles from './styles.module.scss';

export default async function CategoryFeed(data) {
  const { category, topBlogs, topTitle } = data.data;
  const categories = await getCategories();
  const feedCategory = categories.find((cat) => cat.Slug === category.Slug);

  if (!feedCategory) return <div>Category not found</div>;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/blogs?filters[category][Slug][$eq]=${feedCategory.Slug}&populate=*`
  );

  const categoryBlogs = (await response.json()).data;
  if (!categoryBlogs || categoryBlogs.length === 0) return <div>No blogs found in this category</div>;

  const [firstBlog, ...otherBlogs] = categoryBlogs;

  return (
    <section className={styles.categoryFeed}>
      {/* Left column */}
      <div className={styles.categoryFeed__main}>
        <h2 className={styles.categoryFeed__rotatedTitle}>{feedCategory.Name}</h2>

        {/* Featured post */}
        <div className={styles.categoryFeed__featured}>
          {firstBlog ? (
            <Link href={`/blogs/${firstBlog.Slug}`}>
              <div className={styles.categoryFeed__featuredImageWrap}>
                <div className={styles.categoryFeed__overlay} />
                <Image
                  src={
                    firstBlog.FeaturedImage.url.startsWith("http")
                      ? firstBlog.FeaturedImage.url
                      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${firstBlog.FeaturedImage.url.replace(/^\/+/, "")}`
                  }
                  alt={firstBlog.FeaturedImage.alternativeText || firstBlog.Title}
                  width={899}
                  height={699}
                  className={styles.categoryFeed__featuredImage}
                />
              </div>
              <div className={styles.categoryFeed__featuredMeta}>
                <h3 className={styles.categoryFeed__featuredTitle}>{firstBlog.Title}</h3>
                <p className={styles.categoryFeed__featuredExcerpt}>{firstBlog.Excerpt}</p>
              </div>
            </Link>
          ) : (
            <Skeleton variant="rectangular" width="100%" height={700} sx={{ bgcolor: 'grey.900' }} />
          )}
        </div>

        {/* Other posts */}
        <div>
          {otherBlogs.length > 0 ? (
            otherBlogs.slice(0, 5).map((blog, i) => (
              <Link key={i} href={`/blogs/${blog.Slug}`}>
                <div className={styles.categoryFeed__otherItem}>
                  <div className={styles.categoryFeed__otherContent}>
                    <h3 className={styles.categoryFeed__otherTitle}>{blog.Title}</h3>
                    <p className={styles.categoryFeed__otherExcerpt}>{blog.Excerpt}</p>
                  </div>
                  {blog.FeaturedImage && (
                    <Image
                      src={
                        blog.FeaturedImage.url.startsWith("http")
                          ? blog.FeaturedImage.url
                          : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.FeaturedImage.url.replace(/^\/+/, "")}`
                      }
                      alt={blog.Title}
                      width={150}
                      height={150}
                      className={styles.categoryFeed__otherImage}
                    />
                  )}
                </div>
              </Link>
            ))
          ) : (
            /* Skeleton rows */
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1.25rem' }}>
                <div style={{ width: '66%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Skeleton variant="rounded" width="100%" height={40} sx={{ bgcolor: 'grey.900' }} style={{ marginBottom: 6 }} />
                  <Skeleton variant="rounded" width="80%" height={10} sx={{ bgcolor: 'grey.900' }} />
                </div>
                <div style={{ width: '33%' }}>
                  <Skeleton variant="rounded" width="100%" height={120} sx={{ bgcolor: 'grey.900' }} />
                </div>
              </div>
            ))
          )}
        </div>

        <Link href={`/category/${feedCategory.Slug}`} className={styles.categoryFeed__viewAll}>
          View all in {feedCategory.Name}
        </Link>
      </div>

      {/* Sidebar */}
      <div className={styles.categoryFeed__sidebar}>
        {topTitle && (
          <h3 className={styles.categoryFeed__sidebarTitle}>{topTitle}</h3>
        )}
        {topBlogs &&
          topBlogs.map((blog, i) => (
            <div key={i}>
              <Link href={`/blogs/${blog.Slug}`}>
                <div className={styles.categoryFeed__topItem}>
                  <h4 className={styles.categoryFeed__topTitle}>{blog.Title}</h4>
                  <p className={styles.categoryFeed__topExcerpt}>{blog.Excerpt}</p>
                </div>
              </Link>
            </div>
          ))}
      </div>

      <div />
    </section>
  );
}
