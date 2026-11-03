import { Metadata } from 'next';
import BlogPageClient, { type HubItem } from './BlogPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/blog');
}

const words = (s: string | null | undefined) => (s ? s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0);

// The Resources hub: every published post, case study, news item, webinar and release note in one list, newest first.
export default async function BlogPage() {
  const [blogs, cases, news, webinars, releases] = await Promise.all([
    db.blogPost.findMany({ where: { published: true } }),
    db.caseStudy.findMany({ where: { published: true } }),
    db.newsEvent.findMany({ where: { published: true } }),
    db.webinar.findMany({ where: { published: true } }),
    db.releaseNote.findMany({ where: { published: true } }),
  ]);

  const items: HubItem[] = [
    ...blogs.map((b) => ({
      id: `b-${b.id}`, kind: 'Blogs', title: b.title, excerpt: b.excerpt ?? '', href: `/blog/${b.slug}`, image: b.coverImage,
      tag: b.category, by: b.author, date: (b.publishedAt ?? b.createdAt).toISOString(), minutes: Math.max(1, Math.round(words(b.content) / 200)),
    })),
    ...cases.map((c) => ({
      id: `c-${c.id}`, kind: 'Case Studies', title: c.title, excerpt: c.excerpt ?? '', href: `/case-studies/${c.slug}`, image: c.coverImage,
      tag: c.schoolName ?? 'Case Study', by: null, date: c.createdAt.toISOString(), minutes: 0,
    })),
    ...news.map((n) => ({
      id: `n-${n.id}`, kind: 'News & Events', title: n.title, excerpt: n.excerpt ?? '', href: `/news/${n.slug}`, image: n.coverImage,
      tag: n.category, by: null, date: (n.eventDate ?? n.createdAt).toISOString(), minutes: 0,
    })),
    ...webinars.map((w) => ({
      id: `w-${w.id}`, kind: 'Webinars', title: w.title, excerpt: w.description ?? '', href: `/webinars/${w.slug}`, image: w.coverImage,
      tag: 'Webinar', by: w.speaker, date: (w.date ?? w.createdAt).toISOString(), minutes: 0,
    })),
    ...releases.map((r) => ({
      id: `r-${r.id}`, kind: 'Release Notes', title: r.title, excerpt: `Version ${r.version}`, href: '/release-notes', image: null,
      tag: r.type, by: null, date: (r.releaseDate ?? r.createdAt).toISOString(), minutes: 0,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return <BlogPageClient items={items} />;
}
