import { safeJsonLd } from '@/lib/json-ld';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import FAQStructuredData from '@/components/FAQStructuredData';
import { Button } from '@/components/ui/button';
import { features } from '@/data/site-data';
import { tamilNaduFeatures, type RegionData } from '@/data/regions';
import { SITE_URL } from '@/lib/site-url';

const BOARDS = [
  { href: '/solutions/state-cbse', label: 'State Board and CBSE' },
  { href: '/solutions/matric', label: 'Matriculation' },
  { href: '/solutions/ib', label: 'IB' },
  { href: '/solutions/cambridge', label: 'Cambridge' },
  { href: '/solutions/montessori', label: 'Montessori' },
  { href: '/solutions/pre-school', label: 'Pre-School' },
];

// Shared layout for the regional search pages. Server-rendered, with a
// breadcrumb and FAQ schema in the initial HTML.
export default function RegionPage({ region }: { region: RegionData }) {
  const url = `${SITE_URL}/${region.slug}`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: region.metaTitle, item: url },
    ],
  };
  const showTn = region.slug === 'school-erp-tamil-nadu' && tamilNaduFeatures.length > 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />
      <FAQStructuredData faqs={region.faqs.map((f, i) => ({ id: `${region.slug}-${i}`, question: f.q, answer: f.a, category: region.name }))} />

      <PageHero
        scene="campus"
        eyebrow={region.eyebrow}
        title={region.h1}
        subtitle={region.intro}
        actions={
          <>
            <Button asChild size="lg" className="text-white" style={{ backgroundColor: 'var(--brand)' }}>
              <Link href="/contact#contact-form">Book a free demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Link href="/product" className="font-semibold text-heading underline-offset-4 hover:underline">See all modules</Link>
          </>
        }
      />

      <section className="bg-surface-2 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-heading">ChaloSchools in short</h2>
          <ul className="mt-5 space-y-3">
            {region.facts.map((f) => (
              <li key={f} className="flex items-start gap-3 text-body"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-heading md:text-3xl">Why schools in {region.name} choose ChaloSchools</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {region.why.map((w) => (
              <div key={w.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-heading">{w.title}</h3>
                <p className="mt-2 text-sm text-subtle">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showTn && (
        <section className="pb-14">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-heading">Built for Tamil Nadu requirements</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {tamilNaduFeatures.map((t) => (
                <li key={t} className="flex items-start gap-2 text-body"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{t}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-surface-2 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-heading">What you can run on one platform</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {features.map((f) => (
              <Link key={f.slug} href={`/features/${f.slug}`} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-heading transition-colors hover:border-[var(--brand)]">{f.shortTitle || f.title}</Link>
            ))}
          </div>
          <h2 className="mt-10 text-xl font-bold text-heading">Solutions by board</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {BOARDS.map((b) => (
              <Link key={b.href} href={b.href} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-heading transition-colors hover:border-[var(--brand)]">{b.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-heading">Frequently asked questions</h2>
          <dl className="mt-6 space-y-4">
            {region.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <dt className="font-semibold text-heading">{f.q}</dt>
                <dd className="mt-1 text-sm text-subtle">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6 text-white" style={{ backgroundColor: 'var(--brand)' }}>
            <p className="text-lg font-semibold">See ChaloSchools working for your school.</p>
            <Button asChild variant="secondary"><Link href="/contact#contact-form">Book a free demo</Link></Button>
          </div>
          <p className="mt-6 text-sm text-subtle">Also see: <Link href={region.other.href} className="font-medium underline" style={{ color: 'var(--brand)' }}>{region.other.label}</Link></p>
        </div>
      </section>
    </>
  );
}
