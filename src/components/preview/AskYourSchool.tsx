'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Bot, Bus, Check, CalendarCheck, GraduationCap, IndianRupee, Laptop, LayoutDashboard, Pause, Play, SendHorizonal, Smartphone, Tablet, Users } from 'lucide-react';
import Reveal, { EASE } from './Reveal';
import { useSiteContent, getContentValue } from '@/components/sections/SiteContentProvider';

// "Ask your school": a mock of the AI Secretary inside the dashboard that plays by itself, like a
// short video. A question is typed, the answer appears, the bars fill, then the next question
// starts. Click a question to jump to it, or press pause. Every figure is made-up sample data and
// the section says so. The demo can be shown on a laptop, a tablet or a phone: the same questions and
// answers, laid out the way each screen would show them.

type Row = { label: string; value: number };
type Answer = { question: string; short: string; reply: string; unit: string; rows: Row[]; max: number; highlight?: number; side: string };

const ANSWERS: Answer[] = [
  {
    question: 'Which class has the lowest attendance today?',
    short: 'Lowest attendance',
    side: 'Attendance',
    reply: 'Class 7-B has the lowest attendance today, at 82%. It is 9 points below the school average.',
    unit: '%',
    max: 100,
    highlight: 0,
    rows: [
      { label: 'Class 7-B', value: 82 },
      { label: 'Class 9-A', value: 88 },
      { label: 'Class 6-C', value: 91 },
      { label: 'Class 10-A', value: 94 },
    ],
  },
  {
    question: 'Who has not paid fees this month?',
    short: 'Fees pending',
    side: 'Fees',
    reply: '38 students have fees pending this month, ₹4.2 lakh in total. Class 8 has the most.',
    unit: ' students',
    max: 14,
    highlight: 0,
    rows: [
      { label: 'Class 8', value: 12 },
      { label: 'Class 5', value: 9 },
      { label: 'Class 10', value: 8 },
      { label: 'Class 3', value: 5 },
    ],
  },
  {
    question: 'Show Class 8 average marks by subject',
    short: 'Class 8 marks',
    side: 'Exams',
    reply: 'Class 8 averages 71% overall. Mathematics is the weakest subject at 62%.',
    unit: '%',
    max: 100,
    highlight: 0,
    rows: [
      { label: 'Mathematics', value: 62 },
      { label: 'Science', value: 68 },
      { label: 'English', value: 76 },
      { label: 'Social', value: 79 },
    ],
  },
  {
    question: 'How many parents opened today’s notice?',
    short: 'Notice reads',
    side: 'Students',
    reply: '1,126 of 1,310 parents have read today’s notice (86%). 184 have not opened it yet.',
    unit: ' parents',
    max: 1310,
    rows: [
      { label: 'Read', value: 1126 },
      { label: 'Not opened', value: 184 },
    ],
  },
];

// What AI Secretary does, in the same words as its module page.
const POINTS = [
  'Instant answers on attendance, fees and admissions',
  'A daily or weekly briefing waiting for you',
  'Alerts when something changes, such as a drop in attendance',
  'Notices and circulars drafted in seconds',
  'Routine parent questions answered automatically',
];

const SIDE = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users, label: 'Students' },
  { icon: CalendarCheck, label: 'Attendance' },
  { icon: IndianRupee, label: 'Fees' },
  { icon: GraduationCap, label: 'Exams' },
  { icon: Bus, label: 'Transport' },
];

type Phase = 'typing' | 'thinking' | 'answer';

type Device = 'laptop' | 'tablet' | 'phone';
const DEVICES: { id: Device; label: string; icon: typeof Laptop }[] = [
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'phone', label: 'Phone', icon: Smartphone },
];

const TYPE_MS = 32; // per character
const THINK_MS = 800;
const HOLD_MS = 4600; // how long an answer stays before the next question

