'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, ArrowRight } from 'lucide-react'

import PageHero from '@/components/PageHero'

interface CaseStudy {
  id: string
  title: string
  slug: string
  excerpt: string | null
  schoolName: string | null
  location: string | null
  board: string | null
  coverImage: string | null
  stats: string | null
  published: boolean
  createdAt: string
}

export default function CaseStudyPageClient({ initialCaseStudies }: { initialCaseStudies: CaseStudy[] }) {
  const caseStudies = initialCaseStudies

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <PageHero
        scene="exams"
        eyebrow="Case Studies"
        title="Real Schools. Real Results."
        subtitle="How schools use ChaloSchools: the challenge, the solution and the outcome."
        features={[{ name: 'Measurable Outcomes', line: 'Results tracked before and after.' }, { name: 'Documented Results', line: 'Each study written up in full.' }, { name: 'Faster Operations', line: 'Time saved across administration.' }]}
      />

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {caseStudies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-subtle">No case studies available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs) => (
              <Link key={cs.id} href={`/case-studies/${cs.slug}`}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    {cs.coverImage ? (
                      <img
                        src={cs.coverImage}
                        alt={cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#026dde]/10 to-[#010b2a]/10 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    {cs.board && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary border-none">
                          {cs.board}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                    <p className="text-sm text-subtle line-clamp-2 flex-1">
                      {cs.excerpt || 'Discover how this school transformed...'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-subtle">
                        {cs.schoolName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {cs.schoolName}
                          </span>
                        )}
                        {cs.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {cs.location}
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