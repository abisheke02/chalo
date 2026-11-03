'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Bot, Bus, CalendarCheck, Check, GraduationCap, IndianRupee, LayoutDashboard, Mic, Search, ShieldCheck, Users } from 'lucide-react';
import { EASE } from './Reveal';
import { WhatsAppLink } from '@/components/lp/LandingCta';

// Words for the hero. The home page passes its translated copy; the preview uses the defaults.
export interface ClassroomHeroCopy {
  eyebrow?: string;
  lead: string;
  accent: string;
  subtitle: string;
  primary: string;
  secondary: string;
  secondaryHref: string;
  proof?: string;
  whatsapp?: boolean;
}

const DEFAULT_COPY: ClassroomHeroCopy = {
  eyebrow: 'School ERP for CBSE, IB, Cambridge and State Boards',
  lead: 'Your entire school.',
  accent: 'One platform.',
  subtitle: '',
  primary: 'Get Started',
  secondary: 'Explore Modules',
  secondaryHref: '/product',
};

// Home hero option "pre1": a big headline and buttons on a light, softly moving background, and under them the
// product itself, a principal's dashboard that starts tilted and settles flat as you scroll. Floating
// notifications sit in the margins beside it. Every figure on the dashboard is sample data and says so.

const PROMPTS = [
  'Which class has the lowest attendance today?',
  'Who has not paid fees this month?',
  'Show Class 8 results by subject',
  'Where is bus 12 right now?',
];

const NOTES = [
  { who: 'Parent', text: 'Fee paid ₹12,500' },
  { who: 'Teacher', text: 'Attendance marked: Class 8B' },
  { who: 'Principal', text: 'Results published: Term 1' },
];

const TILES = [
  { icon: Users, label: 'Students', href: '/features/student', from: '#4aa3ff', to: '#026dde' },
  { icon: IndianRupee, label: 'Fees', href: '/features/fees', from: '#38c6a0', to: '#0f9d78' },
  { icon: CalendarCheck, label: 'Attendance', href: '/features/attendance', from: '#7aa7ff', to: '#3b6fe0' },
  { icon: GraduationCap, label: 'Exams', href: '/features/exams', from: '#ffb347', to: '#f08a00' },
  { icon: Bus, label: 'Transport', href: '/features/transport', from: '#5cc8ff', to: '#0b8fd6' },
  { icon: Bot, label: 'AI Secretary', href: '/features/ai-secretary', from: '#9b8cff', to: '#5b45e0' },
];

const SIDE = [LayoutDashboard, Users, IndianRupee, CalendarCheck, GraduationCap, Bus, Bot];

const STATS = [
  { label: 'Attendance today', value: '94%', sub: 'Up 2% on last week', fill: 94, color: '#026dde' },
  { label: 'Fees collected', value: '₹18.4L', sub: 'This month', fill: 78, color: '#0f9d78' },
  { label: 'Buses on route', value: '12 of 12', sub: 'All on time', fill: 100, color: '#f08a00' },
];

const WEEK = [62, 78, 70, 88, 94, 82, 90];

