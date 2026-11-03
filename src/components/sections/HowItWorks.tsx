'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Pause, Play } from 'lucide-react';
import { EASE } from '@/components/preview/Reveal';
import { useSiteContent, getContentValue } from '@/components/sections/SiteContentProvider';

// "See how it works": a screen on one side, the 14 module names on the other. The screen plays
// like a short video: the module's own set-up steps light up one by one while a small animated
// scene shows what is happening (a list filling, bars growing, a bus moving, a chat, a timetable).
// When the steps end it moves on to the next module. If a real video file exists for a module,
// that plays instead. The scenes use sample data, and the section says so.

export interface HowItem {
  slug: string;
  title: string;
  stage: string;
  steps: string[];
  video?: { src: string; poster?: string };
}

const MODULE_SECONDS = 3; // how long each module stays on screen; its steps share that time

type Rows = { kind: 'rows'; title: string; rows: [string, string][] };
type Bars = { kind: 'bars'; title: string; unit: string; bars: [string, number][] };
type Chat = { kind: 'chat'; title: string; lines: { who: 'a' | 'b'; text: string }[] };
type Route = { kind: 'route'; title: string };
type Grid = { kind: 'grid'; title: string };
type Scene = Rows | Bars | Chat | Route | Grid;

const SCENES: Record<string, Scene> = {
  admissions: { kind: 'rows', title: 'Applications', rows: [['Aarav S.', 'Enquiry'], ['Diya R.', 'Form received'], ['Kabir M.', 'Verified'], ['Ananya P.', 'Enrolled']] },
  student: { kind: 'rows', title: 'Student records', rows: [['Aarav S. · 6-A', 'Profile'], ['Diya R. · 7-B', 'Documents'], ['Kabir M. · 8-A', 'Guardian'], ['Ananya P. · 9-C', 'Complete']] },
  'staff-hr': { kind: 'rows', title: 'Staff', rows: [['R. Kumar', 'Mathematics'], ['S. Priya', 'English'], ['M. Anand', 'Science'], ['L. Devi', 'Office']] },
  payroll: { kind: 'rows', title: 'Salary run', rows: [['R. Kumar', '₹42,000'], ['S. Priya', '₹38,500'], ['M. Anand', '₹40,200'], ['L. Devi', '₹26,000']] },
  fees: { kind: 'rows', title: 'Fee collection', rows: [['Class 8 · Aarav S.', 'Paid'], ['Class 5 · Diya R.', 'Pending'], ['Class 10 · Kabir M.', 'Paid'], ['Class 3 · Ananya P.', 'Receipt sent']] },
  inventory: { kind: 'rows', title: 'Stock', rows: [['Lab beakers', '48 in stock'], ['Chalk boxes', 'Low stock'], ['Wall maps', '12 in stock'], ['Sports kits', '30 in stock']] },
  library: { kind: 'rows', title: 'Library', rows: [['Wings of Fire', 'Issued'], ['Panchatantra', 'Returned'], ['School atlas', 'Issued'], ['Maths Olympiad', 'Due soon']] },
  attendance: { kind: 'bars', title: 'Attendance today', unit: '%', bars: [['Class 6-C', 91], ['Class 7-B', 82], ['Class 9-A', 88], ['Class 10-A', 94]] },
  exams: { kind: 'bars', title: 'Class 8 average marks', unit: '%', bars: [['Mathematics', 62], ['Science', 68], ['English', 76], ['Social', 79]] },
  'performance-insights': { kind: 'bars', title: 'Average score by term', unit: '%', bars: [['Term 1', 64], ['Term 2', 68], ['Term 3', 73], ['Term 4', 79]] },
  whatsapp: { kind: 'chat', title: 'Notice to parents', lines: [{ who: 'a', text: 'PTM on Friday, 10 am' }, { who: 'b', text: 'Delivered to 1,310 parents' }, { who: 'b', text: 'Read by 1,126 parents' }, { who: 'a', text: 'Reminder sent to 184 parents' }] },
  'ai-secretary': { kind: 'chat', title: 'Ask AI Secretary', lines: [{ who: 'a', text: 'Which class has the lowest attendance today?' }, { who: 'b', text: 'Class 7-B, at 82%.' }, { who: 'a', text: 'Who has not paid fees?' }, { who: 'b', text: '38 students, ₹4.2 lakh pending.' }] },
  transport: { kind: 'route', title: 'Bus 12 · live' },
  timetable: { kind: 'grid', title: 'Class 8 timetable' },
};

const FALLBACK_SCENE: Rows = { kind: 'rows', title: 'Records', rows: [['Item 1', 'Added'], ['Item 2', 'Added'], ['Item 3', 'Added'], ['Item 4', 'Added']] };

// How many of `total` things are showing at this step.
const shownCount = (step: number, steps: number, total: number) => Math.min(total, Math.ceil(((step + 1) / steps) * total));

