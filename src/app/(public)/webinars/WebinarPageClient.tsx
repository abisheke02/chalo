'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Play, User } from 'lucide-react'
import { format, isAfter, parseISO } from 'date-fns'

import PageHero from '@/components/PageHero'

interface Webinar {
  id: string
  title: string
  slug: string
  description: string | null
  speaker: string | null
  speakerTitle: string | null
  speakerImage: string | null
  videoUrl: string | null
  coverImage: string | null
  date: string | null
  duration: string | null
  published: boolean
  createdAt: string
}

function getStatusBadge(dateStr: string | null): { label: string; variant: 'default' | 'secondary' | 'outline' } {
  if (!dateStr) return { label: 'On Demand', variant: 'secondary' }
  const d = parseISO(dateStr)
  const now = new Date()
  if (isAfter(d, now)) return { label: 'Upcoming', variant: 'default' }
  return { label: 'Past', variant: 'outline' }
}

export default function WebinarPageClient({ initialWebinars }: { initialWebinars: Webinar[] }) {
  const webinars = initialWebinars

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <PageHero
        scene="student"
        eyebrow="Webinars"
        title="Learn from Education Experts"
        subtitle="Live and recorded sessions on school management best practice."
        features={[{ name: 'Expert Speakers', line: 'Educators and EdTech leaders.' }, { name: 'Recorded Sessions', line: 'Watch past webinars at any time.' }, { name: 'Find a Topic', line: 'Search by subject or speaker.' }]}
      />

      {/* Webinars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {webinars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-subtle">No webinars available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.map((webinar) => {
              const status = getStatusBadge(webinar.date)
              return (
                <Link key={webinar.id} href={`/webinars/${webinar.slug}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <div className="relative h-48 overflow-hidden">
                      {webinar.coverImage ? (
                        <img
                          src={webinar.coverImage}
                          alt={webinar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#026dde]/10 to-[#010b2a]/10 flex items-center justify-center">
                          <Play className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={status.variant === 'default' ? 'bg-[#f59e0b] text-white hover:bg-[#f59e0b] border-none' : ''}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
                        {webinar.title}
                      </h3>
                      <p className="text-sm text-subtle line-clamp-2 flex-1">
                        {webinar.description || 'Join this webinar to learn more...'}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-subtle">
                          {webinar.speaker && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> {webinar.speaker}
                            </span>
                          )}
                          {webinar.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{' '}
                              {format(new Date(webinar.date), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        {webinar.duration && (
                          <span className="flex items-center gap-1 text-xs text-subtle">
                            <Clock className="w-3 h-3" /> {webinar.duration}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}