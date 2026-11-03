'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { animate, createScope, stagger, svg, utils } from 'animejs';
import { moduleHref } from '@/lib/module-links';

// Motion-design concepts in the spirit of Anime.js and Jitter: flat shapes,
// bold type, staggered choreography. PREVIEW ONLY.

const BRAND = '#026dde';
const AMBER = '#f59e0b';
const GREEN = '#10b981';
const INK = '#0f2a4a';

// --- A. Paper becomes dashboard ----------------------------------------------
export function PaperToDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);

  // Loop the sequence so the paper side never sits empty.
  useEffect(() => {
    const id = window.setInterval(() => setRun((r) => r + 1), 9000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const scope = createScope({ root: ref }).add(() => {
      const papers = utils.$('.paper');
      const tiles = utils.$('.tile');
      const bars = utils.$('.bar');
      const tileCentres = [0, 1, 2, 3, 4, 5].map((i) => ({
        x: 620 + (i % 3) * 120 + 50,
        y: 110 + Math.floor(i / 3) * 170 + 80,
      }));

      const pos = papers.map((_, i) => ({ x: 110 + ((i * 97) % 380), y: 90 + ((i * 53) % 300), r: ((i * 37) % 50) - 25 }));
      utils.set(papers, {
        translateX: (_?: unknown, i = 0): number => pos[i].x,
        translateY: (_?: unknown, i = 0): number => pos[i].y,
        rotate: (_?: unknown, i = 0): number => pos[i].r,
        scale: 1,
        opacity: 1,
      });
      animate(papers, {
        translateX: (_?: unknown, i = 0): number => tileCentres[i % 6].x,
        translateY: (_?: unknown, i = 0): number => tileCentres[i % 6].y,
        rotate: 0,
        scale: (_?: unknown, i = 0): number => (i < 6 ? 0.25 : 0.0001),
        opacity: 0,
        duration: 1100,
        delay: stagger(70),
        ease: 'inOutCubic',
      });

      animate(tiles, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 900,
        delay: stagger(90, { start: 900 }),
        ease: 'outBack',
      });
      animate(bars, {
        scaleY: [0, 1],
        duration: 1200,
        delay: stagger(60, { start: 1600 }),
        ease: 'outExpo',
      });

      const counter = { v: 0 };
      animate(counter, {
        v: 18.4,
        duration: 1800,
        delay: 1700,
        ease: 'outExpo',
        onUpdate: () => setCount(counter.v),
      });
    });
    return () => scope.revert();
  }, [run]);

  const left = 'Paper registers';
  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 960 480" className="w-full h-auto" role="img" aria-label="Paper records becoming a live dashboard">
        <style>{`.bar{transform-box:fill-box;transform-origin:50% 100%}.tile{transform-box:fill-box;transform-origin:50% 50%}`}</style>
        <text x="60" y="48" fill="#8a96a8" fontSize="14" fontWeight="600" letterSpacing="2">{left.toUpperCase()}</text>
        <text x="620" y="48" fill={BRAND} fontSize="14" fontWeight="600" letterSpacing="2">LIVE DASHBOARD</text>
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`p${i}`} className="paper">
            <rect x="-45" y="-59" width="90" height="118" rx="6" fill="#fff" stroke="#d6dfee" />
            {[0, 1, 2, 3].map((l) => (
              <rect key={l} x="-32" y={-40 + l * 14} width={l === 0 ? 50 : 56 - l * 6} height="5" rx="2" fill={l === 0 ? BRAND : '#c3ccda'} />
            ))}
          </g>
        ))}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 620 + (i % 3) * 120;
          const y = 110 + Math.floor(i / 3) * 170;
          const col = [BRAND, AMBER, GREEN][i % 3];
          return (
            <g key={`t${i}`}>
              <rect className="tile" x={x} y={y} width="100" height="150" rx="14" fill={INK} />
              <rect className="bar" x={x + 18} y={y + 92} width="14" height={28 + (i * 9) % 36} rx="3" fill={col} />
              <rect className="bar" x={x + 42} y={y + 72} width="14" height={40 + (i * 13) % 40} rx="3" fill={col} opacity="0.8" />
              <rect className="bar" x={x + 66} y={y + 84} width="14" height={22 + (i * 7) % 30} rx="3" fill={col} opacity="0.6" />
            </g>
          );
        })}
        <text x="620" y="455" fill={INK} fontSize="30" fontWeight="800">{count.toFixed(1)}L collected today</text>
      </svg>
      <button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        className="absolute right-3 top-3 rounded-full bg-[#026dde] px-4 py-1.5 text-xs font-semibold text-white"
      >
        Replay
      </button>
    </div>
  );
}

