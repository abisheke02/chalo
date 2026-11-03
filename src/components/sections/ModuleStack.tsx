'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Bot, BookOpen, Bus, CalendarDays, Check, ClipboardCheck, FileText, GraduationCap, IndianRupee, MessageCircle,
  Package, Smartphone, TrendingUp, UserPlus, Users, Wallet, type LucideIcon,
} from 'lucide-react';
import { MODULE_AREAS } from '@/data/module-areas';
import { MODULES } from '@/data/module-features';
import { moduleDetailHref } from '@/lib/module-links';
import { MODULE_COPY } from '@/components/sections/ModuleExplorer';

// All the modules as stacking cards (the way Teachmint's Pre-Class / In-Class / Post-Class cards work, sized for this site).
// Every card pins a little lower than the one before it, so the edges of the earlier cards peek out above it. As the next card
// slides up over a card, that card shrinks a little and darkens, as if pushed back into the pile. The last card does not shrink.
// On the right of each card, a phone-style panel shows two of the module's headline features as notifications, which pop in
// one after another. Only transform, opacity and filter are animated. With reduced motion, the cards just stay pinned.
// Every word is real HTML, so every module stays readable by search engines.

const EASE = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  admissions: UserPlus, student: GraduationCap, 'parent-app': Smartphone, attendance: ClipboardCheck, timetable: CalendarDays, exams: FileText,
  fees: IndianRupee, staff: Users, payroll: Wallet, reports: BarChart3, 'performance-insights': TrendingUp, 'ai-secretary': Bot,
  library: BookOpen, inventory: Package, communication: MessageCircle, transport: Bus,
};

// One colour set for each area of the school (the same six areas as the home page wheel).
const LOOK: Record<string, { bg: string; dark: boolean; accent: string }> = {
  'admissions-students': { bg: '#E9EEFF', dark: false, accent: '#4F46E5' },
  'fees-finance': { bg: '#DDF7EC', dark: false, accent: '#16A34A' },
  'teaching-academics': { bg: '#FFF1D6', dark: false, accent: '#EA7A0A' },
  'people-communication': { bg: '#FDE7F1', dark: false, accent: '#DB2777' },
  'campus-operations': { bg: '#DCF0FC', dark: false, accent: '#0284C7' },
  'insight-ai': { bg: '#0B1A3A', dark: true, accent: '#38BDF8' },
};
const OTHER = { bg: '#EBEFF7', dark: false, accent: '#026DDE' };

const ORDER = [...MODULE_AREAS.flatMap((a) => a.modules), 'reports', 'parent-app'];
const ITEMS = ORDER.map((id) => {
  const area = MODULE_AREAS.find((a) => a.modules.includes(id));
  return { id, area: area?.title ?? 'Included with every plan', look: (area && LOOK[area.id]) || OTHER, info: MODULES.find((m) => m.id === id)!, copy: MODULE_COPY[id] };
});

// The 14 modules by a short name, in the order of the cards (they sit in two rows above the cards).
const SHORT: Record<string, string> = {
  admissions: 'Admissions', student: 'Students', fees: 'Fees', payroll: 'Payroll', timetable: 'Timetable', attendance: 'Attendance', exams: 'Exams',
  library: 'Library', staff: 'Staff', communication: 'Communication', transport: 'Transport', inventory: 'Inventory', 'performance-insights': 'Insights', 'ai-secretary': 'AI Secretary',
};
const PILLS = ORDER.filter((id) => SHORT[id]).map((id) => ({ id, label: SHORT[id], index: ORDER.indexOf(id) }));


// Where a card rests below the top of the window (px): under the site menu.
function pinTop(_i?: number) {
  const wide = typeof window !== 'undefined' && window.innerWidth >= 768;
  return wide ? 84 : 74; // every card rests at the same height, so nothing of the cards before it shows behind or above
}

