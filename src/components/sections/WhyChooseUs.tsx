'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Building2, Layers, ArrowRight } from 'lucide-react';
import { useSiteContent, getContentValue } from './SiteContentProvider';

const ICONS = [LayoutDashboard, Building2, Layers];
const COLORS = [
  'from-[#026dde] to-[#024fb3]',
  'from-[#f59e0b] to-[#d97706]',
  'from-[#026dde] to-[#024fb3]',
];

const FALLBACK_BENEFITS = [
  { title: 'All-in-One Platform', description: 'Every school function managed from a single dashboard.' },
  { title: 'Onboarding and Training', description: 'We handle setup, data migration and staff training.' },
  { title: 'Built for Indian Schools', description: 'Designed around CBSE, State, IB and Cambridge requirements.' },
];

export default function WhyChooseUs() {
  const { content } = useSiteContent();

  const badge = getContentValue(content, 'why_choose_badge', 'Why ChaloSchools');
  const headline = getContentValue(content, 'why_choose_headline', 'Built for Schools That Expect More');
  const subtitle = getContentValue(content, 'why_choose_subtitle', 'What sets us apart from generic ERP software.');

  const benefits = FALLBACK_BENEFITS.map((b, i) => ({
    title: getContentValue(content, `why_choose_${i + 1}_title`, b.title),
    description: getContentValue(content, `why_choose_${i + 1}_desc`, b.description),
  }));

  return (
    <section className="py-12 lg:py-16 bg-surface-2 aurora-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">{badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4"><span className="wow-heading wow-underline">{headline}</span></h2>
          <p className="text-lg text-body">{subtitle}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl border border-border p-6 text-center relative overflow-hidden"
              >
                <div className="relative">
                  <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${COLORS[i]} flex items-center justify-center text-white mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-heading mb-2">{b.title}</h3>
                  <p className="text-sm text-subtle leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Managed IT services now have their own page. */}
        <div className="mt-10 text-center">
          <Link href="/managed-it-services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Also from Inspace: managed IT services for your campus
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
