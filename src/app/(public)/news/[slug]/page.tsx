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
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site-url'
import PageHero from '@/components/PageHero';

interface NewsPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await db.newsEvent.findUnique({ where: { slug } })
  if (!item) return { title: 'News Not Found' }

  return buildMetadata({
    title: `${item.title}`,
    description: item.excerpt || item.content?.substring(0, 160) || item.title,
    path: `/news/${slug}`,
    ...(item.coverImage ? { image: item.coverImage } : {}),
  })
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params
  const item = await db.newsEvent.findUnique({ where: { slug } })

  if (!item || !item.published) {
    notFound()
  }

  // Fetch related articles (same category, exclude current)
  const related = await db.newsEvent.findMany({
    where: {
      published: true,
      category: item.category,
      NOT: { id: item.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || item.title,
    image: item.coverImage || undefined,
    author: { '@type': 'Organization', name: 'ChaloSchools' },
    publisher: {
      '@type': 'Organization',
      name: 'ChaloSchools',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    datePublished: item.createdAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/news/${item.slug}` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'News & Events', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: item.title, item: `${SITE_URL}/news/${item.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-card">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-surface-2 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/news">News &amp; Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <PageHero
        eyebrow={item.category}
        title={item.title}
        subtitle={item.excerpt ?? undefined}
        scene="library"
        features={[{ name: 'Announcements', line: 'Official company updates.' }, { name: 'Archive', line: 'Every update in one place.' }, { name: 'Events', line: 'Upcoming dates and sessions.' }]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link href="/news">
          <Button variant="ghost" className="mb-8 gap-2 text-subtle hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={
              item.category === 'Event'
                ? 'bg-[#f59e0b] text-white hover:bg-[#f59e0b] border-none'
                : 'bg-[#026dde] text-white hover:bg-[#026dde] border-none'
            }>
              {item.category}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-subtle">
            {item.eventDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{' '}
                {format(new Date(item.eventDate), 'MMMM d, yyyy')}
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {item.location}
              </span>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {item.coverImage && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
            <img src={item.coverImage} alt={item.title} className="w-full h-auto" />
          </div>
        )}

        <Separator className="mb-10" />

        {/* Content */}
        {item.content && (
          <div className="prose prose-lg max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-a:text-primary prose-strong:text-heading">
            <ReactMarkdown>{item.content}</ReactMarkdown>
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <>
            <Separator className="my-10" />
            <section>
              <h3 className="text-xl font-bold text-heading mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/news/${rel.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {rel.category}
                        </Badge>
                        <h4 className="text-sm font-semibold text-heading line-clamp-2 group-hover:text-primary">
                          {rel.title}
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <Separator className="my-10" />
        <div className="bg-brand-gradient rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Stay in the loop</h3>
          <p className="text-white/70 mb-6">
            Get the latest updates from ChaloSchools delivered to your inbox.
          </p>
          <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
            Subscribe to Updates
          </Button>
        </div>
      </article>
    </div>
  )
}
