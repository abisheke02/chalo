'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type Service = { id: string; n: string; title: string; paras: string[]; points?: string[]; link: string; href: string; pill: string; img: string; alt: string };

const SERVICES: Service[] = [
  {
    id: 'web', n: '01', title: 'Web Development', pill: '#CFE8EE', img: '/images/services-preview/web.svg',
    alt: 'Illustration of a browser window showing a website being built',
    paras: [
      'We build fast, SEO-ready websites and web apps in React and Next.js. Fixed price, and you own 100% of the code.',
      'You get a site that loads quickly, reads well on a phone and can be found on Google.',
    ],
    link: 'More about Website Development', href: '/services/website-development',
  },
  {
    id: 'ai', n: '02', title: 'AI Development', pill: '#E4E9A8', img: '/images/services-preview/ai.svg',
    alt: 'Illustration of a friendly robot mascot representing AI chatbots and agents',
    paras: [
      'RAG pipelines, AI chatbots and AI agents built on your own data, using OpenAI, Anthropic or self-hosted models.',
      'Your documents and records stay yours, and the assistant answers from them.',
    ],
    link: 'More about AI', href: '/services/ai-development',
  },
  {
    id: 'marketing', n: '03', title: 'Digital Marketing & Ads', pill: '#E8CFDC', img: '/images/services-preview/marketing.svg',
    alt: 'Illustration of a rising bar chart representing measured marketing results',
    paras: [
      'SEO, Google Ads and Meta Ads for Chennai businesses, measured from click to sale.',
      'Every rupee of spend is tied back to the enquiries and sales it produced.',
    ],
    link: 'More about Digital Marketing', href: '/services/digital-marketing',
  },
  {
    id: 'crm', n: '04', title: 'CRM & Billing Software', pill: '#D6DCF7', img: '/images/services-preview/crm.svg',
    alt: 'Illustration of a customer record sheet with a tick, representing CRM and billing software',
    paras: [
      'Ready-made CRM, billing and finance software, live in days with no lock-in.',
      'Start with what is ready today and extend it when your business needs more.',
    ],
    link: 'More about our products', href: '/products',
  },
];

const CLIENTS = [1, 2, 3, 4, 5, 6].map((i) => ({ src: `/images/services-preview/logo-${i}.svg`, alt: `Client logo placeholder ${i}` }));

const EASE = [0.22, 1, 0.36, 1] as const;

/* A 48px soft circle that follows the mouse while a link is hovered. Position uses transform only. */
function useCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 24);
      y.set(e.clientY - 24);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  return { x, y, on, bind: { onPointerEnter: () => setOn(true), onPointerLeave: () => setOn(false) } };
}

function ServiceLink({ s, bind }: { s: Service; bind: { onPointerEnter: () => void; onPointerLeave: () => void } }) {
  return (
    <Link href={s.href} {...bind} className="group relative mt-8 inline-block pb-1 text-base font-medium text-[#0f2a4a]">
      {s.link}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#0f2a4a]/25" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#0f2a4a] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
    </Link>
  );
}

