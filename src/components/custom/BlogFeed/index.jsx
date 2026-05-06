'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import styles from './styles.module.scss';

export default function BlogFeed({ category, blogs }) {
  const blogsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const goToNextPage    = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPage        = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('ellipsis-left');
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push('ellipsis-right');

    pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <section className={`container ${styles.blogFeed}`}>
      <h1 className={styles.blogFeed__heading}>{category.Name}</h1>

      <div className={styles.blogFeed__grid}>
        {currentBlogs && currentBlogs.length > 0 ? (
          currentBlogs.map((blog, i) => (
            <Link
              href={`/blogs/${blog.Slug}`}
              className={styles.blogCard}
              key={i}
            >
              <div className={styles.blogCard__inner}>
                <div className={styles.blogCard__imageWrap}>
                  {blog?.FeaturedImage && (
                    <>
                      <div className={styles.blogCard__overlay} />
                      <Image
                        src={`${blog.FeaturedImage.url}`}
                        alt={blog.Title}
                        width={700}
                        height={500}
                        className={styles.blogCard__image}
                      />
                    </>
                  )}
                  <h2 className={styles.blogCard__title}>{blog.Title}</h2>
                </div>
                <p className={styles.blogCard__excerpt}>{blog.Excerpt}</p>
              </div>
            </Link>
          ))
        ) : (
          <div>
            <Skeleton variant="rounded" width="100%" height={500} sx={{ bgcolor: 'grey.900' }} style={{ marginBottom: 6 }} />
            <Skeleton variant="rounded" width="100%" height={70}  sx={{ bgcolor: 'grey.900' }} />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`${styles.pagination__btn} ${currentPage === 1 ? styles['pagination__btn--disabled'] : styles['pagination__btn--default']}`}
          >
            Previous
          </button>

          {visiblePages.map((page, index) => {
            if (typeof page !== 'number') {
              return (
                <span key={`${page}-${index}`} className={styles.pagination__ellipsis} aria-hidden="true">
                  …
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`${styles.pagination__btn} ${currentPage === page ? styles['pagination__btn--active'] : styles['pagination__btn--default']}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`${styles.pagination__btn} ${currentPage === totalPages ? styles['pagination__btn--disabled'] : styles['pagination__btn--default']}`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
