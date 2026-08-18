import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SeoHeadManager: React.FC = () => {
  const { settings } = useApp();

  useEffect(() => {
    if (!settings) return;

    // 1. Update Document Title
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }

    // Helper to safely set meta tag attributes
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, contentValue: string) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // 2. Global Meta Tags
    if (settings.seoDescription) {
      setMetaTag('name', 'description', settings.seoDescription);
    }
    if (settings.seoKeywords) {
      setMetaTag('name', 'keywords', settings.seoKeywords);
    }

    // 3. Open Graph Social Tags
    setMetaTag('property', 'og:title', settings.ogTitle || settings.seoTitle);
    setMetaTag('property', 'og:description', settings.ogDescription || settings.seoDescription);
    if (settings.ogImageUrl || settings.heroImageUrl) {
      setMetaTag('property', 'og:image', settings.ogImageUrl || settings.heroImageUrl || '');
    }
    if (settings.ogSiteName || settings.businessName) {
      setMetaTag('property', 'og:site_name', settings.ogSiteName || settings.businessName);
    }

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:title', settings.ogTitle || settings.seoTitle);
    setMetaTag('name', 'twitter:description', settings.ogDescription || settings.seoDescription);
    if (settings.ogImageUrl || settings.heroImageUrl) {
      setMetaTag('name', 'twitter:image', settings.ogImageUrl || settings.heroImageUrl || '');
    }

    // 5. Canonical Link
    if (settings.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', settings.canonicalUrl);
    }
  }, [settings]);

  return null;
};
