import { Metadata } from 'next';
import NewsPageClient from './NewsPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/news');
}

export default async function NewsPage() {
  const newsEvents = await db.newsEvent.findMany({
    where: { published: true },
    orderBy: { eventDate: 'desc' },
  });

  return <NewsPageClient initialNewsEvents={JSON.parse(JSON.stringify(newsEvents))} />;
}