// --- B. Kinetic timetable ----------------------------------------------------
const SUBJECTS = ['Maths', 'Science', 'English', 'Hindi', 'Social', 'Art'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HEADLINE = 'Every period. Every day. One platform.';

export function KineticTimetable() {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scope = createScope({ root: ref }).add(() => {
      animate('.letter', {
        y: [36, 0],
        opacity: [0, 1],
        duration: 700,
        delay: stagger(22),
        ease: 'outExpo',
      });
      animate('.slot', {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        delay: stagger(40, { grid: [5, 6], from: 'center' }),
        ease: 'outBack',
      });
      animate('.chip', {
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 700,
        delay: stagger(90, { start: 900 }),
        ease: 'outElastic(1, .6)',
      });
      animate('.bell', {
        translateX: ['0%', '520%'],
        duration: 5200,
        ease: 'linear',
        loop: true,
        delay: 1200,
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl bg-[#0b1f3a] p-6 text-white">
      <h3 className="font-display text-3xl font-extrabold leading-tight">
        {HEADLINE.split('').map((ch, i) => (
          <span key={i} className="letter inline-block" style={{ opacity: 0 }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h3>
      <div className="relative mt-6 grid grid-cols-6 gap-2">
        <div />
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-widest text-white/50">{d}</div>
        ))}
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={r} className="contents">
            <div className="flex items-center text-xs text-white/50">P{r + 1}</div>
            {DAYS.map((d, c) => {
              const subject = SUBJECTS[(r + c * 2) % SUBJECTS.length];
              const id = `${d}-${r}`;
              const on = picked === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPicked(on ? null : id)}
                  className="slot rounded-lg px-2 py-3 text-left text-xs font-semibold transition-colors"
                  style={{
                    opacity: 0,
                    background: on ? AMBER : (r + c) % 2 ? BRAND : '#1b4d8a',
                    color: on ? '#1a1200' : '#fff',
                  }}
                >
                  {subject}
                  {on && <span className="block text-[10px] font-medium">No conflicts ✓</span>}
                </button>
              );
            })}
          </div>
        ))}
        <div className="bell pointer-events-none absolute bottom-0 left-[16%] top-0 w-px bg-[#f59e0b]/80" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {['Admissions', 'Attendance', 'Exams', 'Fees', 'Transport'].map((name, i) => (
          <Link
            key={name}
            href={moduleHref(['admissions', 'attendance', 'exams', 'fees', 'transport'][i])}
            className="chip rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white hover:text-[#0b1f3a]"
            style={{ opacity: 0 }}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// --- C. Connected modules (line draw + travelling light) ---------------------
const MODULES = [
  { id: 'admissions', label: 'Admissions' },
  { id: 'student', label: 'Students' },
  { id: 'fees', label: 'Fees' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'exams', label: 'Exams' },
  { id: 'communication', label: 'Messages' },
  { id: 'transport', label: 'Transport' },
  { id: 'parent-app', label: 'Parents' },
];

export function ConnectedModules() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scope = createScope({ root: ref }).add(() => {
      animate(svg.createDrawable('.link'), {
        draw: ['0 0', '0 1'],
        duration: 1100,
        delay: stagger(110, { start: 200 }),
        ease: 'inOutSine',
      });
      animate('.node', {
        scale: [0, 1],
        duration: 800,
        delay: stagger(110, { start: 500 }),
        ease: 'outElastic(1, .7)',
      });
      animate('.hub', { scale: [0.6, 1], duration: 900, ease: 'outElastic(1, .5)' });
      animate('.halo', { scale: [1, 1.35], opacity: [0.35, 0], duration: 2200, loop: true, ease: 'outQuad' });

      document.querySelectorAll<SVGPathElement>('.link').forEach((path, i) => {
        const dot = document.querySelector<SVGCircleElement>(`.dot-${i}`);
        if (!dot) return;
        animate(dot, {
          ...svg.createMotionPath(path),
          duration: 2600,
          delay: 1400 + i * 260,
          ease: 'linear',
          loop: true,
        });
      });
    });
    return () => scope.revert();
  }, []);

  const CX = 480;
  const CY = 230;
  const RX = 340;
  const RY = 170;

  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 960 480" className="w-full h-auto" role="img" aria-label="School modules connected to one core">
        {MODULES.map((m, i) => {
          const a = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
          const x = CX + Math.cos(a) * RX;
          const y = CY + Math.sin(a) * RY;
          const cx = CX + Math.cos(a) * RX * 0.45;
          const cy = CY + Math.sin(a) * RY * 0.45 + (i % 2 ? 30 : -30);
          return (
            <g key={m.id}>
              <path className="link" d={`M ${CX} ${CY} Q ${cx} ${cy} ${x} ${y}`} fill="none" stroke={i % 2 ? AMBER : BRAND} strokeWidth="2" strokeLinecap="round" />
              <circle className={`dot-${i}`} r="5" fill={i % 2 ? AMBER : '#7fb4ff'} cx="0" cy="0" />
              <g className="node" style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}>
                <Link href={moduleHref(m.id)}>
                  <circle cx={x} cy={y} r="36" fill="#fff" stroke={i % 2 ? AMBER : BRAND} strokeWidth="3" />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>{m.label}</text>
                </Link>
              </g>
            </g>
          );
        })}
        <circle className="halo" cx={CX} cy={CY} r="70" fill={BRAND} opacity="0.35" />
        <g className="hub" style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: 'view-box' }}>
          <circle cx={CX} cy={CY} r="64" fill={BRAND} />
          <text x={CX} y={CY - 4} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">ChaloSchools</text>
          <text x={CX} y={CY + 16} textAnchor="middle" fontSize="11" fill="#dbe9ff">one platform</text>
        </g>
      </svg>
    </div>
  );
}