function Block({ s, index, onActive, bind, reduce, compact, slide }: { compact: boolean; slide: boolean; s: Service; index: number; onActive: (i: number) => void; bind: ReturnType<typeof useCursor>['bind']; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const centre = useInView(ref, { margin: '-50% 0px -50% 0px' }); // true while the block crosses the vertical centre
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  useEffect(() => {
    if (centre) onActive(index);
  }, [centre, index, onActive]);

  const item = (d: number) => ({
    initial: reduce ? false : slide ? { opacity: 0, x: 48 } : { opacity: 0, y: 24 },
    animate: seen ? { opacity: 1, x: 0, y: 0 } : undefined,
    transition: { duration: 0.6, ease: EASE, delay: d * 0.1 },
  });

  return (
    <div ref={ref} className={compact ? 'flex flex-col justify-center py-8 md:min-h-[58vh] md:py-0' : 'flex min-h-screen flex-col justify-center py-16 md:py-0'}>
      {/* Mobile: illustration above its text, no sticky */}
      <motion.div
        className="relative mb-8 md:hidden"
        initial={reduce || !slide ? false : { opacity: 0, x: -48 }}
        animate={seen ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span aria-hidden="true" className="absolute -left-[50vw] top-1/2 h-56 w-[120%] -translate-y-1/2 rounded-full" style={{ background: s.pill }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.img} alt={s.alt} width={400} height={400} loading="lazy" className="relative mx-auto h-56 w-56" />
      </motion.div>
      <motion.p {...item(0)} className="text-sm font-medium tracking-wide text-[#4a5a70]">{s.n}</motion.p>
      <motion.h2 {...item(1)} className="mt-3 text-4xl font-medium leading-[1.1] tracking-tight text-[#0f2a4a] md:text-[48px]">{s.title}</motion.h2>
      <motion.p {...item(2)} className="mt-6 max-w-md text-base leading-relaxed text-[#4a5a70]">{s.paras[0]}</motion.p>
      {s.paras[1] && <motion.p {...item(3)} className="mt-4 max-w-md text-base leading-relaxed text-[#4a5a70]">{s.paras[1]}</motion.p>}
      {s.points && (
        <motion.ul {...item(3)} className="mt-5 max-w-md space-y-2 text-base leading-relaxed text-[#4a5a70]">
          {s.points.map((p) => (
            <li key={p} className="flex gap-2.5"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#026dde]" />{p}</li>
          ))}
        </motion.ul>
      )}
      <motion.div {...item(4)}>
        <ServiceLink s={s} bind={bind} />
      </motion.div>
    </div>
  );
}

function ClientsCarousel() {
  const [ref, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', dragFree: true });
  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);
  return (
    <section aria-labelledby="clients-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <h2 id="clients-heading" className="text-3xl font-medium tracking-tight text-[#0f2a4a]">Clients &amp; Partners</h2>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-label="Previous logos" className="grid h-11 w-11 place-items-center rounded-full border border-[#dbe4f0] text-[#0f2a4a] transition-[border-color,transform] duration-150 hover:border-[#0f2a4a] active:scale-[0.95]"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" onClick={next} aria-label="Next logos" className="grid h-11 w-11 place-items-center rounded-full border border-[#dbe4f0] text-[#0f2a4a] transition-[border-color,transform] duration-150 hover:border-[#0f2a4a] active:scale-[0.95]"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </div>
      <div ref={ref} className="mt-8 overflow-hidden">
        <ul className="flex">
          {CLIENTS.map((c) => (
            <li key={c.src} className="min-w-0 shrink-0 basis-1/2 pr-6 sm:basis-1/3 lg:basis-1/5">
              <div className="grid h-24 place-items-center rounded-2xl border border-[#dbe4f0] bg-white px-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} width={200} height={80} loading="lazy" className="h-12 w-auto opacity-70 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ServicesSticky() {
  return <StickySteps items={SERVICES} headingId="services-heading" srHeading="Our services" clients />;
}

export function StickySteps({ items, headingId, srHeading, clients = false, heading, compact = false, slide = false }: { compact?: boolean; slide?: boolean; items: Service[]; headingId: string; srHeading: string; clients?: boolean; heading?: { eyebrow: string; title: string; intro: string } }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const shown = useInView(wrap, { once: true, margin: '0px 0px -20% 0px' }); // the pinned art waits for the section
  const cursor = useCursor();
  const onActive = useCallback((i: number) => setActive(i), []);

  // Thin progress line beside the pinned column; transform only.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const a = items[active];

  return (
    <>
      <section id={headingId.replace('-heading', '')} aria-labelledby={headingId} className="relative overflow-x-clip bg-white">
        {heading ? (
          <div className={compact ? 'mx-auto max-w-7xl px-4 pt-10 sm:px-6' : 'mx-auto max-w-7xl px-4 pt-16 sm:px-6'}>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#026dde]">{heading.eyebrow}</p>
            <h2 id={headingId} className="mt-3 max-w-2xl text-3xl font-medium leading-tight tracking-tight text-[#0f2a4a] md:text-4xl">{heading.title}</h2>
            <p className="mt-3 max-w-2xl text-base text-[#4a5a70]">{heading.intro}</p>
          </div>
        ) : (
          <h2 id={headingId} className="sr-only">{srHeading}</h2>
        )}
        <div ref={wrap} className="mx-auto grid max-w-7xl px-4 sm:px-6 md:grid-cols-2 md:gap-10">
          {/* Left: pinned illustration area (desktop only) */}
          <div className="relative hidden md:block">
            <div className={compact ? 'sticky top-[15vh] flex h-[58vh] items-center justify-center' : 'sticky top-0 flex h-screen items-center justify-center'} aria-hidden="false">
              {/* Pills crossfade by opacity so the colour change stays on the compositor */}
              {items.map((s, i) => (
                <motion.span
                  key={s.id}
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 w-[150%] -translate-y-1/2 rounded-full ${compact ? 'h-[50vh] max-h-[460px]' : 'h-[68vh] max-h-[620px]'}`}
                  style={{ background: s.pill, marginLeft: 'calc(-50vw - 40px)' }}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: 'easeOut' }}
                />
              ))}
              <AnimatePresence mode="popLayout" initial={slide}>
                <motion.div
                  key={a.id}
                  className="relative"
                  initial={reduce ? false : { opacity: 0, scale: 0.95, x: slide ? -56 : 0 }}
                  animate={slide && !shown && !reduce ? { opacity: 0, scale: 0.95, x: -56 } : { opacity: 1, scale: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, x: slide ? 24 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
                >
                  <motion.div animate={reduce ? undefined : { y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.img} alt={a.alt} width={400} height={400} className={compact ? 'h-auto w-[min(20vw,300px)]' : 'h-auto w-[min(26vw,380px)]'} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <motion.span aria-hidden="true" style={{ scaleY: progress }} className="absolute right-0 top-[6vh] h-[46vh] w-px origin-top bg-[#0f2a4a]/30" />
            </div>
          </div>

          {/* Right: scrolling text */}
          <div>
            {items.map((s, i) => (
              <Block key={s.id} s={s} index={i} onActive={onActive} bind={cursor.bind} reduce={reduce} compact={compact} slide={slide} />
            ))}
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ x: cursor.x, y: cursor.y }}
          animate={{ opacity: cursor.on && !reduce ? 1 : 0, scale: cursor.on ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-12 w-12 rounded-full bg-[#0f2a4a]/10 md:block"
        />
      </section>
      {clients && <ClientsCarousel />}
    </>
  );
}