function Note({ index, className, delay = 0 }: { index: number; className: string; delay?: number }) {
  const reduce = useReducedMotion();
  const note = NOTES[index % NOTES.length];
  return (
    <div className={`pointer-events-none absolute z-20 hidden min-[1400px]:block ${className}`} aria-hidden="true">
      <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex w-[250px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-sm shadow-[0_18px_40px_-18px_rgba(15,42,74,0.5)] backdrop-blur"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#026dde]/10 text-[#026dde]"><Check className="h-4 w-4" /></span>
            <span className="leading-snug text-[#0f2a4a]"><b className="text-[#026dde]">{note.who}:</b> {note.text}</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function HeroDashboard({ copy = DEFAULT_COPY, topPad = false }: { copy?: ClassroomHeroCopy; topPad?: boolean }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const dash = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % PROMPTS.length), 3200);
    const u = setInterval(() => setN((x) => (x + 1) % NOTES.length), 3200);
    return () => { clearInterval(t); clearInterval(u); };
  }, [reduce]);

  // The dashboard starts tipped back and settles flat as it scrolls up the screen (transform only).
  const { scrollYProgress } = useScroll({ target: dash, offset: ['start end', 'start 0.3'] });
  const tilt = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 16, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 30, 0]);

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f3f8fe_0%,#e7f0fc_55%,var(--background)_100%)]">
      {/* background: slow drifting colour, a faint dot grid that fades out downwards */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#4aa3ff]/25 blur-3xl" animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -right-24 top-40 h-[460px] w-[460px] rounded-full bg-[#7c6cff]/15 blur-3xl" animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute left-1/3 top-[55%] h-[380px] w-[520px] rounded-full bg-[#26c6da]/15 blur-3xl" animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(circle,#026dde_1px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <div className={`relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 text-center sm:px-6 ${topPad ? 'pt-28 sm:pt-32' : 'pt-14 sm:pt-20'}`}>
        {copy.eyebrow && (
          <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="rounded-full border border-white/80 bg-white/80 px-4 py-1.5 text-sm font-semibold text-[#0f2a4a] shadow-sm backdrop-blur">
            {copy.eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0f2a4a] sm:text-6xl lg:text-7xl"
        >
          <span className="block text-balance">{copy.lead}</span>
          <span className="block text-balance bg-gradient-to-r from-[#026dde] via-[#2f8cf5] to-[#22b8e6] bg-clip-text text-transparent">{copy.accent}</span>
        </motion.h1>

        {copy.subtitle && (
          <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="mt-6 max-w-2xl text-lg leading-relaxed text-[#4a5a70] sm:text-xl">
            {copy.subtitle}
          </motion.p>
        )}

        <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32, ease: EASE }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact#contact-form" className="inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-b from-[#1b86f5] to-[#026dde] px-8 text-base font-semibold text-white shadow-[0_18px_36px_-14px_rgba(2,109,222,0.75)] transition-[transform,box-shadow] duration-150 ease-out hover:shadow-[0_22px_40px_-14px_rgba(2,109,222,0.85)] active:scale-[0.97]">
            {copy.primary}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link href={copy.secondaryHref} className="inline-flex h-14 items-center rounded-full border border-[#0f2a4a]/15 bg-white px-8 text-base font-semibold text-[#0f2a4a] shadow-sm transition-[border-color,transform] duration-150 ease-out hover:border-[#026dde] active:scale-[0.97]">
            {copy.secondary}
          </Link>
          {copy.whatsapp && <WhatsAppLink className="inline-flex h-14 items-center gap-2 rounded-full border border-[#0f2a4a]/15 bg-white px-7 text-base font-semibold text-[#0f2a4a] shadow-sm transition-[border-color,transform] duration-150 ease-out hover:border-[#16a34a] active:scale-[0.97]">Chat on WhatsApp</WhatsAppLink>}
        </motion.div>
        {copy.proof && (
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-5 flex items-center gap-2 text-sm font-medium text-[#4a5a70]">
            <ShieldCheck className="h-4 w-4 text-[#026dde]" aria-hidden="true" />
            {copy.proof}
          </motion.p>
        )}

        {/* the product */}
        <div ref={dash} className="relative mt-14 w-full max-w-[940px] [perspective:1500px]">
          <Note index={n} className="-left-[225px] top-10" />
          <Note index={n + 1} className="-right-[225px] top-44" delay={1.4} />
          <motion.div
            style={{ rotateX: tilt, y: lift, transformOrigin: '50% 100%' }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="overflow-hidden rounded-[22px] border border-white/90 bg-white text-left shadow-[0_60px_110px_-40px_rgba(15,42,74,0.55),0_0_0_1px_rgba(2,109,222,0.06)]"
          >
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-[#e3ebf5] bg-[#f6f9fd] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffc24a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3ccf8e]/80" />
              <span className="ml-3 truncate text-xs font-medium text-[#4a5a70]">ChaloSchools · Principal dashboard</span>
              <span className="ml-auto rounded-full bg-[#026dde]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#026dde]">Sample data</span>
            </div>

            <div className="grid sm:grid-cols-[64px_1fr]">
              <aside className="hidden flex-col items-center gap-3 border-r border-[#e3ebf5] bg-[#fafcff] py-5 sm:flex" aria-hidden="true">
                {SIDE.map((Icon, k) => (
                  <span key={k} className={`grid h-10 w-10 place-items-center rounded-xl ${k === 0 ? 'bg-[#026dde] text-white shadow-md shadow-[#026dde]/30' : 'text-[#7a8aa0]'}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                ))}
              </aside>

              <div className="p-4 sm:p-6">
                {/* ask bar */}
                <Link
                  href="/features/ai-secretary"
                  aria-label="Ask AI Secretary. Example: Which class has the lowest attendance today?"
                  className="flex items-center gap-3 rounded-full border border-[#026dde]/25 bg-white px-5 py-3.5 shadow-[0_0_0_4px_rgba(2,109,222,0.07)] transition-shadow duration-200 hover:shadow-[0_0_0_5px_rgba(2,109,222,0.12)]"
                >
                  <Search className="h-4 w-4 shrink-0 text-[#026dde]" aria-hidden="true" />
                  <span className="relative h-5 min-w-0 flex-1 overflow-hidden text-sm text-[#4a5a70] sm:text-base">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="absolute inset-0 truncate"
                      >
                        {PROMPTS[i]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <Mic className="h-4 w-4 shrink-0 text-[#026dde]" aria-hidden="true" />
                </Link>

                {/* three numbers */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {STATS.map((s, k) => (
                    <div key={s.label} className="rounded-2xl border border-[#e3ebf5] bg-[#fbfdff] p-4">
                      <p className="text-xs font-semibold text-[#6b7b90]">{s.label}</p>
                      <p className="mt-1 font-display text-2xl font-extrabold text-[#0f2a4a]">{s.value}</p>
                      <p className="text-xs text-[#6b7b90]">{s.sub}</p>
                      <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-[#e8eef7]">
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: s.color }}
                          initial={reduce ? false : { width: 0 }}
                          animate={{ width: `${s.fill}%` }}
                          transition={{ duration: 0.9, delay: 0.9 + k * 0.15, ease: EASE }}
                        />
                      </span>
                    </div>
                  ))}
                </div>

                {/* the week, and the apps */}
                <div className="mt-3 grid gap-3 sm:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-2xl border border-[#e3ebf5] bg-[#fbfdff] p-4">
                    <p className="text-xs font-semibold text-[#6b7b90]">Attendance this week</p>
                    <div className="mt-3 flex h-24 items-end gap-2" aria-hidden="true">
                      {WEEK.map((h, k) => (
                        <motion.span
                          key={k}
                          className={`flex-1 rounded-t-md ${k === 4 ? 'bg-[#026dde]' : 'bg-[#bcd7f7]'}`}
                          initial={reduce ? false : { height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.7, delay: 1 + k * 0.07, ease: EASE }}
                        />
                      ))}
                    </div>
                  </div>
                  <ul className="grid grid-cols-3 content-center gap-x-2 gap-y-3 rounded-2xl border border-[#e3ebf5] bg-[#fbfdff] p-4">
                    {TILES.map((t) => (
                      <li key={t.label}>
                        <Link href={t.href} className="group flex flex-col items-center gap-1.5">
                          <span className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:scale-95" style={{ background: `linear-gradient(145deg, ${t.from}, ${t.to})` }}>
                            <t.icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="text-[11px] font-semibold text-[#0f2a4a]">{t.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          {/* a soft glow under the dashboard */}
          <div aria-hidden="true" className="absolute -bottom-10 left-1/2 -z-10 h-24 w-[80%] -translate-x-1/2 rounded-[50%] bg-[#026dde]/25 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
