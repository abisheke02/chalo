'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

import PageHero from '@/components/PageHero'

interface NewsEvent {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string
  eventDate: string | null
  location: string | null
  coverImage: string | null
  published: boolean
  createdAt: string
}

export default function NewsPageClient({ initialNewsEvents }: { initialNewsEvents: NewsEvent[] }) {
  const [newsEvents] = useState<NewsEvent[]>(initialNewsEvents)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...new Set(newsEvents.map((n) => n.category))]
  const filtered = activeCategory === 'All'
    ? newsEvents
    : newsEvents.filter((n) => n.category === activeCategory)

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <PageHero
        scene="library"
        eyebrow="News"
        title="News and Announcements"
        subtitle="Company updates, announcements and events."
        features={[{ name: 'Announcements', line: 'Official company updates.' }, { name: 'Archive', line: 'Every update in one place.' }, { name: 'Events', line: 'Upcoming dates and sessions.' }]}
      />

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-card rounded-xl shadow-lg border p-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#026dde] text-white'
                  : 'bg-muted text-body hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-subtle">No news or events found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#026dde]/10 to-[#010b2a]/10 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary/20">N</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className={
                        item.category === 'Event'
                          ? 'bg-[#f59e0b] text-white hover:bg-[#f59e0b] border-none'
                          : 'bg-[#026dde] text-white hover:bg-[#026dde] border-none'
                      }>
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-subtle line-clamp-2 flex-1">
                      {item.excerpt || 'Read more about this...'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-subtle">
                        {item.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{' '}
                            {format(new Date(item.eventDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}