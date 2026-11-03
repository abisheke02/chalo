import { Metadata } from 'next';
import ReleaseNotesPageClient from './ReleaseNotesPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/release-notes');
}

export default async function ReleaseNotesPage() {
  const releases = await db.releaseNote.findMany({
    where: { published: true },
    orderBy: { releaseDate: 'desc' },
  });

  return <ReleaseNotesPageClient initialReleases={JSON.parse(JSON.stringify(releases))} />;
}
