"use client";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import React from "react";
import styles from "./styles.module.scss";

export default function MainHeader({ data }) {
  if (!data.blogs || data.blogs.length === 0) return null;

  const [firstBlog, ...otherBlogs] = data.blogs;

  return (
    <header className={`container ${styles.mainHeader}`}>
      <div className={styles.mainHeader__inner}>
        {/* Main blog (large) */}
        <div className={styles.mainHeader__featured}>
          {firstBlog ? (
            <Link href={`/blogs/${firstBlog.Slug}`} className={styles.mainHeader__featuredLink}>
              <div style={{ position: "relative" }}>
                <div className={styles.mainHeader__overlay} />
                <Image
                  src={
                    firstBlog.FeaturedImage.url.startsWith("http")
                      ? firstBlog.FeaturedImage.url
                      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${firstBlog.FeaturedImage.url.replace(/^\/+/, "")}`
                  }
                  alt={firstBlog.FeaturedImage.alternativeText || firstBlog.Title}
                  width={900}
                  height={700}
                  className={styles.mainHeader__featuredImage}
                />
                <div className={styles.mainHeader__featuredMeta}>
                  <h1 className={styles.mainHeader__featuredTitle}>{firstBlog.Title}</h1>
                  <p className={styles.mainHeader__featuredExcerpt}>{firstBlog.Excerpt}</p>
                  <div className={styles.mainHeader__featuredAuthor}>
                    {firstBlog.author?.Name && (
                      <>
                        <p>By</p>
                        <p className={styles.mainHeader__authorName}>{firstBlog.author.Name}</p>
                      </>
                    )}
                    {firstBlog.category?.Name && (
                      <>
                        <p>in</p>
                        <p className={styles.mainHeader__categoryName}>{firstBlog.category.Name}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Skeleton variant="rectangular" width="100%" height={700} sx={{ bgcolor: "grey.900" }} />
          )}
        </div>

        {/* Side stories */}
        <div className={styles.mainHeader__side}>
          <p className={styles.mainHeader__topStoriesLabel}>Top Stories</p>

          {otherBlogs.length > 0 ? (
            otherBlogs.map((blog) => (
              <Link
                href={`/blogs/${blog.Slug}`}
                key={blog.id}
                className={styles.mainHeader__storyItem}
              >
                <div className={styles.mainHeader__storyContent}>
                  <h2 className={styles.mainHeader__storyTitle}>{blog.Title}</h2>
                  <div className={styles.mainHeader__storyMeta}>
                    {blog.author?.Name && (
                      <>
                        <p>By</p>
                        <p className={styles.mainHeader__authorName}>{blog.author.Name}</p>
                      </>
                    )}
                    {blog.category?.Name && (
                      <>
                        <p>in</p>
                        <p className={styles.mainHeader__categoryName}>{blog.category.Name}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.mainHeader__storyThumb}>
                  <Image
                    src={
                      blog.FeaturedImage.url.startsWith("http")
                        ? blog.FeaturedImage.url
                        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${blog.FeaturedImage.url.replace(/^\/+/, "")}`
                    }
                    alt={blog.FeaturedImage.alternativeText || blog.Title}
                    width={200}
                    height={112}
                    className={styles.mainHeader__storyImage}
                  />
                </div>
              </Link>
            ))
          ) : (
            /* Skeleton placeholders */
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <div style={{ width: "66%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Skeleton variant="rounded" width="100%" height={40} sx={{ bgcolor: "grey.900" }} style={{ marginBottom: 6 }} />
                  <Skeleton variant="rounded" width="80%" height={10} sx={{ bgcolor: "grey.900" }} />
                </div>
                <div style={{ width: "33%" }}>
                  <Skeleton variant="rounded" width="100%" height={120} sx={{ bgcolor: "grey.900" }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </header>
  );
}
