import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next';

import Link from 'next/link';

import { notFound } from 'next/navigation';

import { features, getFeatureBySlug } from '@/data/site-data';
import FAQStructuredData from '@/components/FAQStructuredData';
import RelatedModules from '@/components/RelatedModules';
import ModuleDeepSections, { ContinueTo } from '@/components/ModuleDeepSections';
import { MODULE_CONTENT } from '@/data/module-content';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import {

  CheckCircle2, ArrowRight, MonitorPlay, AlertCircle, HelpCircle,

} from 'lucide-react';

import { pageMetadata } from '@/lib/seo';

import { SITE_URL } from '@/lib/site-url';

import PageHero from '@/components/PageHero';
import { moduleIdForFeatureSlug } from '@/lib/module-links';

// Brand gradient palette used site-wide, cycled by index so grids of icons
// (Key Benefits, the features checklist) show real color variety instead of
// repeating a single feature-accent color for every item.
const GRADIENTS = [
  'from-[#026dde] to-[#00d4ff]',
  'from-[#f59e0b] to-[#fbbf24]',
  'from-[#10b981] to-[#34d399]',
  'from-[#8b5cf6] to-[#a78bfa]',
  'from-[#0891b2] to-[#22d3ee]',
  'from-[#e11d48] to-[#f87171]',
];

const SHADOWS = [
  'shadow-[#026dde]/20',
  'shadow-[#f59e0b]/20',
  'shadow-[#10b981]/20',
  'shadow-[#8b5cf6]/20',
  'shadow-[#0891b2]/20',
  'shadow-[#e11d48]/20',
];

interface PageProps {

  params: Promise<{ slug: string }>;

}

export async function generateStaticParams() {

  return features.map((f) => ({ slug: f.slug }));

}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { slug } = await params;

  const feature = getFeatureBySlug(slug);

  if (!feature) return { title: 'Feature Not Found' };

  return pageMetadata(`/features/${slug}`);

}

