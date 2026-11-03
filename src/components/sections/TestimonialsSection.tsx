'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquareText, BadgeCheck, MapPin } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  school: string | null;
  content: string;
  rating: number;
}

function getInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('');
  return initials || '?';
}

/** Split "Air Force School, Chennai" into { schoolName, location }. */
function parseSchool(school: string | null): { schoolName: string | null; location: string | null } {
  if (!school) return { schoolName: null, location: null };
  const parts = school.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { schoolName: parts.slice(0, -1).join(', '), location: parts[parts.length - 1] };
  }
  return { schoolName: school, location: null };
}

/**
 * Highlight key achievement phrases (percentages, numbers, and impact words)
 * by wrapping them in a bold, colored span. Keeps the review easy to scan.
 */
function highlightContent(text: string): React.ReactNode[] {
  // Matches: 70%, 2,500, 3 years, and impact keywords
  const pattern = /(\d[\d,.]*%?(?:\s?(?:years?|hours?|months?|schools?|students?))?|\bautomated\b|\binstant(?:ly)?\b|\bseamless(?:ly)?\b|\bsecure\b|\bend-to-end\b)/gi;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <span key={`hl-${key++}`} className="font-semibold text-primary">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

const AVATAR_GRADIENTS = [
  'from-[#026dde] to-[#024fb3]',
  'from-[#f59e0b] to-[#d97706]',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-rose-500 to-rose-600',
];

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto mb-12">
      <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">Testimonials</Badge>
      <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">What Our School Leaders Say</h2>
      <p className="text-lg text-body">Trusted by principals, correspondents, and school owners across India.</p>
    </motion.div>
  );
}

export default function TestimonialsSection({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-[#f7faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <div className="text-center py-12">
            <MessageSquareText className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="text-lg text-subtle font-medium">Testimonials Coming Soon</p>
            <p className="text-sm text-subtle mt-1">We&apos;re collecting feedback from our school partners. Check back soon.</p>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate the list so the marquee loop is seamless (translateX(-50%) lines
  // the second copy up exactly where the first one ends).
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-[#f7faff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full">
        {/* Edge fade masks so cards scroll in/out smoothly rather than clipping */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-slow flex items-stretch gap-6 w-max px-4 sm:px-6 lg:px-8">
          {doubledTestimonials.map((t, i) => {
            const { schoolName, location } = parseSchool(t.school);
            const gradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

            return (
              <div key={`${t.id}-${i}`} className="w-[340px] sm:w-[380px] shrink-0">
                <Card className="group card-shine relative h-full flex flex-col rounded-[20px] border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#026dde]/10 hover:border-[#026dde]/30">
                  {/* Large decorative quote mark */}
                  <Quote className="absolute -top-2 right-4 w-24 h-24 text-primary/[0.06] group-hover:text-primary/10 fill-current transition-colors duration-300 pointer-events-none" />

                  <CardContent className="relative p-5 flex flex-col flex-1">
                    {/* Rating + Verified badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < t.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Verified Customer
                      </span>
                    </div>

                    {/* Review body — clamped to a fixed line count so every card's content area is the same size regardless of quote length */}
                    <p className="text-[13px] text-body leading-relaxed line-clamp-5">
                      &ldquo;{highlightContent(t.content)}&rdquo;
                    </p>

                    <div className="flex-1" />

                    {/* Divider */}
                    <div className="h-px bg-border my-3" />

                    {/* Reviewer profile */}
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {getInitials(t.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-heading truncate">{t.name}</p>
                        {t.role && <p className="text-[11px] text-subtle">{t.role}</p>}
                        {schoolName && <p className="text-[11px] font-medium text-primary truncate">{schoolName}</p>}
                        {location && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-subtle bg-muted border border-border px-2 py-0.5 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {location}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
