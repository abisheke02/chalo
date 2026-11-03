'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// The school year as four cards that stack as you scroll: each one stays in place while the next
// slides over it. On phones the cards simply follow one another. The small badges are examples of
// what the system sends, shown for illustration.

export interface JourneyCard {
  slug: string;
  stage: string;
  title: string;
  text: string;
  points: string[];
  badges: string[];
}

function Card({ card, i, total }: { card: JourneyCard; i: number; total: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1 - (total - i) * 0.03]);

  return (
    <div ref={ref} className="md:sticky md:h-[78vh]" style={{ top: `${5.5 + i * 1.25}rem` }}>
      <motion.article style={{ scale }} className="grid gap-6 rounded-3xl border border-[#dbe4f0] bg-white p-6 shadow-[0_24px_50px_-28px_rgba(15,42,74,0.35)] md:h-[68vh] md:grid-cols-2 md:gap-8 md:p-10">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#026dde]">{String(i + 1).padStart(2, '0')} · {card.stage}</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-[#0f2a4a] md:text-3xl">{card.title}</h3>
          <p className="mt-3 text-base leading-relaxed text-[#4a5a70]">{card.text}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-[#0f2a4a]">
            {card.points.map((p) => (
              <li key={p} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#026dde]" />{p}</li>
            ))}
          </ul>
          <Link href={`/features/${card.slug}`} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#026dde] px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">
            Open this module
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative min-h-[200px] overflow-hidden rounded-2xl bg-[#0b1a33] p-5">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(110deg,transparent_20%,rgba(2,109,222,0.55)_45%,rgba(120,200,255,0.5)_55%,transparent_80%)] blur-xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#6db4ff]">Example activity</p>
          <motion.ul
            aria-hidden="true"
            className="relative mt-4 space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.28 } } }}
          >
            {card.badges.map((b) => (
              <motion.li
                key={b}
                variants={{ hidden: reduce ? { opacity: 1 } : { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } } }}
                className="w-fit max-w-full rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-[#0f2a4a] shadow-md"
              >
                {b}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.article>
    </div>
  );
}

export default function SchoolYearJourney({ cards: base }: { cards: JourneyCard[] }) {
  const { content } = useSiteContent();
  const text = (key: string, fallback: string) => getContentValue(content, key, fallback);
  // Every word can be edited in Admin > Site Content; the module content is the fallback.
  const cards = base.map((c) => ({
    ...c,
    stage: text(`schoolyear_${c.slug}_stage`, c.stage),
    title: text(`schoolyear_${c.slug}_title`, c.title),
    text: text(`schoolyear_${c.slug}_text`, c.text),
  }));
  return (
    <section id="school-year" className="bg-[#f4f8fd] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">{text('schoolyear_eyebrow', 'One school year')}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#0f2a4a] md:text-4xl">{text('schoolyear_heading', 'From first enquiry to final report card.')}</h2>
          <p className="mt-3 text-lg text-[#4a5a70]">{text('schoolyear_intro', 'The same platform at every step, so nothing is copied from one register to the next.')}</p>
        </div>
        <div className="mt-10 space-y-6 md:space-y-0">
          {cards.map((c, i) => (
            <Card key={c.slug} card={c} i={i} total={cards.length} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#4a5a70]">Example activity shown for illustration.</p>
      </div>
    </section>
  );
}
