import { useEffect } from 'react';

/**
 * Universal Dynamic SEO Hook
 * Handles Page Titles, Meta Descriptions, Canonical URLs, Open Graph, Twitter Cards & JSON-LD Rich Snippets
 */
export function useDocumentTitle({
  title,
  description,
  keywords,
  canonicalUrl = 'https://binnemat.com',
  ogImage = 'https://binnemat.com/images/logo.png',
  schemaJson = null
}) {
  useEffect(() => {
    // 1. Title
    const siteName = 'Binnemat Pakistan';
    if (title) {
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    // Helper to update or create meta tags
    const setMetaTag = (selector, attr, val) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const key = selector.includes('property=') ? 'property' : 'name';
        const name = selector.match(/["'](.*?)["']/)[1];
        el.setAttribute(key, name);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    // 2. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', 'content', description);
      setMetaTag('meta[property="og:description"]', 'content', description);
      setMetaTag('meta[name="twitter:description"]', 'content', description);
    }

    // 3. Keywords
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // 4. OG & Twitter Titles
    if (title) {
      setMetaTag('meta[property="og:title"]', 'content', document.title);
      setMetaTag('meta[name="twitter:title"]', 'content', document.title);
    }

    // 5. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);

    // 6. OG Image
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'content', ogImage);
      setMetaTag('meta[name="twitter:image"]', 'content', ogImage);
    }

    // 7. Inject Dynamic Schema JSON-LD if provided
    let schemaScript = null;
    if (schemaJson) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify(schemaJson);
      schemaScript.id = 'dynamic-page-schema';
      document.head.appendChild(schemaScript);
    }

    return () => {
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, schemaJson]);
}
