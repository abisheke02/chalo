'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import IntegrationsStrip from './IntegrationsStrip';
import AreaWheel from './AreaWheel';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// The homepage module section: the six areas a school runs as a wheel, with every module linked beside it. The
// heading and subtitle are still editable in Admin > Site Content, and the
// whole section still switches on and off in Admin > Section Visibility.
export default function ModuleCarouselSection({ showIntegrations = true }: { showIntegrations?: boolean }) {
  const { content } = useSiteContent();

  const badge = getContentValue(content, 'features_badge', 'Modules');
  const headline = getContentValue(content, 'features_headline', '14 Modules. One Platform.');
  const subtitle = getContentValue(content, 'features_subtitle', 'Eight core modules and six add-ons, fully integrated from day one.');

  return (
    <section id="features" className="relative overflow-hidden bg-gradient-to-b from-background to-surface-2 py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-8 max-w-3xl text-center">
          <Badge className="mb-4 rounded-full border-primary/20 bg-primary/10 text-primary">{badge}</Badge>
          <h2 className="mb-4 text-3xl font-bold text-heading lg:text-4xl">{headline}</h2>
          <p className="text-lg text-body">{subtitle}</p>
        </motion.div>

        {/* Everything the school runs, grouped by what a school is trying to do: a wheel of six areas,
            with every module linked in the text beside it. */}
        <AreaWheel />
        <p className="mt-6 text-center text-sm text-subtle">Reports &amp; Analytics and the Parent, Teacher and Management apps are included with every plan.</p>

        {showIntegrations && <IntegrationsStrip />}
      </div>
    </section>
  );
}