export default function ModuleStack() {
  const reduce = useReducedMotion();
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // One click on a name scrolls to the moment that card has come to rest on the pile. (A card already pinned cannot be reached with a
  // plain #link, because the browser thinks it is already in view.)
  const goTo = (e: React.MouseEvent, index: number) => {
    const ol = list.current;
    if (!ol) return;
    e.preventDefault();
    let top = ol.getBoundingClientRect().top + window.scrollY;
    for (let k = 0; k < index; k++) top += (cards.current[k]?.offsetHeight ?? 0) + 28;
    window.scrollTo({ top: Math.max(0, top - pinTop(index)), behavior: 'smooth' });
    window.history.replaceState(null, '', `#${ORDER[index]}`);
  };

  // As the next card comes up over a card, push that card back (scale and brightness), by how far the next one has travelled.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const els = cards.current;
        let on = 0;
        els.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= pinTop(i) + 4) on = i;
        });
        setActive(on);
        if (reduce) return;
        els.forEach((el, i) => {
          const next = els[i + 1];
          const art = el?.firstElementChild as HTMLElement | null;
          if (!el || !next || !art) return;
          const travel = el.offsetHeight + 28; // from just below this card to sitting on top of it
          const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - pinTop(i + 1)) / travel));
          art.style.transform = `scale(${1 - 0.06 * p})`;
          art.style.filter = `brightness(${1 - 0.12 * p})`;
          art.style.opacity = String(1 - Math.max(0, (p - 0.7) / 0.3)); // gone by the time the next card covers it
        });
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [reduce]);

  return (
    <section id="modules" aria-labelledby="stack-heading" className="bg-surface-2 py-10 md:py-14">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: EASE }} className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[1px] text-[#2563EB]">All modules</p>
          <h2 id="stack-heading" className="mt-2 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-tight text-heading">Every module, one after another</h2>
        </motion.div>

        <nav aria-label="Jump to a module" className="mx-auto mb-8 grid max-w-[1000px] grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {PILLS.map((pl) => (
            <a
              key={pl.id}
              href={`#${pl.id}`}
              onClick={(e) => goTo(e, pl.index)}
              aria-current={active === pl.index ? 'true' : undefined}
              className={`rounded-full border px-3 py-2 text-center text-[13px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                active === pl.index ? 'border-transparent bg-[#026dde] text-white shadow-md' : 'border-border bg-card text-heading hover:border-[#026dde] hover:text-[#026dde]'
              }`}
            >
              {pl.label}
            </a>
          ))}
        </nav>

        <ol ref={list} className="space-y-7 pb-24">
          {ITEMS.map((it, i) => {
            const Icon = ICONS[it.id] ?? Bot;
            const { bg, dark, accent } = it.look;
            const last = i === ITEMS.length - 1;
            const detail = moduleDetailHref(it.id);
            return (
              <li
                key={it.id}
                id={it.id}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="sticky top-[var(--pin-s)] scroll-mt-24 md:top-[var(--pin-m)]"
                // every card rests at the same height (84px, 74px on phones)
                style={{ '--pin-s': '74px', '--pin-m': '84px' } as React.CSSProperties}
              >
                <article
                  className="flex flex-col gap-5 rounded-[28px] p-6 shadow-[0_24px_60px_-24px_rgba(19,32,74,0.28)] md:min-h-[min(360px,calc(100svh-11rem))] md:flex-row md:items-center md:justify-between md:gap-8 md:p-8"
                  style={{ background: bg, transformOrigin: 'top center', willChange: last ? undefined : 'transform, filter' }}
                >
                  <div className="min-w-0 md:max-w-[52%]">
                    <p className={`text-[15px] font-extrabold ${dark ? 'text-white/75' : 'text-[#0B1A3A]/70'}`}>
                      <time>{it.area}</time> · {i + 1} of {ITEMS.length}
                    </p>
                    <h3 className={`mt-2 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] font-extrabold leading-tight ${dark ? 'text-white' : 'text-[#0B1A3A]'}`}>{it.info.title}</h3>
                    <p className={`mt-3 text-[15px] font-semibold leading-snug ${dark ? 'text-[#7DD3FC]' : ''}`} style={dark ? undefined : { color: accent }}>{it.copy?.tagline}</p>
                    <p className={`mt-2 max-w-[460px] text-[15px] leading-relaxed ${dark ? 'text-[#C9D6F2]' : 'text-[#33415f]'}`}>{it.copy?.description}</p>
                    <Link href={detail ?? '/contact#contact-form'} className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline ${dark ? 'text-white' : 'text-[#0B1A3A]'}`}>
                      {detail ? 'Learn more' : 'See it in a demo'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>

                  {/* the phone-style panel: two of the module's headline features, as notifications */}
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.15 } } }}
                    className="w-full max-w-[300px] shrink-0 space-y-3 rounded-[22px] bg-white p-4 shadow-[0_18px_40px_-20px_rgba(19,32,74,0.4)] md:self-center"
                  >
                    {it.info.features.slice(0, 2).map((f, k) => {
                      const RowIcon = k === 0 ? Icon : Check;
                      return (
                        <motion.div
                          key={f.name}
                          variants={{ hidden: reduce ? { opacity: 1 } : { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}
                          className="flex items-center gap-3"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ background: k === 0 ? accent : '#16A34A' }}>
                            <RowIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-bold leading-tight text-[#0B1A3A]">{f.name}</span>
                            <span className="block text-xs leading-snug text-[#6B7790]">{f.line}</span>
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
