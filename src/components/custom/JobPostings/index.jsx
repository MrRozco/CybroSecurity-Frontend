"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import { getStrapiMediaUrl } from '@/lib/strapi';

export default function JobPostings({ data, filterOptions }) {
  if (!data) return null;

  const postings = Array.isArray(data.job_postings) ? data.job_postings : [];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  console.log('JobPostings component received data:', data);

  const categoryOptions = useMemo(() => {
    const apiCategories = Array.isArray(filterOptions?.categories)
      ? filterOptions.categories.map((item) => ({
          value: item?.slug || item?.name,
          label: item?.name,
        }))
      : [];

    const postingCategories = postings
      .map((job) => {
        const categoryName = job?.job_category?.name;
        const categorySlug = job?.job_category?.slug;
        if (!categoryName) return null;
        return { value: categorySlug || categoryName, label: categoryName };
      })
      .filter(Boolean);

    const merged = [...apiCategories, ...postingCategories].filter(
      (item) => item?.value && item?.label
    );

    return Array.from(new Map(merged.map((item) => [item.value, item])).values());
  }, [filterOptions?.categories, postings]);

  const levelOptions = useMemo(() => {
    const apiLevels = Array.isArray(filterOptions?.levels)
      ? filterOptions.levels.map((item) => ({
          value: item?.slug || item?.level,
          label: item?.level,
        }))
      : [];

    const postingLevels = postings
      .map((job) => {
        const levelName = job?.job_level?.level;
        const levelSlug = job?.job_level?.slug;
        if (!levelName) return null;
        return { value: levelSlug || levelName, label: levelName };
      })
      .filter(Boolean);

    const merged = [...apiLevels, ...postingLevels].filter((item) => item?.value && item?.label);

    return Array.from(new Map(merged.map((item) => [item.value, item])).values());
  }, [filterOptions?.levels, postings]);

  const filteredPostings = useMemo(() => {
    return postings.filter((job) => {
      const jobCategory = job?.job_category?.slug || job?.job_category?.name;
      const jobLevel = job?.job_level?.slug || job?.job_level?.level;

      const categoryMatch = selectedCategory === 'all' || jobCategory === selectedCategory;
      const levelMatch = selectedLevel === 'all' || jobLevel === selectedLevel;

      return categoryMatch && levelMatch;
    });
  }, [postings, selectedCategory, selectedLevel]);

  const formatPostedDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className={styles.jobPostings}>
      {data.Title && <h2 className={styles.jobPostings__title}>{data.Title}</h2>}
      {data.description && <p className={styles.jobPostings__description}>{data.description}</p>}

      <div className={styles.jobPostings__filters}>
        <label className={styles.jobPostings__filterItem}>
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className={styles.jobPostings__select}
          >
            <option value="all">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.jobPostings__filterItem}>
          <span>Level</span>
          <select
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            className={styles.jobPostings__select}
          >
            <option value="all">All levels</option>
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.jobPostings__list}>
        {filteredPostings.map((job) => {
          const logoUrl = job?.logo?.url ? getStrapiMediaUrl(job.logo.url) : '';
          const level = job?.job_level?.level;
          const category = job?.job_category?.name;
          const postedDate = formatPostedDate(job?.posted);

          return (
            <article key={job.documentId || job.id} className={styles.jobCard}>
              <div className={styles.jobCard__content}>
                <div className={styles.jobCard__headingRow}>
                  {logoUrl ? (
                    <div className={styles.jobCard__logoWrap}>
                      <Image
                        src={logoUrl}
                        alt={job?.logo?.alternativeText || job?.title || 'Company logo'}
                        width={56}
                        height={56}
                        className={styles.jobCard__logo}
                      />
                    </div>
                  ) : null}
                  {job?.title && <h3 className={styles.jobCard__title}>{job.title}</h3>}
                </div>

                {postedDate && <p className={styles.jobCard__posted}>Posted {postedDate}</p>}

                {job?.description && <p className={styles.jobCard__description}>{job.description}</p>}

                <div className={styles.jobCard__bottomRow}>
                  <div className={styles.jobCard__meta}>
                    {level && <span className={styles.jobCard__badge}>{level}</span>}
                    {category && <span className={styles.jobCard__badge}>{category}</span>}
                  </div>

                  {job?.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.jobCard__cta}
                    >
                      View job
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredPostings.length === 0 && (
          <p className={styles.jobPostings__empty}>No jobs match the selected filters.</p>
        )}
      </div>
    </section>
  );
}
