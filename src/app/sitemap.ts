import { MetadataRoute } from 'next';
import { features, solutions, roles } from '@/data/site-data';
import { db } from '@/lib/db';
import { SITE_URL as BASE_URL } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/product`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/school-erp-tamil-nadu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/school-erp-chennai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/managed-it-services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/platform-capabilities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/webinars`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/help`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/release-notes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const featurePages: MetadataRoute.Sitemap = features.map((f) => ({
    url: `${BASE_URL}/features/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const solutionPages: MetadataRoute.Sitemap = solutions.map((s) => ({
    url: `${BASE_URL}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const rolePages: MetadataRoute.Sitemap = roles.map((r) => ({
    url: `${BASE_URL}/solutions/role/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic content from database
  let blogPages: MetadataRoute.Sitemap = [];
  let caseStudyPages: MetadataRoute.Sitemap = [];
  let newsPages: MetadataRoute.Sitemap = [];
  let webinarPages: MetadataRoute.Sitemap = [];

  try {
    const [blogPosts, caseStudies, newsEvents, webinars] = await Promise.all([
      db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.caseStudy.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.newsEvent.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.webinar.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    blogPages = blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    caseStudyPages = caseStudies.map((cs) => ({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: cs.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    newsPages = newsEvents.map((n) => ({
      url: `${BASE_URL}/news/${n.slug}`,
      lastModified: n.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    webinarPages = webinars.map((w) => ({
      url: `${BASE_URL}/webinars/${w.slug}`,
      lastModified: w.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // DB may not be available during build — silently skip dynamic pages
  }

  return [
    ...staticPages,
    ...featurePages,
    ...solutionPages,
    ...rolePages,
    ...blogPages,
    ...caseStudyPages,
    ...newsPages,
    ...webinarPages,
  ];
}
