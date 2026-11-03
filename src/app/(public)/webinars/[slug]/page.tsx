import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
import { Calendar, Clock, ArrowLeft, User, Play } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site-url'
import PageHero from '@/components/PageHero';

interface WebinarPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WebinarPageProps): Promise<Metadata> {
  const { slug } = await params
  const webinar = await db.webinar.findUnique({ where: { slug } })
  if (!webinar) return { title: 'Webinar Not Found' }

  return buildMetadata({
    title: `${webinar.title}`,
    description: webinar.description || webinar.title,
    path: `/webinars/${slug}`,
    ...(webinar.coverImage ? { image: webinar.coverImage } : {}),
  })
}

export default async function WebinarPage({ params }: WebinarPageProps) {
  const { slug } = await params
  const webinar = await db.webinar.findUnique({ where: { slug } })

  if (!webinar || !webinar.published) {
    notFound()
  }

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: webinar.title,
    description: webinar.description || webinar.title,
    image: webinar.coverImage || undefined,
    ...(webinar.date && {
      startDate: webinar.date.toISOString(),
      eventStatus: 'https://schema.org/EventScheduled',
    }),
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: `${SITE_URL}/webinars/${webinar.slug}` },
    organizer: { '@type': 'Organization', name: 'ChaloSchools', url: SITE_URL },
    ...(webinar.speaker && {
      performer: { '@type': 'Person', name: webinar.speaker, jobTitle: webinar.speakerTitle || undefined },
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Webinars', item: `${SITE_URL}/webinars` },
      { '@type': 'ListItem', position: 3, name: webinar.title, item: `${SITE_URL}/webinars/${webinar.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-card">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventJsonLd) }} />
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
                <BreadcrumbLink href="/webinars">Webinars</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{webinar.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <PageHero
        eyebrow="Webinar"
        title={webinar.title}
        subtitle={webinar.description ?? undefined}
        scene="student"
        features={[{ name: 'Expert Speakers', line: 'Educators and EdTech leaders.' }, { name: 'Recorded Sessions', line: 'Watch past webinars at any time.' }, { name: 'Find a Topic', line: 'Search by subject or speaker.' }]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link href="/webinars">
          <Button variant="ghost" className="mb-8 gap-2 text-subtle hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Webinars
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-subtle">
            {webinar.speaker && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {webinar.speaker}
                {webinar.speakerTitle && <span className="text-gray-300">— {webinar.speakerTitle}</span>}
              </span>
            )}
            {webinar.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {format(new Date(webinar.date), 'MMMM d, yyyy')}
              </span>
            )}
            {webinar.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {webinar.duration}
              </span>
            )}
          </div>
        </header>

        {/* Speaker Card */}
        {webinar.speaker && (
          <Card className="mb-8 border-[#026dde]/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#026dde]/10 to-[#010b2a]/10 flex items-center justify-center shrink-0 overflow-hidden">
                {webinar.speakerImage ? (
                  <img src={webinar.speakerImage} alt={webinar.speaker} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-primary/40" />
                )}
              </div>
              <div>
                <p className="font-semibold text-heading">{webinar.speaker}</p>
                {webinar.speakerTitle && <p className="text-sm text-subtle">{webinar.speakerTitle}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Embed */}
        {webinar.videoUrl ? (
          <div className="mb-10 rounded-xl overflow-hidden shadow-sm aspect-video bg-gray-900">
            <iframe
              src={webinar.videoUrl}
              title={webinar.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : webinar.coverImage ? (
          <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
            <img src={webinar.coverImage} alt={webinar.title} className="w-full h-auto" />
          </div>
        ) : (
          <div className="mb-10 rounded-xl bg-gradient-to-br from-[#026dde]/10 to-[#010b2a]/10 h-64 flex items-center justify-center">
            <Play className="w-16 h-16 text-primary/30" />
          </div>
        )}

        <Separator className="mb-10" />

        {/* Content */}
        {webinar.content && (
          <div className="prose prose-lg max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-a:text-primary prose-strong:text-heading">
            <ReactMarkdown>{webinar.content}</ReactMarkdown>
          </div>
        )}

        {/* CTA */}
        <Separator className="my-10" />
        <div className="bg-brand-gradient rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Don&apos;t miss our next webinar</h3>
          <p className="text-white/70 mb-6">
            Register now to stay ahead with the latest in school management.
          </p>
          <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
            Register for Next Webinar
          </Button>
        </div>
      </article>
    </div>
  )
}