function RowsScene({ s, step, steps }: { s: Rows; step: number; steps: number }) {
  const n = shownCount(step, steps, s.rows.length);
  return (
    <ul className="space-y-1.5">
      {s.rows.map(([a, b], i) => (
        <motion.li
          key={a}
          initial={false}
          animate={{ opacity: i < n ? 1 : 0.12, x: i < n ? 0 : 10 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-sm ${i === n - 1 ? 'bg-[#026dde] text-white' : 'bg-white/10 text-white'}`}
        >
          <span className="truncate font-medium">{a}</span>
          <span className="shrink-0 text-xs font-semibold opacity-90">{b}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function BarsScene({ s, step, steps }: { s: Bars; step: number; steps: number }) {
  const n = shownCount(step, steps, s.bars.length);
  return (
    <ul className="space-y-2.5">
      {s.bars.map(([label, v], i) => (
        <li key={label} className="grid grid-cols-[84px_1fr_40px] items-center gap-2 text-xs text-white">
          <span className="truncate font-medium text-white/80">{label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <motion.span className="block h-full rounded-full bg-[#4aa3ff]" initial={false} animate={{ width: i < n ? `${v}%` : '0%' }} transition={{ duration: 0.8, ease: EASE }} />
          </span>
          <span className="text-right font-semibold tabular-nums">{i < n ? `${v}${s.unit}` : ''}</span>
        </li>
      ))}
    </ul>
  );
}

function ChatScene({ s, step, steps }: { s: Chat; step: number; steps: number }) {
  const n = shownCount(step, steps, s.lines.length);
  return (
    <ul className="space-y-2">
      {s.lines.map((l, i) => (
        <motion.li
          key={l.text}
          initial={false}
          animate={{ opacity: i < n ? 1 : 0, y: i < n ? 0 : 10, scale: i < n ? 1 : 0.96 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-sm ${l.who === 'a' ? 'ml-auto rounded-br-sm bg-[#026dde] text-white' : 'rounded-bl-sm bg-white/90 text-[#0f2a4a]'}`}
        >
          {l.text}
        </motion.li>
      ))}
    </ul>
  );
}

const STOPS = [
  { x: 24, y: 138, label: 'School' },
  { x: 92, y: 104, label: 'Stop 1' },
  { x: 152, y: 58, label: 'Stop 2' },
  { x: 220, y: 84, label: 'Stop 3' },
  { x: 276, y: 30, label: 'Home' },
];

function RouteScene({ step, steps }: { step: number; steps: number }) {
  const at = Math.min(STOPS.length - 1, Math.round(((step + 1) / steps) * (STOPS.length - 1)));
  const bus = STOPS[at];
  return (
    <div className="relative">
      <svg viewBox="0 0 300 170" className="w-full" role="img" aria-label="A school bus moving along its route">
        <polyline points={STOPS.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 8" />
        {STOPS.map((p, i) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={7} fill={i <= at ? '#4aa3ff' : '#1e3a5f'} stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 20} textAnchor="middle" fontSize="9" fill="white" fillOpacity="0.8">{p.label}</text>
          </g>
        ))}
        <motion.g initial={false} animate={{ x: bus.x, y: bus.y }} transition={{ duration: 1.1, ease: EASE }}>
          <rect x={-13} y={-18} width={26} height={14} rx={3} fill="#f59e0b" />
          <rect x={-10} y={-16} width={6} height={5} rx={1} fill="#fff" fillOpacity="0.85" />
          <rect x={-2} y={-16} width={6} height={5} rx={1} fill="#fff" fillOpacity="0.85" />
          <circle cx={-7} cy={-3} r={3} fill="#0b1a33" />
          <circle cx={7} cy={-3} r={3} fill="#0b1a33" />
        </motion.g>
      </svg>
      <motion.p
        initial={false}
        animate={{ opacity: at >= 3 ? 1 : 0, y: at >= 3 ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mt-1 w-fit rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0f2a4a] shadow-md"
      >
        Parent alert: bus is {at >= 4 ? 'at your stop' : '1 stop away'}
      </motion.p>
    </div>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SUBJECTS = ['Maths', 'English', 'Science', 'Social', 'Hindi', 'Art', 'PE', 'Maths', 'Science', 'English', 'Social', 'Computer', 'Hindi', 'Maths', 'Library', 'Science', 'English', 'Maths', 'Social', 'Music'];

function GridScene({ step, steps }: { step: number; steps: number }) {
  const n = shownCount(step, steps, SUBJECTS.length);
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold text-white/70">
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="mt-1.5 grid grid-cols-5 gap-1.5">
        {SUBJECTS.map((sub, i) => {
          // Fill down each day's column, one period at a time.
          const col = i % 5;
          const row = Math.floor(i / 5);
          const idx = col * 4 + row;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: idx < n ? 1 : 0.15, scale: idx < n ? 1 : 0.92 }}
              transition={{ duration: 0.3, delay: idx < n ? 0.03 * idx : 0, ease: EASE }}
              className={`rounded-md px-1 py-1.5 text-center text-[10px] font-semibold ${idx === n - 1 ? 'bg-[#026dde] text-white' : 'bg-white/12 text-white'}`}
            >
              {sub}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function SceneView({ scene, step, steps }: { scene: Scene; step: number; steps: number }) {
  switch (scene.kind) {
    case 'rows': return <RowsScene s={scene} step={step} steps={steps} />;
    case 'bars': return <BarsScene s={scene} step={step} steps={steps} />;
    case 'chat': return <ChatScene s={scene} step={step} steps={steps} />;
    case 'route': return <RouteScene step={step} steps={steps} />;
    case 'grid': return <GridScene step={step} steps={steps} />;
  }
}

export default function HowItWorks({ items }: { items: HowItem[] }) {
  const { content } = useSiteContent();
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const item = items[active];

  // Start each module from its first step.
  useEffect(() => {
    setStep(reduce && item ? item.steps.length - 1 : 0);
  }, [active, reduce, item]);

  if (!item) return null;
  const scene = SCENES[item.slug] ?? FALLBACK_SCENE;
  const steps = item.steps.length;
  const run = playing && inView && !reduce;

  // When a step's bar finishes: next step, then next module.
  const next = () => {
    if (step < steps - 1) setStep(step + 1);
    else {
      setActive((a) => (a + 1) % items.length);
    }
  };

  return (
    <section id="how-it-works" className="bg-[#f4f8fd] py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">{getContentValue(content, 'howitworks_eyebrow', 'How it works')}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#0f2a4a] md:text-4xl">{getContentValue(content, 'howitworks_heading', 'Pick a module. See how it is used.')}</h2>
          <p className="mt-3 text-lg text-[#4a5a70]">{getContentValue(content, 'howitworks_intro', 'Every module in plain steps, from first set-up to everyday use.')}</p>
        </div>

        <div ref={wrap} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* the screen */}
          <div className="self-start rounded-[18px] bg-[#1b2433] p-2.5 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.55)] sm:p-3">
            {item.video ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0b1a33]">
                <video key={item.slug} controls autoPlay muted loop playsInline poster={item.video.poster} className="absolute inset-0 h-full w-full object-cover">
                  <source src={item.video.src} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="relative flex min-h-[330px] flex-col overflow-hidden rounded-xl bg-[#0b1a33]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(110deg,transparent_20%,rgba(2,109,222,0.5)_45%,rgba(120,200,255,0.45)_55%,transparent_80%)] blur-xl" />

                {/* title bar */}
                <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-2 truncate text-xs font-medium text-white/70">ChaloSchools · {item.title}</span>
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#6db4ff]">Sample data</span>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={item.slug}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative grid flex-1 gap-4 p-4 md:grid-cols-[1.05fr_1fr]"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6db4ff]">{item.stage}</p>
                      <h3 className="mt-1 font-display text-lg font-extrabold text-white sm:text-xl">{item.title}</h3>
                      <ol className="mt-2 space-y-1">
                        {item.steps.map((s, n) => {
                          const on = n === step;
                          const done = n < step;
                          return (
                            <li key={n} className={`flex items-start gap-2.5 rounded-lg px-2.5 py-1 text-[12.5px] leading-snug transition-colors duration-300 ${on ? 'bg-white/12 text-white' : 'text-white/50'}`}>
                              <span className={`mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors duration-300 ${on ? 'bg-[#026dde] text-white' : done ? 'bg-[#6db4ff]/30 text-[#6db4ff]' : 'bg-white/10 text-white/60'}`}>
                                {done ? <Check className="h-3 w-3" aria-hidden="true" /> : n + 1}
                              </span>
                              <span>{s}</span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>

                    <div aria-hidden="true" className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">{scene.title}</p>
                      <SceneView scene={scene} step={step} steps={steps} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* timeline: one segment per step, like a video scrubber */}
                <div className="relative flex items-center gap-3 border-t border-white/10 px-4 py-2">
                  {!reduce && (
                    <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause the walkthrough' : 'Play the walkthrough'} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-transform duration-150 active:scale-90">
                      {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                  )}
                  <div className="flex flex-1 gap-1.5" aria-hidden="true">
                    {item.steps.map((_, n) => (
                      <button key={n} type="button" tabIndex={-1} onClick={() => setStep(n)} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                        {n < step || (reduce && n <= step) ? (
                          <span className="absolute inset-0 bg-[#4aa3ff]" />
                        ) : n === step && !reduce ? (
                          <span
                            key={`${active}-${step}`}
                            className="seg-fill absolute inset-y-0 left-0 bg-[#4aa3ff]"
                            style={{ animationDuration: `${MODULE_SECONDS / steps}s`, animationPlayState: run ? 'running' : 'paused' }}
                            onAnimationEnd={next}
                          />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums text-white/60">{active + 1} / {items.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* module names */}
          <div>
            <ul className="grid grid-cols-2 gap-2" role="tablist" aria-label="Modules">
              {items.map((m, i) => (
                <li key={m.slug}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] ${
                      i === active ? 'border-[#026dde] bg-[#026dde] text-white' : 'border-[#dbe4f0] bg-white text-[#0f2a4a] hover:border-[#026dde] hover:text-[#026dde]'
                    }`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${i === active ? 'bg-white/20' : 'bg-[#026dde]/10 text-[#026dde]'}`}>{i + 1}</span>
                    <span className="truncate">{m.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Link href={`/features/${item.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#026dde] px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">
              Open {item.title}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
