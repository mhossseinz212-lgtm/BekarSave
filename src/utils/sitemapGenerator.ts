import { SiteSettings, ServiceItem, NeighborhoodInfo } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  priority: string;
  changefreq: string;
  title: string;
}

/**
 * Automatically generates a valid sitemap.xml structure based on active site sections,
 * registered services, and coverage neighborhoods in Saveh.
 */
export function generateSitemapXml(
  settings: SiteSettings,
  services: ServiceItem[] = [],
  neighborhoods: NeighborhoodInfo[] = []
): string {
  const baseUrl = (settings.canonicalUrl || 'https://behkar-saveh.ir/').replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Core Site Sections
  const corePages: SitemapUrlEntry[] = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', title: 'صفحه اصلی' },
    { loc: `${baseUrl}/#services`, priority: '0.9', changefreq: 'weekly', title: 'خدمات لوله بازکنی و تخلیه چاه' },
    { loc: `${baseUrl}/#tariffs`, priority: '0.85', changefreq: 'weekly', title: 'تعرفه و برآورد آنلاین قیمت' },
    { loc: `${baseUrl}/#coverage`, priority: '0.8', changefreq: 'monthly', title: 'پوشش مناطق و شهرک‌های ساوه' },
    { loc: `${baseUrl}/#why-us`, priority: '0.75', changefreq: 'monthly', title: 'چرا بهکار و ضمانت‌نامه‌ها' },
    { loc: `${baseUrl}/#gallery`, priority: '0.7', changefreq: 'weekly', title: 'گالری و نمونه‌کارها' },
    { loc: `${baseUrl}/#reviews`, priority: '0.65', changefreq: 'weekly', title: 'نظرات و رضایت مشتریان' },
    { loc: `${baseUrl}/#faq`, priority: '0.7', changefreq: 'monthly', title: 'سوالات متداول' },
    { loc: `${baseUrl}/#contact`, priority: '0.8', changefreq: 'monthly', title: 'ارتباط و تماس با مدیریت' },
  ];

  // Dynamically include active services
  const servicePages: SitemapUrlEntry[] = (services || []).map(srv => ({
    loc: `${baseUrl}/#service-${srv.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    title: srv.title || 'خدمت تاسیساتی'
  }));

  // Dynamically include active Saveh neighborhoods
  const neighborhoodPages: SitemapUrlEntry[] = (neighborhoods || []).map(nh => ({
    loc: `${baseUrl}/#area-${nh.id}`,
    priority: '0.75',
    changefreq: 'monthly',
    title: nh.name || 'محدوده ساوه'
  }));

  const allEntries = [...corePages, ...servicePages, ...neighborhoodPages];

  const xmlUrls = allEntries
    .map(
      entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;
}

/**
 * Automatically generates robots.txt content with sitemap reference.
 */
export function generateRobotsTxt(settings: SiteSettings): string {
  const baseUrl = (settings.canonicalUrl || 'https://behkar-saveh.ir/').replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /admin

# Sitemap link for Google & Bing search engine crawlers
Sitemap: ${baseUrl}/sitemap.xml
`;
}
