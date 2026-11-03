import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { roles, getRoleBySlug } from '@/data/site-data';
import { ROLE_CONTENT } from '@/data/role-content';
import { SOLUTION_PAGES } from '@/data/solution-pages';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-url';
import SolutionTemplate from '@/components/SolutionTemplate';

interface PageProps {
  params: Promise<{ role: string }>;
}

export async function generateStaticParams() {
  return roles.map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const data = getRoleBySlug(role);
  if (!data) return { title: 'Solution Not Found' };
  return pageMetadata(`/solutions/role/${role}`);
}

export default async function RoleSolutionPage({ params }: PageProps) {
  const { role } = await params;
  const data = getRoleBySlug(role);
  const page = SOLUTION_PAGES[role];
  if (!data || !page) notFound();

  const extra = ROLE_CONTENT[role];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: SITE_URL },
      { '@type': 'ListItem', position: 3, name: data.roleName, item: `${SITE_URL}/solutions/role/${role}` },
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
      <SolutionTemplate groupLabel="Solutions" eyebrow={`For ${data.roleName}`} title={data.headline} subtitle={data.description} page={page} faqs={extra?.faqs} overview={extra?.intro} faqTitle={`Questions from ${data.roleName.toLowerCase()}`} />
    </>
  );
}
