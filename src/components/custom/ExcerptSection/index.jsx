import styles from './styles.module.scss';

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/');
}

function getHostnameLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

async function getPageTitle(url) {
  try {
    new URL(url);
  } catch {
    return { title: '', image: '' };
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExcerptSection/1.0)',
      },
    });

    if (!response.ok) return { title: '', image: '' };

    const html = await response.text();
    const ogTitleMatch =
      html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i);
    const ogImageMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i);
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || '';
    const rawImage = ogImageMatch?.[1] || '';

    let image = '';
    try {
      image = rawImage ? new URL(rawImage, url).toString() : '';
    } catch {
      image = '';
    }

    return {
      title: decodeHtmlEntities(rawTitle.replace(/\s+/g, ' ').trim()),
      image,
    };
  } catch {
    return { title: '', image: '' };
  }
}

export default async function ExcerptSection({ data }) {
  if (!data?.url) return null;

  const { title: pageTitle, image: previewImage } = await getPageTitle(data.url);
  const hostname = getHostnameLabel(data.url);
  const linkLabel = pageTitle || hostname || data.url;

  return (
    <div
      className={`${styles.excerptSection}`}
    >
      <div className={styles.excerptSection__text}>
        {(data.title || data.summary) && (
          <div className={styles.sectionHeader}>
            {data.title && <h2 className={styles.sectionTitle}>{data.title}</h2>}
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
