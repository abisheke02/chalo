'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Database, Clock, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import { moduleHref } from '@/lib/module-links';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// Four distinct pains only — parent communication and data security are
// covered once each, by the WhatsApp card here and by SecurityCompliance.
const PROBLEM_ICON_DATA = [
  { icon: Database, className: 'w-6 h-6' },
  { icon: Clock, className: 'w-6 h-6' },
  { icon: MessageSquare, className: 'w-6 h-6' },
  { icon: BarChart3, className: 'w-6 h-6' },
];

// Each pain links to the module that fixes it, so the card isn't a dead end.
const PROBLEM_FIX = [
  { href: moduleHref('fees'), label: 'Fee Management' },
  { href: moduleHref('attendance'), label: 'Attendance Management' },
  { href: moduleHref('parent-app'), label: 'Parent App' },
  { href: moduleHref('reports'), label: 'Reports & Analytics' },
];

const PROBLEM_GRADIENTS = [
  'from-[#f59e0b] to-[#fbbf24]',
  'from-[#026dde] to-[#00d4ff]',
  'from-[#e11d48] to-[#f87171]',
  'from-[#10b981] to-[#34d399]',
];

const PROBLEM_SHADOWS = [
  'shadow-[#f59e0b]/20',
  'shadow-[#026dde]/20',
  'shadow-[#e11d48]/20',
  'shadow-[#10b981]/20',
];

const FALLBACK_PROBLEMS = [
  { title: 'Manual Fee Follow-ups', description: 'Reminders are tracked by hand and collections fall behind.' },
  { title: 'Scattered Records', description: 'Attendance and marks sit in registers and spreadsheets.' },
  { title: 'Fragmented Communication', description: 'Important updates are lost across dozens of WhatsApp groups.' },
  { title: 'No Management Overview', description: 'Leadership lacks a real-time view of admissions, finance and academics.' },
];

export default function ProblemsSection() {
  const { content } = useSiteContent();

  const badge = getContentValue(content, 'problems_badge', 'The Challenge');
  const headline = getContentValue(content, 'problems_headline', 'Manual Processes Hold Schools Back');
  const subtitle = getContentValue(content, 'problems_subtitle', 'Four common problems, each solved by a dedicated module.');

  const problems = FALLBACK_PROBLEMS.map((p, i) => {
    const IconComp = PROBLEM_ICON_DATA[i].icon;
    return {
      icon: <IconComp className={PROBLEM_ICON_DATA[i].className} />,
      title: getContentValue(content, `problem_${i + 1}_title`, p.title),
      description: getContentValue(content, `problem_${i + 1}_desc`, p.description),
      gradient: PROBLEM_GRADIENTS[i],
      shadow: PROBLEM_SHADOWS[i],
      fix: PROBLEM_FIX[i],
    };
  });

  return (
    <section className="py-12 lg:py-16 bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">{badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">{headline}</h2>
          <p className="text-lg text-body">{subtitle}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={p.fix.href}
              className="flex flex-col h-full bg-card rounded-xl border border-border p-6 hover:shadow-xl hover:shadow-[#026dde]/5 hover:border-[#026dde]/20 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#026dde]/0 to-transparent group-hover:from-[#026dde]/3 transition-all duration-300 rounded-xl" />
              <div className="relative flex flex-col flex-1">
                <div className="relative inline-block mb-4 self-start">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg ${p.shadow} text-white group-hover:scale-110 transition-transform duration-300`}>{p.icon}</div>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${p.gradient} opacity-0 group-hover:opacity-20 scale-125 blur-md transition-all duration-300`} />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{p.title}</h3>
                <p className="text-sm text-subtle leading-relaxed">{p.description}</p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Solved by {p.fix.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}