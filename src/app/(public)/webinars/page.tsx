import { Metadata } from 'next';
import WebinarPageClient from './WebinarPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/webinars');
}

export default async function WebinarsPage() {
  const webinars = await db.webinar.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  });

  return <WebinarPageClient initialWebinars={JSON.parse(JSON.stringify(webinars))} />;
}
