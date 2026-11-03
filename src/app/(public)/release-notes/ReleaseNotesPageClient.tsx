'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Tag, Sparkles, Bug, Zap } from 'lucide-react'
import { format } from 'date-fns'

import PageHero from '@/components/PageHero'

interface ReleaseNote {
  id: string
  title: string
  slug: string
  version: string
  content: string
  releaseDate: string | null
  type: string
  published: boolean
  createdAt: string
}

function getTypeConfig(type: string) {
  switch (type) {
    case 'Feature':
      return { icon: Sparkles, color: 'bg-[#026dde] text-white hover:bg-[#026dde] border-none' }
    case 'Bug Fix':
      return { icon: Bug, color: 'bg-red-500 text-white hover:bg-red-500 border-none' }
    case 'Improvement':
      return { icon: Zap, color: 'bg-[#f59e0b] text-white hover:bg-[#f59e0b] border-none' }
    default:
      return { icon: Tag, color: 'bg-gray-500 text-white hover:bg-gray-500 border-none' }
  }
}

export default function ReleaseNotesPageClient({ initialReleases }: { initialReleases: ReleaseNote[] }) {
  const releases = initialReleases

  // Group by month/year
  const grouped = releases.reduce<Record<string, ReleaseNote[]>>((acc, release) => {
    const date = release.releaseDate ? new Date(release.releaseDate) : new Date(release.createdAt)
    const key = format(date, 'MMMM yyyy')
    if (!acc[key]) acc[key] = []
    acc[key].push(release)
    return acc
  }, {})

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    // Sort by most recent first
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <PageHero
        scene="timetable"
        eyebrow="Release Notes"
        title="What's New in ChaloSchools"
        subtitle="Product updates, new features and improvements."
        features={[{ name: 'Regular Releases', line: 'New features every cycle.' }, { name: 'Scheduled Updates', line: 'Delivered without downtime.' }, { name: 'Improvements', line: 'Fixes and refinements in every release.' }]}
      />

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {releases.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-subtle">No release notes yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-muted hidden sm:block" />

            <div className="space-y-12">
              {sortedGroups.map(([monthYear, notes]) => (
                <div key={monthYear}>
                  {/* Month/Year header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#026dde] flex items-center justify-center shrink-0 hidden sm:flex">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-heading">{monthYear}</h2>
                  </div>

                  {/* Release items */}
                  <div className="space-y-4 sm:pl-14">
                    {notes.map((note) => {
                      const typeConfig = getTypeConfig(note.type)
                      const TypeIcon = typeConfig.icon
                      return (
                        <Card key={note.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <Badge className={typeConfig.color}>
                                <TypeIcon className="w-3 h-3" />
                                {note.type}
                              </Badge>
                              <Badge variant="outline" className="font-mono text-xs">
                                v{note.version}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-heading mb-2">
                              {note.title}
                            </h3>
                            <div
                              className="text-sm text-body leading-relaxed prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            {note.releaseDate && (
                              <div className="mt-4 pt-3 border-t border-border">
                                <p className="text-xs text-subtle flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />{' '}
                                  Released on {format(new Date(note.releaseDate), 'MMMM d, yyyy')}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-brand-gradient border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Never miss an update</h3>
            <p className="text-white/70 mb-6">
              Stay ahead with the latest ChaloSchools features and improvements.
            </p>
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
              Subscribe to Updates
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}