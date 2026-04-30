import { getCategories, STRAPI_ORIGIN, getStrapiMediaUrl } from "@/lib/strapi";
import { formatAuthorName } from "@/lib/author";
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import styles from './styles.module.scss';

export default async function CategoryFeed(data) {
  const { category, topBlogs, topTitle, color } = data.data;
  const categories = await getCategories();
  const feedCategory = categories.find((cat) => cat.Slug === category.Slug);
  const sidebarBackground = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color || '')
    ? { backgroundColor: color }
    : undefined;

  if (!feedCategory) return <div>Category not found</div>;

  const response = await fetch(
    `${STRAPI_ORIGIN}/api/blogs?filters[category][Slug][$eq]=${feedCategory.Slug}&populate[0]=FeaturedImage&populate[1]=author&populate[2]=category`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    return <div>Unable to load category posts</div>;
  }

  const parsed = await response.json();
  const categoryBlogs = parsed?.data;
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
                  src={getStrapiMediaUrl(firstBlog.FeaturedImage.url)}
                  alt={firstBlog.FeaturedImage.alternativeText || firstBlog.Title}
                  width={899}
                  height={699}
                  className={styles.categoryFeed__featuredImage}
                />
              </div>
              <div className={styles.categoryFeed__featuredMeta}>
                <h3 className={styles.categoryFeed__featuredTitle}>{firstBlog.Title}</h3>
                <p className={styles.categoryFeed__featuredExcerpt}>{firstBlog.Excerpt}</p>
                <div className={styles.categoryFeed__featuredAuthor}>
                  {firstBlog.author?.Name && (
                    <>
                      <p>by</p>
                      <p className={styles.categoryFeed__authorName}>{formatAuthorName(firstBlog.author.Name)}</p>
                    </>
                  )}
                  {firstBlog.category?.Name && (
                    <>
                      <p>in</p>
                      <p className={styles.categoryFeed__categoryName}>{firstBlog.category.Name}</p>
                    </>
                  )}
                </div>
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
                    <div className={styles.categoryFeed__otherMeta}>
                      {blog.author?.Name && (
                        <>
                          <p>by</p>
                          <p className={styles.categoryFeed__authorName}>{formatAuthorName(blog.author.Name)}</p>
                        </>
                      )}
                      {blog.category?.Name && (
                        <>
                          <p>in</p>
                          <p className={styles.categoryFeed__categoryName}>{blog.category.Name}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {blog.FeaturedImage && (
                    <Image
                      src={getStrapiMediaUrl(blog.FeaturedImage.url)}
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
      <div className={styles.categoryFeed__sidebar} style={sidebarBackground}>
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
