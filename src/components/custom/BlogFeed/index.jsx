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

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`${styles.pagination__btn} ${currentPage === index + 1 ? styles['pagination__btn--active'] : styles['pagination__btn--default']}`}
            >
              {index + 1}
            </button>
          ))}

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
