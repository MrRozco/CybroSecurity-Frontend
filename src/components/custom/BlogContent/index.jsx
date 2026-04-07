'use client';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export default function BlogContent({ content }) {
  const contentRef = useRef(null);

  useEffect(() => {
    // Handle Twitter (X) Embeds
    if (content.includes('twitter-tweet')) {
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(contentRef.current);
      } else if (!document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => window.twttr?.widgets?.load(contentRef.current);
        document.body.appendChild(script);
      }
    }

    // Handle Instagram Embeds
    if (content.includes('instagram-media')) {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      } else if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => window.instgrm?.Embeds?.process();
        document.body.appendChild(script);
      }
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`${styles.blogContent} ck-content`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