export default function AskYourSchool() {
  const { content } = useSiteContent();
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.35 });
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduce ? 'answer' : 'typing');
  const [playing, setPlaying] = useState(true);
  const [device, setDevice] = useState<Device>('laptop');

  // A phone-sized screen starts on the phone view.
  useEffect(() => {
    if (window.innerWidth < 640) setDevice('phone');
  }, []);
  const a = ANSWERS[idx];
  const running = playing && inView && !reduce;

  // The "video": one step at a time, each step schedules the next.
  useEffect(() => {
    if (!running) return;
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (typed < a.question.length) t = setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
      else t = setTimeout(() => setPhase('thinking'), 350);
    } else if (phase === 'thinking') {
      t = setTimeout(() => setPhase('answer'), THINK_MS);
    } else {
      t = setTimeout(() => {
        setIdx((i) => (i + 1) % ANSWERS.length);
        setTyped(0);
        setPhase('typing');
      }, HOLD_MS);
    }
    return () => clearTimeout(t);
  }, [running, phase, typed, a.question.length]);

  const jump = (i: number) => {
    setIdx(i);
    if (reduce) {
      setTyped(ANSWERS[i].question.length);
      setPhase('answer');
    } else {
      setTyped(0);
      setPhase('typing');
    }
  };

  const shown = reduce || phase !== 'typing' ? a.question : a.question.slice(0, typed);

  // The top bar of the screen: a title, the sample data tag and the pause button.
  const topBar = (kind: Device) => (
    <div className={`flex items-center gap-2 border-b border-[#dbe4f0] bg-[#f4f8fd] ${kind === 'phone' ? 'px-2.5 pb-2 pt-6' : 'px-4 py-3'}`}>
      {kind === 'laptop' && (
        <>
          <span className="h-2.5 w-2.5 rounded-full bg-[#dbe4f0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#dbe4f0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#dbe4f0]" />
        </>
      )}
      <span className={`truncate text-xs font-medium text-[#4a5a70] ${kind === 'laptop' ? 'ml-3' : ''}`}>{kind === 'laptop' ? 'ChaloSchools · Principal dashboard' : 'ChaloSchools · Management app'}</span>
      <span className="ml-auto shrink-0 rounded-full bg-[#026dde]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#026dde]">Sample data</span>
      {!reduce && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause the demo' : 'Play the demo'}
          className="ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#dbe4f0] bg-white text-[#026dde] transition-transform duration-150 active:scale-90"
        >
          {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      )}
    </div>
  );

  // The part that changes: the question, the sample questions and the answer. `compact` is the phone layout.
  const main = (compact: boolean) => (
    <div className={compact ? 'p-2.5 text-[13px]' : 'p-4 sm:p-5'}>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#0f2a4a]">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#026dde] text-white">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
        Ask AI Secretary
      </div>

      {/* the question being typed */}
      <div className={`mt-3 flex items-center gap-3 border border-[#026dde]/40 bg-white px-4 shadow-[0_0_0_4px_rgba(2,109,222,0.08)] ${compact ? 'h-[76px] rounded-[28px]' : 'h-[52px] rounded-full'}`}>
        <span className={`min-w-0 flex-1 text-[#0f2a4a] ${compact ? 'line-clamp-3 text-[13px] font-medium leading-snug' : 'truncate text-sm font-medium sm:text-base'}`} aria-label={a.question}>
          {shown}
          {phase === 'typing' && !reduce && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-[#026dde]" />}
        </span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition-colors duration-300 ${phase === 'typing' ? 'bg-[#9bc4f2]' : 'bg-[#026dde]'}`}>
          <SendHorizonal className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      {/* sample questions: click to jump */}
      <div className={`mt-3 flex gap-2 ${compact ? 'overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden' : 'flex-wrap'}`} style={compact ? { scrollbarWidth: 'none' } : undefined} role="tablist" aria-label="Sample questions">
        {ANSWERS.map((x, i) => (
          <button
            key={x.question}
            type="button"
            role="tab"
            aria-selected={i === idx}
            onClick={() => jump(i)}
            className={`rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] sm:text-sm ${compact ? 'shrink-0 whitespace-nowrap' : ''} ${
              i === idx ? 'border-[#026dde] bg-[#026dde] text-white' : 'border-[#dbe4f0] bg-white text-[#0f2a4a] hover:border-[#026dde] hover:text-[#026dde]'
            }`}
          >
            {x.short}
          </button>
        ))}
      </div>

      {/* the answer */}
      <div className={`mt-3 rounded-xl border border-[#dbe4f0] bg-[#f4f8fd] ${compact ? 'h-[212px] overflow-hidden p-3' : 'mt-4 h-[232px] overflow-hidden p-4'}`} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {phase === 'answer' ? (
            <motion.div
              key={`a-${idx}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="text-sm font-medium leading-relaxed text-[#0f2a4a] sm:text-base">{a.reply}</p>
              <ul className="mt-3 space-y-2.5">
                {a.rows.map((r, i) => (
                  <li key={r.label} className={`grid items-center gap-3 text-sm ${compact ? 'grid-cols-[62px_1fr_auto] gap-2 text-xs' : 'grid-cols-[96px_1fr_auto]'}`}>
                    <span className="font-medium text-[#4a5a70]">{r.label}</span>
                    <span className="h-2.5 overflow-hidden rounded-full bg-white">
                      <motion.span
                        className={`block h-full rounded-full ${a.highlight === i ? 'bg-[#026dde]' : 'bg-[#8fbdf0]'}`}
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${Math.round((r.value / a.max) * 100)}%` }}
                        transition={{ duration: 0.7, delay: reduce ? 0 : 0.12 * i, ease: EASE }}
                      />
                    </span>
                    <span className={`text-right font-semibold tabular-nums text-[#0f2a4a] ${compact ? 'min-w-16' : 'w-24'}`}>
                      {r.value.toLocaleString('en-IN')}
                      {a.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center justify-center gap-2 text-sm font-medium text-[#4a5a70] h-full`}
            >
              {phase === 'thinking' ? (
                <>
                  <span>Checking your records</span>
                  <span aria-hidden="true" className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-[#026dde]" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                    ))}
                  </span>
                </>
              ) : (
                <span>Ask a question about your school</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs text-[#4a5a70]">Sample data for illustration. Your answers come from your own school records.</p>
    </div>
  );

  // The side menu (laptop only): it follows the question.
  const sidebar = (
    <aside className="hidden border-r border-[#dbe4f0] bg-[#f9fbfe] p-4 md:block" aria-hidden="true">
      <ul className="space-y-1">
        {SIDE.map((s) => {
          const on = phase !== 'typing' ? s.label === a.side : s.label === 'Dashboard';
          return (
            <li key={s.label} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${on ? 'bg-[#026dde] text-white' : 'text-[#4a5a70]'}`}>
              <s.icon className="h-4 w-4" />
              {s.label}
            </li>
          );
        })}
      </ul>
    </aside>
  );

  // On laptops and desktops the section is drawn at 85% (like the browser zoomed out a little), so the whole demo fits the screen at 100% zoom.
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:[zoom:0.85]">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
      <Reveal className="max-w-xl lg:order-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">{getContentValue(content, 'ask_eyebrow', 'AI Secretary')}</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold text-[#0f2a4a] md:text-5xl">{getContentValue(content, 'ask_heading', 'Just ask your school.')}</h2>
        <p className="mt-4 text-lg leading-relaxed text-[#4a5a70]">{getContentValue(content, 'ask_intro', 'Ask in plain words. Get the answer from your own records, without opening a single report.')}</p>
        <ul className="mt-6 space-y-3">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-base text-[#0f2a4a]">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#026dde] text-white"><Check className="h-3 w-3" aria-hidden="true" /></span>
              {p}
            </li>
          ))}
        </ul>
        <Link href="/features/ai-secretary" className="mt-8 inline-block rounded-full bg-[#026dde] px-7 py-3.5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">
          See AI Secretary
        </Link>
      </Reveal>

      <Reveal delay={0.1} className="lg:order-1">
        <div ref={wrap} className="flex flex-col lg:min-h-[600px]">
          {/* which screen to show it on */}
          <div role="tablist" aria-label="Show on" className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-[#dbe4f0] bg-white p-1">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={device === d.id}
                onClick={() => setDevice(d.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${device === d.id ? 'bg-[#026dde] text-white' : 'text-[#4a5a70] hover:text-[#026dde]'}`}
              >
                <d.icon className="h-4 w-4" aria-hidden="true" />
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col justify-center">
          {device === 'laptop' && (
            <div>
              <div className="rounded-[18px] bg-[#1b2433] p-2.5 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.55)] sm:p-3">
                <div className="overflow-hidden rounded-xl bg-white">
                  {topBar('laptop')}
                  <div className="grid md:grid-cols-[150px_1fr]">
                    {sidebar}
                    {main(false)}
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="mx-[-3%] h-3 rounded-b-[18px] bg-gradient-to-b from-[#c4ccd9] to-[#e6eaf1] shadow-[0_8px_16px_-8px_rgba(15,42,74,0.4)]" />
            </div>
          )}

          {device === 'tablet' && (
            <div className="mx-auto max-w-[560px] rounded-[30px] bg-[#1b2433] p-3 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.55)]">
              <div className="overflow-hidden rounded-[20px] bg-white">
                {topBar('tablet')}
                {main(false)}
              </div>
            </div>
          )}

          {device === 'phone' && (
            <div className="relative mx-auto max-w-[262px] rounded-[34px] bg-[#1b2433] p-2 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.55)]">
              <div className="relative overflow-hidden rounded-[27px] bg-white">
                <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-[#1b2433]" />
                {topBar('phone')}
                {main(true)}
                <span aria-hidden="true" className="mx-auto mb-2 mt-1 block h-1 w-24 rounded-full bg-[#1b2433]/30" />
              </div>
            </div>
          )}
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}
