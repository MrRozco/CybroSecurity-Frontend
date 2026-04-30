'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';

const LINKEDIN_EMBED_HEIGHT = 620;

const runAfterPaint = (callback) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(callback);
  });
};

const loadExternalScript = ({ id, src, onLoad }) => {
  const handleLoad = () => {
    runAfterPaint(onLoad);
  };

  const existingScript = id ? document.getElementById(id) : document.querySelector(`script[src="${src}"]`);

  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      handleLoad();
      return () => undefined;
    }

    existingScript.addEventListener('load', handleLoad, { once: true });
    return () => existingScript.removeEventListener('load', handleLoad);
  }

  const script = document.createElement('script');

  if (id) {
    script.id = id;
  }

  script.src = src;
  script.async = true;
  script.onload = () => {
    script.dataset.loaded = 'true';
    handleLoad();
  };
  document.body.appendChild(script);

  return () => script.removeEventListener?.('load', handleLoad);
};

const hydrateEmbedScripts = (container) => {
  if (!container) return;

  const scripts = Array.from(container.querySelectorAll('script'));

  scripts.forEach((script) => {
    if (!script?.isConnected) return;

    const replacement = document.createElement('script');

    Array.from(script.attributes).forEach((attribute) => {
      replacement.setAttribute(attribute.name, attribute.value);
    });

    if (script.src) {
      replacement.src = script.src;
      replacement.async = script.async ?? true;
    } else {
      replacement.textContent = script.textContent;
    }

    const parent = script.parentNode;
    if (!parent || !parent.contains(script)) return;

    try {
      parent.replaceChild(replacement, script);
    } catch {
      // Embed scripts can mutate DOM quickly; skip stale nodes safely.
    }
  });
};

const getLinkedInEmbedUrl = (linkedinUrl) => {
  if (!linkedinUrl) return null;

  const decodedUrl = decodeURIComponent(linkedinUrl);
  const activityMatch = decodedUrl.match(/activity[:/-](\d+)/i);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }

  const shareMatch = decodedUrl.match(/share[:/-](\d+)/i);
  if (shareMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${shareMatch[1]}`;
  }

  const ugcPostMatch = decodedUrl.match(/ugcPost[:/-](\d+)/i);
  if (ugcPostMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcPostMatch[1]}`;
  }

  return null;
};

