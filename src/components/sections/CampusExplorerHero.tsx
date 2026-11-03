'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BarChart3, Bot, BookOpen, Bus, CalendarDays, ClipboardCheck, FileText, GraduationCap, IndianRupee, MessageCircle,
  Package, Smartphone, TrendingUp, UserPlus, Users, Wallet, type LucideIcon,
} from 'lucide-react';
import { CAMPUS_ZONES } from '@/data/campus-zones';
import { MODULES } from '@/data/module-features';

// The modules page hero. Top, centred: the headline. Under it, left: the whole 3D campus (it never zooms). Right, with no
// box round it: a label for the chosen building, a button for each module in it, the chosen module's icon and name, its
// three features as a numbered path, and a row with Back, a timer bar, the count, "See in full" and Next. The module
// changes by itself every few seconds (the building that holds it lights up on the campus); clicking a building, a name
// tag or a button picks one, and holding the pointer on the right side holds the change.
const CampusScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });

const STEP_SECONDS = 5;

// An icon for each module.
const ICONS: Record<string, LucideIcon> = {
  admissions: UserPlus, student: GraduationCap, 'parent-app': Smartphone, attendance: ClipboardCheck, timetable: CalendarDays, exams: FileText,
  fees: IndianRupee, staff: Users, payroll: Wallet, reports: BarChart3, 'performance-insights': TrendingUp, 'ai-secretary': Bot,
  library: BookOpen, inventory: Package, communication: MessageCircle, transport: Bus,
};

// Every module in campus order, with the building that holds it.
const FLAT = CAMPUS_ZONES.flatMap((z) => z.modules.map((id) => ({ zoneId: z.id, moduleId: id })));

