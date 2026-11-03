'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, MapPin } from 'lucide-react';

// Brand gradient palette used site-wide, cycled by index so icon boxes look
// consistent with the rest of the site.
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

interface CaseStudyStat { label: string; value: string }

interface CaseStudyCard {
  slug: string;
  title: string;
  excerpt: string | null;
  schoolName: string | null;
  location: string | null;
  board: string | null;
  stats: CaseStudyStat[];
}

export default function CaseStudySnapshot({ caseStudy }: { caseStudy?: CaseStudyCard | null }) {
  // No published case study yet → hide the section entirely rather than
  // showing placeholder/fabricated metrics.
  if (!caseStudy) return null;

  const stats = Array.isArray(caseStudy.stats) ? caseStudy.stats.slice(0, 3) : [];

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">Success Story</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading leading-tight mb-4">
              {caseStudy.title}
            </h2>
            {(caseStudy.schoolName || caseStudy.location || caseStudy.board) && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-subtle mb-4">
                {caseStudy.schoolName && <span className="font-semibold text-body">{caseStudy.schoolName}</span>}
                {caseStudy.board && <span className="px-2 py-0.5 rounded-full bg-muted">{caseStudy.board}</span>}
                {caseStudy.location && (
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{caseStudy.location}</span>
                )}
              </div>
            )}
            {caseStudy.excerpt && (
              <p className="text-lg text-body leading-relaxed mb-8">{caseStudy.excerpt}</p>
            )}
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold">
              <Link href={`/case-studies/${caseStudy.slug}`}>
                Read Full Case Study <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Right: stat callouts */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {stats.map((stat, i) => {
                const gradient = GRADIENTS[i % GRADIENTS.length];
                const shadow = SHADOWS[i % SHADOWS.length];
                return (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-surface-2 p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg ${shadow} text-white`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-heading">{stat.value}</p>
                    <p className="text-sm text-subtle">{stat.label}</p>
                  </div>
                </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
