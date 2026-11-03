import { Metadata } from 'next';
import CaseStudyPageClient from './CaseStudyPageClient';
import { db } from '@/lib/db';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/case-studies');
}

export default async function CaseStudiesPage() {
  const caseStudies = await db.caseStudy.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return <CaseStudyPageClient initialCaseStudies={JSON.parse(JSON.stringify(caseStudies))} />;
}