export default function CampusExplorerHero({ title, streetView = false, tags = true }: { title: string; streetView?: boolean; tags?: boolean }) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [held, setHeld] = useState(false);

  const cur = FLAT[idx];
  const zone = CAMPUS_ZONES.find((z) => z.id === cur.zoneId)!;
  const mod = MODULES.find((m) => m.id === cur.moduleId);

  const go = useCallback((n: number) => setIdx(((n % FLAT.length) + FLAT.length) % FLAT.length), []);
  // A click on a building or its tag: the first module inside it.
  const pickZone = useCallback((zoneId: string) => {
    const i = FLAT.findIndex((f) => f.zoneId === zoneId);
    if (i >= 0) setIdx(i);
  }, []);

  const Icon = mod ? ICONS[mod.id] ?? Bot : Bot;
  const ZoneIcon = ICONS[zone.modules[0]] ?? Bot;

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#eef5ff_0%,#f5f9ff_60%,var(--background)_100%)] pt-16">
      {/* soft shapes, and leaves and hills in the bottom corners */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-[45%] bg-[#d4e6ff]/70 blur-2xl" />
        <div className="absolute -right-24 -top-8 h-96 w-96 rounded-full bg-[#d9e9ff]/80 blur-3xl" />
        <svg className="absolute bottom-0 left-0 h-24 w-40" viewBox="0 0 160 96" fill="none">
          <path d="M10 96 C 12 60, 34 34, 62 26 C 60 54, 44 80, 10 96 Z" fill="#6cc24a" />
          <path d="M40 96 C 40 66, 66 44, 100 44 C 92 72, 72 90, 40 96 Z" fill="#8fd16f" />
          <path d="M0 96 C 6 74, 20 62, 40 58 C 38 76, 24 90, 0 96 Z" fill="#4faa3a" />
        </svg>
        <svg className="absolute inset-x-0 bottom-0 h-20 w-full" viewBox="0 0 1600 90" preserveAspectRatio="none">
          <path d="M600 90 C 800 60, 1060 70, 1300 56 S 1520 40, 1600 48 V90 Z" fill="#cdeab9" opacity="0.6" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-4 px-4 py-6 sm:px-6 lg:min-h-[calc(100svh-1rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_1fr] lg:px-8">
        {/* the headline: centred at the top */}
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0a1a4a] text-balance sm:text-4xl lg:col-span-2 lg:row-start-1 lg:text-[2.6rem] xl:text-5xl"
        >
          {title}
        </motion.h1>

        {/* the whole campus, left */}
        <div className="relative h-[440px] sm:h-[540px] lg:col-start-1 lg:row-start-2 lg:h-auto lg:min-h-[440px]">
          {streetView ? (
            <>
              <CampusScene wideOffset={0} zoneMode landscape streetView labels={false} onVisit={pickZone} selected={zone.id} />
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#0a1a4a] shadow">
                Street view · drag to look around
              </p>
            </>
          ) : (
            <CampusScene wideOffset={0} distance={1.38} zoneMode labels={tags} onVisit={pickZone} selected={zone.id} />
          )}
        </div>

        {/* the module, right: no box round it */}
        <div
          className="flex flex-col justify-center gap-3 lg:col-start-2 lg:row-start-2"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          {/* the building and how many modules it holds */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dbe9fd] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#1d5fd0]">
              <ZoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {zone.title} · {zone.modules.length} {zone.modules.length === 1 ? 'module' : 'modules'}
            </span>
          </div>

          {/* a button for each module in it */}
          <div role="tablist" aria-label={`Modules in the ${zone.title.toLowerCase()}`} className="flex flex-wrap gap-2.5">
            {zone.modules.map((id) => {
              const mm = MODULES.find((x) => x.id === id);
              const on = id === cur.moduleId;
              const BtnIcon = ICONS[id] ?? Bot;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => go(FLAT.findIndex((f) => f.moduleId === id))}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.97] ${
                    on
                      ? 'bg-gradient-to-b from-[#1d8bff] to-[#0a5fd8] text-white shadow-[0_14px_28px_-12px_rgba(10,95,216,0.7)]'
                      : 'bg-white/75 text-[#1c3d8f] shadow-[0_10px_22px_-14px_rgba(40,80,160,0.6)] ring-1 ring-white hover:bg-white'
                  }`}
                >
                  <BtnIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {mm?.title ?? id}
                </button>
              );
            })}
          </div>

          {mod && (
            <motion.div key={mod.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mt-1">
              {/* the module's icon and name */}
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-[#4aa6ff] to-[#0a5fd8] text-white shadow-[0_18px_34px_-14px_rgba(10,95,216,0.7)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span aria-hidden="true" className="h-8 w-px shrink-0 bg-[#cfdcf2]" />
                <h2 className="font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-[#0a1a4a] lg:text-[1.5rem]">{mod.title}</h2>
              </div>

              {/* the three features, as a numbered path */}
              <ol className="ml-1 mt-4">
                {mod.features.map((f, i) => (
                  <motion.li
                    key={f.name}
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: reduce ? 0 : 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex gap-3.5 pb-2.5 last:pb-0"
                  >
                    {i < mod.features.length - 1 && <span aria-hidden="true" className="absolute left-[14px] top-8 h-[calc(100%-2rem)] w-0.5 rounded-full bg-gradient-to-b from-[#7bb6ff] to-[#cfe3ff]" />}
                    <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#3d9bff] to-[#0a5fd8] font-display text-xs font-extrabold text-white shadow-[0_8px_16px_-8px_rgba(10,95,216,0.8)] ring-[3px] ring-white/80">{i + 1}</span>
                    <span className="pt-0.5">
                      <span className="block font-display text-[15px] font-bold leading-tight text-[#0a1a4a]">{f.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-[#3d4a78]">{f.line}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* Back, the timer bar, the count, "See in full", Next */}
          <div className="mt-1 flex items-center gap-2.5">
            <button type="button" onClick={() => go(idx - 1)} aria-label="Previous module" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#dbe5f5] bg-white text-[#0a1a4a] shadow-sm transition-[border-color,transform] duration-150 hover:border-[#0a5fd8] active:scale-[0.94]"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#d9e4f6]" aria-hidden="true">
              {reduce ? null : (
                <span
                  key={idx}
                  className="seg-fill block h-full rounded-full bg-[#1d8bff]"
                  style={{ animationDuration: `${STEP_SECONDS}s`, animationPlayState: held ? 'paused' : 'running' }}
                  onAnimationEnd={() => go(idx + 1)}
                />
              )}
            </div>
            <span className="shrink-0 text-xs font-bold tabular-nums text-[#0a1a4a]">{idx + 1} / {FLAT.length}</span>
            {mod && (
              <a href={`#${mod.id}`} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#1f6fe6] to-[#0a4fb8] px-4 text-[13px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(10,79,184,0.8)] transition-[transform,box-shadow] duration-150 hover:shadow-[0_18px_32px_-12px_rgba(10,79,184,0.9)] active:scale-[0.97]">
                See in full <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <button type="button" onClick={() => go(idx + 1)} aria-label="Next module" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#dbe5f5] bg-white text-[#0a1a4a] shadow-sm transition-[border-color,transform] duration-150 hover:border-[#0a5fd8] active:scale-[0.94]"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
