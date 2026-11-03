import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { MapPin, Building2, ArrowLeft, Award } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site-url'
import PageHero from '@/components/PageHero';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const cs = await db.caseStudy.findUnique({ where: { slug } })
  if (!cs) return { title: 'Case Study Not Found' }

  return buildMetadata({
    title: `${cs.title}`,
    description: cs.excerpt || cs.title,
    path: `/case-studies/${slug}`,
    ...(cs.coverImage ? { image: cs.coverImage } : {}),
  })
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const cs = await db.caseStudy.findUnique({ where: { slug } })

  if (!cs || !cs.published) {
    notFound()
  }

  let parsedStats: Record<string, string> = {}
  try {
    parsedStats = cs.stats ? JSON.parse(cs.stats) : {}
  } catch {
    parsedStats = {}
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.excerpt || cs.title,
    image: cs.coverImage || undefined,
    about: cs.schoolName || undefined,
    author: { '@type': 'Organization', name: 'ChaloSchools' },
    publisher: {
      '@type': 'Organization',
      name: 'ChaloSchools',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    datePublished: cs.createdAt.toISOString(),
    dateModified: cs.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/case-studies/${cs.slug}` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-studies` },
      { '@type': 'ListItem', position: 3, name: cs.title, item: `${SITE_URL}/case-studies/${cs.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-card">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-surface-2 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/case-studies">Case Studies</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{cs.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <PageHero
        eyebrow={cs.board ?? 'Case Study'}
        title={cs.title}
        subtitle={cs.excerpt ?? undefined}
        scene="exams"
        features={[{ name: 'Measurable Outcomes', line: 'Results tracked before and after.' }, { name: 'Documented Results', line: 'Each study written up in full.' }, { name: 'Faster Operations', line: 'Time saved across administration.' }]}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link href="/case-studies">
          <Button variant="ghost" className="mb-8 gap-2 text-subtle hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {cs.board && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary border-none">
                {cs.board}
              </Badge>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {cs.coverImage && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
            <img src={cs.coverImage} alt={cs.title} className="w-full h-auto" />
          </div>
        )}

        {/* Layout with sidebar */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Content */}
          <div>
            {/* Stats */}
            {Object.keys(parsedStats).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                {Object.entries(parsedStats).map(([key, value]) => (
                  <Card key={key} className="border-[#026dde]/10 bg-[#026dde]/5">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{value}</p>
                      <p className="text-xs text-subtle mt-1">{key}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Separator className="mb-10" />

            {/* Content */}
            {cs.content && (
              <div className="prose prose-lg max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-a:text-primary prose-strong:text-heading">
                <ReactMarkdown>{cs.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <Card className="border-[#010b2a]/10">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-subtle mb-4">
                  School Information
                </h3>
                {cs.schoolName && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-subtle">School</p>
                      <p className="text-sm font-medium text-heading">{cs.schoolName}</p>
                    </div>
                  </div>
                )}
                {cs.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-subtle">Location</p>
                      <p className="text-sm font-medium text-heading">{cs.location}</p>
                    </div>
                  </div>
                )}
                {cs.board && (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-subtle">Board</p>
                      <p className="text-sm font-medium text-heading">{cs.board}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="mt-4 bg-brand-gradient border-none">
              <CardContent className="p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">
                  Transform Your School
                </h4>
                <p className="text-sm text-white/70 mb-4">
                  Join hundreds of schools using ChaloSchools.
                </p>
                <Button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full shadow-lg">
                  Book a Demo
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>
    </div>
  )
}
