import { fetchFromStrapi, getCategories, getStrapiMediaUrl } from "@/lib/strapi";
import { formatAuthorName } from "@/lib/author";
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.scss';

export default async function CategoryFeed({ data }) {
  const { category, topBlogs, topTitle, color } = data;

  const categories = await getCategories();
  const feedCategory = categories.find((cat) => cat.Slug === category?.Slug);

  if (!feedCategory) return null;

  const sidebarBackground = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color || '')
    ? { backgroundColor: color }
    : feedCategory.color && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(feedCategory.color)
    ? { backgroundColor: feedCategory.color }
    : undefined;

  let categoryBlogs = [];
  try {
    categoryBlogs = await fetchFromStrapi('blogs', {
      filters: { category: { Slug: { $eq: feedCategory.Slug } } },
      populate: {
        FeaturedImage: { fields: ['url', 'alternativeText'] },
        author: { fields: ['Name'] },
        category: { fields: ['Name', 'Slug'] },
      },
    }, { revalidate: 3600, tags: ['blogs'] });
  } catch {
    return null;
  }

  if (!categoryBlogs || categoryBlogs.length === 0) return null;

  const [firstBlog, ...otherBlogs] = categoryBlogs;

  return (
    <section className={styles.categoryFeed}>
      {/* Left column */}
      <div className={styles.categoryFeed__main}>
        <h2 className={styles.categoryFeed__rotatedTitle}>{feedCategory.Name}</h2>

        {/* Featured post */}
        <div className={styles.categoryFeed__featured}>
          <Link href={`/blogs/${firstBlog.Slug}`}>
            <div className={styles.categoryFeed__featuredImageWrap}>
              <div className={styles.categoryFeed__overlay} />
              <Image
                src={getStrapiMediaUrl(firstBlog.FeaturedImage?.url)}
                alt={firstBlog.FeaturedImage?.alternativeText || firstBlog.Title}
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
        </div>

        {/* Other posts */}
        <div>
          {otherBlogs.slice(0, 5).map((blog, i) => (
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
                {blog.FeaturedImage?.url && (
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
          ))}
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
        {Array.isArray(topBlogs) && topBlogs.map((blog, i) => (
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
