'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MODULES } from '@/data/module-features';
import { moduleDetailHref, moduleHref } from '@/lib/module-links';
import { ACCENTS, ICONS } from '@/components/preview/ModuleCarousel';

// Horizontal scroll: a tall section holds a sticky, full-height stage, and the
// vertical scroll position slides a row of the fourteen modules sideways.

const IDS = Object.keys(ICONS);
const CARD_W = 300;
const GAP = 24;
const PAD = 48;

// `directToPages` sends each card to the module's own page when it has one (the homepage does this);
// otherwise cards open the module's panel on the Product page.
export default function HorizontalModules({ eyebrow = 'The platform', title = 'Fourteen modules. One platform.', directToPages = false }: { eyebrow?: string; title?: string; directToPages?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [vh, setVh] = useState(0);
  const [current, setCurrent] = useState(1);

  const items = IDS.map((id, i) => {
    const m = MODULES.find((x) => x.id === id);
    return { id, n: i + 1, title: m?.title ?? id, features: m?.features ?? [], accent: ACCENTS[i % ACCENTS.length], Icon: ICONS[id], href: directToPages ? (moduleDetailHref(id) ?? moduleHref(id)) : moduleHref(id) };
  });

  // Distance the row travels: its width minus what the screen already shows.
  useEffect(() => {
    const measure = () => {
      const track = items.length * CARD_W + (items.length - 1) * GAP + PAD * 2;
      setDist(Math.max(0, track - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setCurrent(Math.min(items.length, Math.max(1, Math.round(p * (items.length - 1)) + 1)));
  });

  const header = (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--brand)' }}>{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-extrabold text-heading sm:text-4xl">{title}</h2>
    </div>
  );

  const cards = items.map(({ id, n, title, features, accent, Icon, href }) => (
    <Link
      key={id}
      href={href}
      style={{ width: CARD_W, background: `linear-gradient(165deg, ${accent} 0%, #0b1f3a 100%)` }}
      className="group relative flex h-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-[0_24px_50px_-24px_rgba(11,31,58,0.7)] transition-transform duration-300 ease-out hover:-translate-y-2"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/25">
          <Icon className="h-6 w-6" />
        </span>
        <span className="font-mono text-sm text-white/70">{String(n).padStart(2, '0')}</span>
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>
        <ul className="mt-3 space-y-1 text-sm text-white/75">
          {features.slice(0, 3).map((f) => (
            <li key={f.name} className="truncate">{f.name}</li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold">
          Open module <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  ));

  // Reduced motion: a plain row the visitor scrolls themselves.
  if (reduce) {
    return (
      <section className="py-12">
        {header}
        <div className="mt-8 flex gap-6 overflow-x-auto px-4 pb-4 sm:px-6">{cards}</div>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: dist + (vh || 800) }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden pt-16">
        {header}
        <motion.div style={{ x, paddingLeft: PAD, paddingRight: PAD }} className="flex w-max gap-6 will-change-transform">
          {cards}
        </motion.div>
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
          <span className="font-mono text-sm font-semibold text-heading">
            {String(current).padStart(2, '0')} / {items.length}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <motion.div style={{ scaleX: scrollYProgress, originX: 0, backgroundColor: 'var(--brand)' }} className="h-full w-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