export default async function FeatureDetailPage({ params }: PageProps) {

  const { slug } = await params;

  const feature = getFeatureBySlug(slug);
  const moduleId = moduleIdForFeatureSlug(slug);
  const content = MODULE_CONTENT[slug];

  if (!feature) notFound();

  const Icon = feature.icon;

  const breadcrumbJsonLd = {

    '@context': 'https://schema.org',

    '@type': 'BreadcrumbList',

    itemListElement: [

      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },

      { '@type': 'ListItem', position: 2, name: 'Modules', item: `${SITE_URL}/product` },

      { '@type': 'ListItem', position: 3, name: feature.title, item: `${SITE_URL}/features/${slug}` },

    ],

  };

  return (

    <>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <FAQStructuredData faqs={(feature.faqs ?? []).map((f, i) => ({ id: `${feature.slug}-${i}`, question: f.q, answer: f.a, category: feature.title }))} />

      {/* Hero Section */}

      <PageHero
        scene={moduleId}
        eyebrow={feature.shortTitle}
        title={feature.headline}
        subtitle={feature.description}
        moduleId={moduleId}
      />

      {content && <ModuleDeepSections content={content} shortTitle={feature.shortTitle} />}

      {/* Problem Statement */}

      {!content && feature.problems && feature.problems.length > 0 && (

        <section className="py-16 md:py-20 bg-surface-2">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-10">

              <Badge variant="secondary" className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">

                <AlertCircle className="w-4 h-4 mr-2" />

                The Problem

              </Badge>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading">

                Sound Familiar?

              </h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {feature.problems.map((problem, i) => (

                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">

                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">

                    <AlertCircle className="w-4 h-4 text-red-500" />

                  </div>

                  <p className="text-sm text-body leading-relaxed">{problem}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

      )}

      {!content && (<>

      {/* Benefits Grid */}

      <section className="py-12 md:py-16 bg-card">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12 md:mb-16">

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">

              Key Benefits

            </h2>

            <p className="text-subtle text-lg max-w-2xl mx-auto">

              Discover how {feature.shortTitle.toLowerCase()} transforms school operations and saves valuable time.

            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {feature.benefits.map((benefit, index) => (

              <Card

                key={index}

                className="group card-lift card-shine border border-border hover:border-[#026dde]/30 transition-all duration-300"

              >

                <CardContent className="pt-6">

                  <div

                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center mb-4 shadow-lg ${SHADOWS[index % SHADOWS.length]} text-white group-hover:scale-110 transition-transform duration-300`}

                  >

                    <CheckCircle2 className="w-5 h-5" />

                  </div>

                  <p className="text-heading font-medium leading-relaxed">{benefit}</p>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* Features List */}

      <section className="py-12 md:py-16 bg-surface-2">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-6">

                Everything You Need, Built In

              </h2>

              <p className="text-subtle text-lg mb-8 leading-relaxed">

                Our {feature.shortTitle.toLowerCase()} module comes packed with powerful capabilities designed for Indian schools.

              </p>

              <ul className="space-y-4">

                {feature.features.map((f, index) => (

                  <li key={index} className="flex items-start gap-3">

                    <div

                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center mt-0.5 shrink-0 shadow-sm ${SHADOWS[index % SHADOWS.length]}`}

                    >

                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />

                    </div>

                    <span className="text-heading font-medium">{f}</span>

                  </li>

                ))}

              </ul>

            </div>

            <div className="relative">

              <div

                className="w-full aspect-square max-w-md mx-auto rounded-2xl flex items-center justify-center"

                style={{ backgroundColor: `${feature.color}08` }}

              >

                <div

                  className="w-3/4 h-3/4 rounded-2xl flex items-center justify-center"

                  style={{ backgroundColor: `${feature.color}12` }}

                >

                  <Icon className="w-24 h-24 md:w-32 md:h-32" style={{ color: feature.color }} />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      </>)}

      {/* FAQ */}

      {feature.faqs && feature.faqs.length > 0 && (

        <section className="py-16 md:py-20 bg-surface-2">

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-10">

              <Badge variant="secondary" className="mb-3 bg-[#026dde]/10 text-primary border-[#026dde]/20">

                <HelpCircle className="w-4 h-4 mr-2" />

                FAQ

              </Badge>

              <h2 className="text-2xl md:text-3xl font-bold text-heading">

                Questions About {feature.shortTitle}?

              </h2>

            </div>

            <div className="space-y-4">

              {feature.faqs.map((faq, i) => (

                <details key={i} className="group bg-card rounded-xl border border-border p-5 open:shadow-sm">

                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">

                    <h3 className="text-base font-semibold text-heading">{faq.q}</h3>

                    <ArrowRight className="w-4 h-4 shrink-0 text-primary transition-transform group-open:rotate-90" />

                  </summary>

                  <p className="text-sm text-subtle leading-relaxed mt-3">{faq.a}</p>

                </details>

              ))}

            </div>

          </div>

        </section>

      )}

      {content && <ContinueTo labels={content.next} />}

      <RelatedModules slug={slug} />

      {/* CTA Section */}

      <section className="py-12 md:py-16 bg-card">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">

            Ready to Experience {feature.shortTitle}?

          </h2>

          <p className="text-subtle text-lg mb-8 max-w-2xl mx-auto">

            Book a free demo and see how {feature.shortTitle.toLowerCase()} can transform your school operations.

          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Button

              size="lg"

              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"

              asChild

            >

              <Link href="/contact#contact-form">

                Book a Demo

                <ArrowRight className="w-5 h-5 ml-2" />

              </Link>

            </Button>

            <Button

              variant="outline"

              size="lg"

              className="border-[#026dde] text-primary hover:bg-[#026dde] hover:text-white font-semibold px-8 py-6 text-base rounded-lg transition-all"

              asChild

            >

              <Link href="/solutions/state-cbse">

                <MonitorPlay className="w-5 h-5 mr-2" />

                View Solutions

              </Link>

            </Button>

          </div>

        </div>

      </section>

    </>

  );

}

