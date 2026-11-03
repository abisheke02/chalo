'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';

import { School, Users, LayoutGrid, Plug } from 'lucide-react';
import { site } from '@/config/site';

import { useEffect, useRef, useState } from 'react';

import { useSiteContent, getContentValue } from './SiteContentProvider';

const statIcons = [School, Users, LayoutGrid, Plug];

const statGradients = [

  'from-[#026dde] to-[#00d4ff]',

  'from-[#f59e0b] to-[#fbbf24]',

  'from-[#10b981] to-[#34d399]',

  'from-[#8b5cf6] to-[#a78bfa]',

];

const statShadows = [

  'shadow-[#026dde]/20',

  'shadow-[#f59e0b]/20',

  'shadow-[#10b981]/20',

  'shadow-[#8b5cf6]/20',

];

const FALLBACK_STATS = [

  { value: '200+', label: 'Schools Served' },

  { value: '1.5+ Million', label: 'Students Impacted' },

  { value: site.modulesCount, label: 'Modules' },

  { value: site.integrationsCount, label: 'Integrations' },

];

function easeOutCubic(t: number) {

  return 1 - Math.pow(1 - t, 3);

}

// Parses a display value like "500+", "2 Lakh+", "10,000+", "99.9%" into a

// leading prefix, an animatable number, and a trailing suffix — then counts

// the number up (rAF, cubic ease-out) when scrolled into view.

function StatValue({ value, className }: { value: string; className?: string }) {

  const ref = useRef<HTMLParagraphElement>(null);

  const inView = useInView(ref, { once: true, margin: '-60px' });

  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);

  const prefix = match ? match[1] : '';

  const numStr = match ? match[2].replace(/,/g, '') : '';

  const suffix = match ? match[3] : '';

  const target = numStr ? parseFloat(numStr) : NaN;

  const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0;

  const [display, setDisplay] = useState(0);

  useEffect(() => {

    if (isNaN(target)) return;

    if (!inView || reduce) {

      setDisplay(target);

      return;

    }

    let raf = 0;

    const start = performance.now();

    const dur = 2000;

    const tick = (now: number) => {

      const t = Math.min((now - start) / dur, 1);

      setDisplay(easeOutCubic(t) * target);

      if (t < 1) raf = requestAnimationFrame(tick);

    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);

  }, [inView, target, reduce]);

  // Non-numeric value (shouldn't happen for these stats) — render as-is.

  if (isNaN(target)) return <p ref={ref} className={className}>{value}</p>;

  const shown =

    decimals > 0

      ? display.toFixed(decimals)

      : Math.round(display).toLocaleString('en-IN');

  return (

    <p ref={ref} className={className}>

      {prefix}{shown}{suffix}

    </p>

  );

}

export default function TrustStats() {

  const { content } = useSiteContent();

  const stats = FALLBACK_STATS.map((s, i) => ({

    value: getContentValue(content, `trust_stat_${i + 1}_value`, s.value),

    label: getContentValue(content, `trust_stat_${i + 1}_label`, s.label),

  }));

  return (

    <section className="py-14 bg-card relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {stats.map((stat, i) => {

            const Icon = statIcons[i];

            return (

              <motion.div

                key={stat.label}

                initial={{ opacity: 0, y: 30, scale: 0.9 }}

                whileInView={{ opacity: 1, y: 0, scale: 1 }}

                viewport={{ once: true }}

                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}

                className="group text-center"

              >

                <div className="relative inline-block mb-4">

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statGradients[i]} flex items-center justify-center shadow-lg ${statShadows[i]}`}>

                    <Icon className="w-6 h-6 text-white" />

                  </div>

                </div>

                <StatValue value={stat.value} className="text-3xl lg:text-4xl font-extrabold text-heading tracking-tight" />

                <p className="text-sm text-subtle font-medium mt-1">{stat.label}</p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>

  );

}

