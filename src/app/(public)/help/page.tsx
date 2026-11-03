import { Metadata } from 'next';
import HelpPageClient from './HelpPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/help');
}

export default async function HelpPage() {
  const docs = await db.helpDoc.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  return <HelpPageClient initialDocs={JSON.parse(JSON.stringify(docs))} />;
}