export default function SocialMediaEmbed({ data }) {
  if (!data || !data.embed) return null;

  const { url, oembed, thumbnail } = data.embed;
  const twitterContainerRef = useRef(null);
  const htmlEmbedContainerRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Detect provider from URL or oembed
  const provider = useMemo(() => {
    const providerName = oembed?.provider_name?.toLowerCase() || '';

    if (providerName.includes('youtube')) return 'youtube';
    if (providerName.includes('twitter') || url.includes('twitter.com') || url.includes('x.com'))
      return 'twitter';
    if (providerName.includes('facebook')) return 'facebook';
    if (providerName.includes('reddit')) return 'reddit';
    if (providerName.includes('instagram')) return 'instagram';
    if (providerName.includes('tiktok')) return 'tiktok';
    if (providerName.includes('linkedin') || url.includes('linkedin.com')) return 'linkedin';
    if (providerName.includes('vimeo')) return 'vimeo';
    if (providerName.includes('spotify')) return 'spotify';
    if (providerName.includes('soundcloud')) return 'soundcloud';

    return 'generic';
  }, [oembed, url]);

  const isYoutubeLayout = provider === 'youtube';
  const isNonYoutube = provider !== 'youtube';
  const isLeftStackLayout = provider !== 'youtube';

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (provider !== 'twitter') return;

    const loadTwitterWidgets = () => {
      if (window.twttr?.widgets && twitterContainerRef.current) {
        runAfterPaint(() => window.twttr.widgets.load(twitterContainerRef.current));
      }
    };

    return loadExternalScript({
      id: 'twitter-wjs',
      src: 'https://platform.twitter.com/widgets.js',
      onLoad: loadTwitterWidgets,
    });
  }, [provider, url]);

  // Load TikTok embed script
  useEffect(() => {
    if (provider !== 'tiktok') return;

    const renderTikTokEmbeds = () => {
      if (window.tiktokEmbed?.lib?.render) {
        const nodes = Array.from(document.getElementsByClassName('tiktok-embed')).filter(
          (node) => node.id === ''
        );
        window.tiktokEmbed.lib.render(nodes);
      } else if (htmlEmbedContainerRef.current) {
        hydrateEmbedScripts(htmlEmbedContainerRef.current);
      }
    };

    return loadExternalScript({
      id: 'ttEmbedLibScript',
      src: 'https://www.tiktok.com/embed.js',
      onLoad: renderTikTokEmbeds,
    });
  }, [provider, url, oembed?.html]);

  // Load Instagram embed script
  useEffect(() => {
    if (provider !== 'instagram') return;

    const processInstagram = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    if (window.instgrm?.Embeds) {
      processInstagram();
      return;
    }

    return loadExternalScript({
      id: 'instagram-embed-js',
      src: 'https://www.instagram.com/embed.js',
      onLoad: processInstagram,
    });
  }, [provider, url]);

  useEffect(() => {
    if (!hasMounted || !oembed?.html || !htmlEmbedContainerRef.current) {
      return;
    }

    if (!['generic', 'linkedin', 'tiktok'].includes(provider)) {
      return;
    }

    runAfterPaint(() => hydrateEmbedScripts(htmlEmbedContainerRef.current));
  }, [provider, oembed?.html, hasMounted, url]);

  // Extract video ID from YouTube URL for custom embed
  const getYouTubeId = (youtubeUrl) => {
    const match =
      youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/) ||
      youtubeUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const getVimeoId = (vimeoUrl) => {
    const match = vimeoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const extractTikTokId = (tiktokUrl) => {
    const match = tiktokUrl.match(/video\/(\d+)/);
    return match ? match[1] : '';
  };

  const getNumericHeight = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
  };

  const getEmbedHeight = (fallbackHeight) => getNumericHeight(oembed?.height) || fallbackHeight;

  const renderHtmlEmbed = (className) => (
    <div
      ref={htmlEmbedContainerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: oembed.html }}
    />
  );

  const renderEmbed = () => {
    switch (provider) {
      case 'youtube': {
        const videoId = getYouTubeId(url);
        return (
          <div className={styles.embedWrapper}>
            <div className={styles.youtubeContainer}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={oembed?.title || 'YouTube Video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={styles.iframeYoutube}
              />
            </div>
          </div>
        );
      }

      case 'twitter':
        return (
          <div className={styles.embedWrapper}>
            <div ref={twitterContainerRef}>
              <blockquote
                className={`${styles.twitterEmbed} twitter-tweet`}
                data-theme="dark"
                data-conversation="none"
                data-align="left"
              >
                <a href={oembed?.url || url}>View on X</a>
              </blockquote>
            </div>
          </div>
        );

      case 'facebook':
        if (oembed?.html) {
          return renderHtmlEmbed(`${styles.embedWrapper} ${styles.facebookWrapper}`);
        }
        return (
          <div className={styles.embedWrapper}>
            <iframe
              src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&width=500&show_text=true`}
              width="100%"
              height={getEmbedHeight(380)}
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className={styles.iframeFacebook}
            />
          </div>
        );

      case 'reddit':
        let redditEmbedUrl = url;
        try {
          const parsed = new URL(url);
          redditEmbedUrl = `https://www.redditmedia.com${parsed.pathname}?ref_source=embed&ref=share&embed=true`;
        } catch {
          redditEmbedUrl = url;
        }

        return (
          <div className={styles.embedWrapper}>
            <iframe
              src={redditEmbedUrl}
              height={getEmbedHeight(240)}
              width="100%"
              style={{
                border: 'none',
                borderRadius: '4px',
              }}
              scrolling="no"
              frameBorder="0"
              className={styles.iframeReddit}
            />
          </div>
        );

      case 'instagram':
        if (oembed?.html) {
          return renderHtmlEmbed(`${styles.embedWrapper} ${styles.instagramWrapper}`);
        }

        return (
          <div className={styles.embedWrapper}>
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ maxWidth: '100%', minWidth: '326px', margin: '0' }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                View on Instagram
              </a>
            </blockquote>
          </div>
        );

      case 'tiktok':
        if (oembed?.html) {
          return renderHtmlEmbed(`${styles.embedWrapper} ${styles.tiktokWrapper}`);
        }

        return (
          <div className={styles.embedWrapper}>
            <blockquote
              className="tiktok-embed"
              cite={url}
              data-video-id={extractTikTokId(url)}
              style={{ maxWidth: '100%', minWidth: '325px' }}
            >
              <section>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View on TikTok
                </a>
              </section>
            </blockquote>
          </div>
        );

      case 'linkedin': {
        const linkedInEmbedUrl = getLinkedInEmbedUrl(url);

        if (oembed?.html) {
          return renderHtmlEmbed(`${styles.embedWrapper} ${styles.linkedinWrapper}`);
        }

        if (linkedInEmbedUrl) {
          return (
            <div className={styles.embedWrapper}>
              <iframe
                src={linkedInEmbedUrl}
                width="100%"
                height={getEmbedHeight(LINKEDIN_EMBED_HEIGHT)}
                frameBorder="0"
                allowFullScreen
                title={oembed?.title || 'LinkedIn Post'}
                className={styles.iframeLinkedIn}
              />
            </div>
          );
        }

        return (
          <div className={styles.embedWrapper}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.genericEmbedLink}
            >
              <div className={styles.embedOverlay}>
                <p>{oembed?.title || 'View LinkedIn Post'}</p>
              </div>
            </a>
          </div>
        );
      }

      case 'vimeo': {
        const vimeoId = getVimeoId(url);
        return (
          <div className={styles.embedWrapper}>
            <div className={styles.vimeoContainer}>
              <iframe
                width="100%"
                height="100%"
                src={`https://player.vimeo.com/video/${vimeoId}?color=19cff9&title=0&byline=0&portrait=0`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className={styles.iframeVimeo}
              />
            </div>
          </div>
        );
      }

      case 'spotify':
        return (
          <div className={styles.embedWrapper}>
            <iframe
              style={{
                borderRadius: '12px',
              }}
              src={`https://open.spotify.com/embed/${url.split('spotify.com/')[1]}`}
              width="100%"
              height={getEmbedHeight(352)}
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className={styles.iframeSpotify}
            />
          </div>
        );

      case 'soundcloud':
        return (
          <div className={styles.embedWrapper}>
            <iframe
              width="100%"
              height={getEmbedHeight(220)}
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
              className={styles.iframeSoundcloud}
            />
          </div>
        );

      default:
        // Generic embed using oembed HTML if available
        if (oembed?.html) {
          return renderHtmlEmbed(styles.embedWrapper);
        }

        // Fallback: show thumbnail + link
        return (
          <div className={styles.embedWrapper}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.genericEmbedLink}
            >
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={oembed?.title || 'Embed'}
                  width={500}
                  height={300}
                  className={styles.thumbnailImage}
                />
              )}
              {oembed?.thumbnail_url && !thumbnail && (
                <Image
                  src={oembed.thumbnail_url}
                  alt={oembed?.title || 'Embed'}
                  width={oembed?.thumbnail_width || 500}
                  height={oembed?.thumbnail_height || 300}
                  className={styles.thumbnailImage}
                />
              )}
              <div className={styles.embedOverlay}>
                <p>{oembed?.title || 'View Content'}</p>
              </div>
            </a>
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.socialMediaEmbed} ${styles[`socialMediaEmbed--${provider}`]} ${
        isYoutubeLayout ? styles['socialMediaEmbed--split'] : ''
      } ${
        isLeftStackLayout ? styles['socialMediaEmbed--leftStack'] : ''
      } ${
        isNonYoutube ? styles['socialMediaEmbed--nonYoutube'] : ''
      }`}
    >
      <div className={styles.socialMediaEmbed__text}>
        {(data?.title || data?.summary) && (
          <div className={styles.sectionHeader}>
            {data?.title && <h2 className={styles.sectionTitle}>{data.title}</h2>}
            {data?.summary && <p className={styles.sectionSummary}>{data.summary}</p>}
          </div>
        )}

        {(data?.title || data?.summary) && oembed?.title && <div className={styles.sectionSeparator} />}

        {oembed?.title && <h3 className={styles.embedTitle}>{oembed.title}</h3>}

        {oembed?.author_name && (
          <p className={styles.embedAuthor}>
            by{' '}
            {oembed?.author_url ? (
              <a href={oembed.author_url} target="_blank" rel="noopener noreferrer">
                {oembed.author_name}
              </a>
            ) : (
              oembed.author_name
            )}
          </p>
        )}

        {provider === 'generic' && oembed?.description && (
          <p className={styles.embedDescription}>{oembed.description}</p>
        )}
      </div>

      <div className={styles.socialMediaEmbed__media}>{renderEmbed()}</div>
    </div>
  );
}