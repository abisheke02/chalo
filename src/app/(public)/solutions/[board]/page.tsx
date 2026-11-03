import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { solutions, getSolutionBySlug } from '@/data/site-data';
import { BOARD_CONTENT } from '@/data/board-content';
import { SOLUTION_PAGES } from '@/data/solution-pages';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-url';
import SolutionTemplate from '@/components/SolutionTemplate';

interface PageProps {
  params: Promise<{ board: string }>;
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ board: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { board } = await params;
  const solution = getSolutionBySlug(board);
  if (!solution) return { title: 'Solution Not Found' };
  return pageMetadata(`/solutions/${board}`);
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { board } = await params;
  const solution = getSolutionBySlug(board);
  const page = SOLUTION_PAGES[board];
  if (!solution || !page) notFound();

  const extra = BOARD_CONTENT[board];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: SITE_URL },
      { '@type': 'ListItem', position: 3, name: solution.boardName, item: `${SITE_URL}/solutions/${board}` },
    ],
  };
  const faqJsonLd = extra && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extra.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />}
      <SolutionTemplate groupLabel="Solutions" eyebrow={solution.boardName} title={solution.headline} subtitle={solution.description} page={page} faqs={extra?.faqs} overview={extra?.intro} faqTitle={`Questions from ${solution.boardName} schools`} />
    </>
  );
}
