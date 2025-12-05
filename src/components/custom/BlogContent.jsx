'use client';
import { useEffect, useRef } from 'react';

export default function BlogContent({ content }) {
  const contentRef = useRef(null);

  useEffect(() => {
    // 1. Handle Twitter (X) Embeds
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

    // 2. Handle Instagram Embeds
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

    // YouTube and LinkedIn typically use <iframe> tags, which work automatically
    // without needing extra scripts injected here.

  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-xl prose-invert mb-6 font-sans ck-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
