"use client";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useRef, useState } from "react";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { formatAuthorName } from "@/lib/author";
import styles from "./styles.module.scss";

export default function MainHeader({ data }) {
  if (!data.blogs || data.blogs.length === 0) return null;

  const desktopFeaturedBottomPadding = 96;
  const [firstBlog, ...otherBlogs] = data.blogs;
  const featuredMediaRef = useRef(null);
  const featuredMetaRef = useRef(null);
  const [featuredSpacing, setFeaturedSpacing] = useState(0);

  useEffect(() => {
    const mediaElement = featuredMediaRef.current;
    const metaElement = featuredMetaRef.current;

    if (!mediaElement || !metaElement) return undefined;

    const updateFeaturedSpacing = () => {
      if (window.innerWidth < 768) {
        setFeaturedSpacing((currentSpacing) => (currentSpacing === 0 ? currentSpacing : 0));
        return;
      }

      const mediaRect = mediaElement.getBoundingClientRect();
      const metaRect = metaElement.getBoundingClientRect();
      const overflow = Math.max(
        0,
        Math.ceil(metaRect.bottom - mediaRect.bottom - desktopFeaturedBottomPadding)
      );
      setFeaturedSpacing((currentSpacing) =>
        currentSpacing === overflow ? currentSpacing : overflow
      );
    };

    const animationFrameId = window.requestAnimationFrame(updateFeaturedSpacing);
    window.addEventListener("resize", updateFeaturedSpacing);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateFeaturedSpacing);
      resizeObserver.observe(mediaElement);
      resizeObserver.observe(metaElement);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateFeaturedSpacing);
      resizeObserver?.disconnect();
    };
  }, [desktopFeaturedBottomPadding, firstBlog?.Title, firstBlog?.Excerpt, firstBlog?.author?.Name, firstBlog?.category?.Name]);

  return (
    <header className={`container ${styles.mainHeader}`}>
      <div className={styles.mainHeader__inner}>
        {/* Main blog (large) */}
        <div className={styles.mainHeader__featured} style={{ marginBottom: featuredSpacing }}>
          {firstBlog ? (
            <Link href={`/blogs/${firstBlog.Slug}`} className={styles.mainHeader__featuredLink}>
              <div style={{ position: "relative" }} ref={featuredMediaRef}>
                <div className={styles.mainHeader__overlay} />
                <Image
                  src={getStrapiMediaUrl(firstBlog.FeaturedImage.url)}
                  alt={firstBlog.FeaturedImage.alternativeText || firstBlog.Title}
                  width={900}
                  height={700}
                  className={styles.mainHeader__featuredImage}
                />
                <div className={styles.mainHeader__featuredMeta} ref={featuredMetaRef}>
                  <h1 className={styles.mainHeader__featuredTitle}>{firstBlog.Title}</h1>
                  <p className={styles.mainHeader__featuredExcerpt}>{firstBlog.Excerpt}</p>
                  <div className={styles.mainHeader__featuredAuthor}>
                    {firstBlog.author?.Name && (
                      <>
                        <p>by</p>
                        <p className={styles.mainHeader__authorName}>{formatAuthorName(firstBlog.author.Name)}</p>
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
                        <p>by</p>
                        <p className={styles.mainHeader__authorName}>{formatAuthorName(blog.author.Name)}</p>
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
                    src={getStrapiMediaUrl(blog.FeaturedImage.url)}
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
