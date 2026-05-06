'use client';

import { useState } from 'react';
import { formatAuthorName } from '@/lib/author';
import styles from './styles.module.scss';

const getAuthorName = (author) => {
  if (!author) return '';

  return (
    author?.Name ||
    author?.name ||
    author?.attributes?.Name ||
    author?.attributes?.name ||
    author?.data?.Name ||
    author?.data?.name ||
    author?.data?.attributes?.Name ||
    author?.data?.attributes?.name ||
    ''
  );
};

export default function ExcerptSectionClient({ data, previewImage, hostname, linkLabel }) {
  const [isHoverActivated, setIsHoverActivated] = useState(false);
  const rawComponentAuthorName = getAuthorName(data?.author);
  const componentAuthorName = rawComponentAuthorName
    ? formatAuthorName(rawComponentAuthorName)
    : null;

  const getProvider = (url = '', host = '') => {
    const source = `${url} ${host}`.toLowerCase();

    if (source.includes('youtube.com') || source.includes('youtu.be')) return 'youtube';
    if (source.includes('twitter.com') || source.includes('x.com')) return 'twitter';
    if (source.includes('facebook.com') || source.includes('fb.com')) return 'facebook';
    if (source.includes('reddit.com')) return 'reddit';
    if (source.includes('instagram.com')) return 'instagram';
    if (source.includes('tiktok.com')) return 'tiktok';
    if (source.includes('linkedin.com')) return 'linkedin';
    if (source.includes('vimeo.com')) return 'vimeo';
    if (source.includes('spotify.com')) return 'spotify';
    if (source.includes('soundcloud.com')) return 'soundcloud';

    return 'generic';
  };

  const provider = getProvider(data?.url, hostname);

  return (
    <div
      className={`${styles.excerptSection} ${styles[`excerptSection--${provider}`]} ${isHoverActivated ? styles['excerptSection--activated'] : ''}`}
      onMouseEnter={() => setIsHoverActivated(true)}
    >
      <div className={styles.excerptSection__text}>
        {(data.title || data.summary) && (
          <div className={styles.sectionHeader}>
            {data.title && <h2 className={styles.sectionTitle}>{data.title}</h2>}
            {componentAuthorName && (
              <p className={styles.sectionAuthor}>
                by <span className={styles.sectionAuthorName}>{componentAuthorName}</span>
              </p>
            )}
            {data.summary && <p className={styles.sectionSummary}>{data.summary}</p>}
          </div>
        )}

        <h3 className={styles.embedTitle}>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            {linkLabel}
          </a>
        </h3>

        {hostname && hostname !== linkLabel && <p className={styles.embedAuthor}>via {hostname}</p>}
      </div>

      <div className={styles.excerptSection__media}>
        <div className={styles.embedWrapper}>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.genericEmbedLink}
          >
            {previewImage ? (
              <>
                <img src={previewImage} alt={linkLabel} className={styles.thumbnailImage} />
                <div className={styles.embedOverlay}>
                  <p>{linkLabel}</p>
                </div>
              </>
            ) : (
              <div
                style={{
                  position: 'relative',
                  minHeight: '160px',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(25, 207, 249, 0.22)',
                  background:
                    'linear-gradient(135deg, rgba(25, 207, 249, 0.18) 0%, rgba(7, 11, 20, 0.92) 100%)',
                }}
              >
                <div className={styles.embedOverlay}>
                  <p>{linkLabel}</p>
                </div>
              </div>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
