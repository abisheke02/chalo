'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Search, BookOpen, FileText, ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { format } from 'date-fns'

import PageHero from '@/components/PageHero'

interface HelpDoc {
  id: string
  title: string
  slug: string
  content: string
  category: string
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function HelpPageClient({ initialDocs }: { initialDocs: HelpDoc[] }) {
  const [docs] = useState<HelpDoc[]>(initialDocs)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<HelpDoc | null>(null)

  // Group by category
  const categories = Array.from(new Set(docs.map((d) => d.category)))

  // Filter by search
  const filteredDocs = searchQuery
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : docs

  const filteredCategories = Array.from(new Set(filteredDocs.map((d) => d.category)))

  const docsByCategory = filteredCategories.map((cat) => ({
    category: cat,
    docs: filteredDocs.filter((d) => d.category === cat),
  }))

  if (selectedDoc) {
    return (
      <div className="min-h-screen bg-card">
        <section className="relative bg-brand-gradient pt-40 pb-12">
          <div className="absolute inset-0 bg-brand-gradient" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              className="mb-4 gap-2 text-white/60 hover:text-white hover:bg-card/10"
              onClick={() => setSelectedDoc(null)}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Help
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#f59e0b] text-white hover:bg-[#f59e0b] border-none">
                {selectedDoc.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedDoc.title}</h1>
            <p className="flex items-center gap-1.5 text-sm text-white/60">
              <Clock className="w-3.5 h-3.5" />
              Last updated {format(new Date(selectedDoc.updatedAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-a:text-primary prose-strong:text-heading"
            dangerouslySetInnerHTML={{ __html: selectedDoc.content.replace(/^(#{1,6})\s/gm, '') }}
          />
          <div className="mt-12 bg-brand-gradient rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
            <p className="text-white/70 mb-6">
              Our support team is here to assist you.
            </p>
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <PageHero
        scene="ai-secretary"
        eyebrow="Help Centre"
        title="How Can We Help?"
        subtitle="Guides, answers and documentation for every module."
        features={[{ name: 'Always Available', line: 'Documentation open around the clock.' }, { name: 'Step-by-Step Guides', line: 'Clear instructions for every module.' }, { name: 'Common Questions', line: 'Quick answers to frequent issues.' }]}
      >
        <div className="mt-8 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle" />
          <Input
            placeholder="Search help articles"
            className="pl-12 h-12 rounded-full bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHero>

      {/* Help Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {docsByCategory.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-subtle">No help docs found.</p>
            {searchQuery && (
              <p className="text-sm text-subtle mt-2">
                Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={filteredCategories} className="space-y-4">
            {docsByCategory.map(({ category, docs: categoryDocs }) => (
              <AccordionItem
                key={category}
                value={category}
                className="border rounded-xl px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-heading hover:no-underline py-5">
                  <span className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {category}
                    <Badge variant="secondary" className="text-xs">{categoryDocs.length}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                    {categoryDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-2 transition-colors text-left group"
                      >
                        <FileText className="w-4 h-4 text-subtle group-hover:text-primary shrink-0" />
                        <span className="text-sm text-heading group-hover:text-primary transition-colors flex-1">
                          {doc.title}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-brand-gradient border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Can&apos;t find what you&apos;re looking for?</h3>
            <p className="text-white/70 mb-6">
              Our support team is ready to help you with any questions.
            </p>
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}