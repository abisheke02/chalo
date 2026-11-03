'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, PartyPopper } from 'lucide-react';
import { MODULE_AREAS } from '@/data/module-areas';
import { MODULES } from '@/data/module-features';
import { moduleDetailHref, moduleHref } from '@/lib/module-links';
import { EASE } from './Reveal';

// A hero that is a small game: a campus map where each building is one area of the ERP. Click a
// building to read what it does and open its page. Visited buildings get a tick, a counter shows
// how many are explored, and exploring all of them unlocks a "book a demo" prompt. Role chips above
// the map light up the buildings that matter to that person. The scenery is plain SVG.

const W = 1000;
const H = 560;

type Spot = {
  id: string;
  name: string;
  x: number; // centre, in map units
  y: number;
  w: number; // front face width and height
  h: number;
  area?: string; // id from MODULE_AREAS
  roof: string;
  kind: 'block' | 'school' | 'tower' | 'house' | 'bus';
};

const SPOTS: Spot[] = [
  { id: 'admissions', name: 'Admission office', x: 130, y: 150, w: 120, h: 90, area: 'admissions-students', roof: '#026dde', kind: 'block' },
  { id: 'classrooms', name: 'Classrooms', x: 500, y: 128, w: 230, h: 110, area: 'teaching-academics', roof: '#0f2a4a', kind: 'school' },
  { id: 'accounts', name: 'Accounts office', x: 870, y: 150, w: 120, h: 90, area: 'fees-finance', roof: '#0b8fd6', kind: 'block' },
  { id: 'staff', name: 'Staff room', x: 130, y: 420, w: 120, h: 80, area: 'people-communication', roof: '#5b8def', kind: 'block' },
  { id: 'bus', name: 'Bus stand', x: 380, y: 425, w: 150, h: 70, area: 'campus-operations', roof: '#f59e0b', kind: 'bus' },
  { id: 'principal', name: 'Principal’s office', x: 640, y: 415, w: 110, h: 120, area: 'insight-ai', roof: '#0f2a4a', kind: 'tower' },
  { id: 'parent', name: 'Parent’s home', x: 880, y: 430, w: 110, h: 70, roof: '#026dde', kind: 'house' },
];

const ROLES = [
  { id: 'owner', label: 'School owner', slug: 'school-owners', spots: ['accounts', 'principal'] },
  { id: 'principal', label: 'Principal', slug: 'principals', spots: ['principal', 'classrooms', 'staff'] },
  { id: 'teacher', label: 'Teacher', slug: 'teachers', spots: ['classrooms', 'staff'] },
  { id: 'accountant', label: 'Accountant', slug: 'accountants', spots: ['accounts'] },
  { id: 'parent', label: 'Parent', slug: 'parents', spots: ['parent', 'bus'] },
];

const TOASTS = ['Bus 12 is 2 stops away', 'Fee paid ₹12,500', 'Attendance marked: Class 8B'];

type CardData = { title: string; promise: string; items: { title: string; line: string; href: string }[] };

function cardFor(spot: Spot): CardData {
  if (spot.area) {
    const area = MODULE_AREAS.find((a) => a.id === spot.area)!;
    return {
      title: area.title,
      promise: area.promise,
      items: area.modules.flatMap((id) => {
        const m = MODULES.find((x) => x.id === id);
        return m ? [{ title: m.title, line: m.features[0].line, href: moduleDetailHref(id) ?? moduleHref(id) }] : [];
      }),
    };
  }
  const m = MODULES.find((x) => x.id === 'parent-app');
  return {
    title: 'The Parent & Student App',
    promise: 'Parents see attendance, marks, fees and the school bus on their phone.',
    items: m ? [{ title: m.title, line: m.features[0].line, href: moduleDetailHref('parent-app') ?? moduleHref('parent-app') }] : [],
  };
}

// ---- scenery -----------------------------------------------------------------------------------

function Block({ s, lift, on }: { s: Spot; lift: boolean; on: boolean }) {
  const d = 14;
  const x0 = s.x - s.w / 2;
  const y0 = s.y - s.h / 2;
  const cols = Math.max(2, Math.floor(s.w / 36));
  const rows = Math.max(1, Math.floor(s.h / 44));
  return (
    <g style={{ transform: `translateY(${lift ? -5 : 0}px)`, transition: 'transform 0.25s ease-out' }} filter={on ? 'url(#spot-glow)' : undefined}>
      <ellipse cx={s.x + d / 2} cy={s.y + s.h / 2 + 4} rx={s.w / 2 + 14} ry={7} fill="#0f2a4a" opacity="0.1" />
      {/* side, top, front */}
      <polygon points={`${x0 + s.w},${y0} ${x0 + s.w + d},${y0 - d} ${x0 + s.w + d},${y0 + s.h - d} ${x0 + s.w},${y0 + s.h}`} fill="#cfe2f8" />
      {s.kind === 'house' ? (
        <polygon points={`${x0 - 6},${y0} ${s.x},${y0 - 38} ${x0 + s.w + 6},${y0}`} fill={s.roof} />
      ) : (
        <polygon points={`${x0},${y0} ${x0 + d},${y0 - d} ${x0 + s.w + d},${y0 - d} ${x0 + s.w},${y0}`} fill={s.roof} />
      )}
      <rect x={x0} y={y0} width={s.w} height={s.h} fill="#ffffff" stroke={on ? '#026dde' : '#cfdbea'} strokeWidth={on ? 3 : 1.5} />
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <rect key={`${r}-${c}`} x={x0 + 12 + c * ((s.w - 24) / cols)} y={y0 + 12 + r * 34} width={(s.w - 24) / cols - 8} height={20} rx={3} fill="#bcd9f7" />
        )),
      )}
      <rect x={s.x - 9} y={y0 + s.h - 24} width={18} height={24} rx={2} fill={s.roof} />
      {s.kind === 'school' && (
        <g>
          <line x1={s.x} y1={y0 - d} x2={s.x} y2={y0 - 44} stroke="#0f2a4a" strokeWidth="2" />
          <polygon points={`${s.x},${y0 - 44} ${s.x + 26},${y0 - 37} ${s.x},${y0 - 30}`} fill="#f59e0b" />
        </g>
      )}
      {s.kind === 'tower' && <rect x={s.x - 18} y={y0 - 30} width={36} height={30} fill="#ffffff" stroke="#cfdbea" strokeWidth="1.5" />}
      {s.kind === 'tower' && <polygon points={`${s.x - 22},${y0 - 30} ${s.x},${y0 - 52} ${s.x + 22},${y0 - 30}`} fill={s.roof} />}
    </g>
  );
}

function BusStand({ s, lift, on }: { s: Spot; lift: boolean; on: boolean }) {
  const x0 = s.x - s.w / 2;
  const y0 = s.y - s.h / 2;
  return (
    <g style={{ transform: `translateY(${lift ? -5 : 0}px)`, transition: 'transform 0.25s ease-out' }} filter={on ? 'url(#spot-glow)' : undefined}>
      <ellipse cx={s.x} cy={s.y + s.h / 2 + 2} rx={s.w / 2 + 6} ry={7} fill="#0f2a4a" opacity="0.1" />
      {/* shelter */}
      <rect x={x0 - 4} y={y0 - 6} width={s.w + 8} height={10} rx={3} fill={s.roof} />
      <rect x={x0 + 8} y={y0 + 4} width={5} height={s.h - 14} fill="#9fb0c6" />
      <rect x={x0 + s.w - 13} y={y0 + 4} width={5} height={s.h - 14} fill="#9fb0c6" />
      {/* parked bus */}
      <rect x={x0 + 20} y={y0 + 20} width={s.w - 40} height={34} rx={6} fill="#f59e0b" stroke={on ? '#026dde' : 'none'} strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={x0 + 28 + i * 26} y={y0 + 26} width={18} height={12} rx={2} fill="#ffffff" opacity="0.9" />)}
      <circle cx={x0 + 42} cy={y0 + 56} r={6} fill="#0f2a4a" />
      <circle cx={x0 + s.w - 42} cy={y0 + 56} r={6} fill="#0f2a4a" />
    </g>
  );
}

function Scenery({ hover, active, reduce }: { hover: string | null; active: string | null; reduce: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <filter id="spot-glow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#026dde" floodOpacity="0.5" />
        </filter>
      </defs>
      <rect width={W} height={H} rx="28" fill="#eaf3fd" />
      {/* soft lawns */}
      <ellipse cx="300" cy="300" rx="120" ry="40" fill="#dcecfb" />
      <ellipse cx="760" cy="290" rx="130" ry="36" fill="#dcecfb" />
      {/* road */}
      <rect x="0" y="262" width={W} height="48" fill="#cdd9e8" />
      <line x1="0" y1="286" x2={W} y2="286" stroke="#ffffff" strokeWidth="3" strokeDasharray="22 16" />
      {/* paths from the road to each building */}
      {SPOTS.map((s) => (
        <rect key={s.id} x={s.x - 8} y={s.y < 286 ? s.y + s.h / 2 : 310} width={16} height={s.y < 286 ? 286 - (s.y + s.h / 2) : s.y - s.h / 2 - 310 + 6} fill="#dbe5f1" />
      ))}
      {SPOTS.map((s) =>
        s.kind === 'bus' ? <BusStand key={s.id} s={s} lift={hover === s.id} on={active === s.id} /> : <Block key={s.id} s={s} lift={hover === s.id} on={active === s.id} />,
      )}
      {/* the school bus that keeps driving */}
      <motion.g initial={{ x: -80 }} animate={reduce ? { x: 420 } : { x: [-80, W + 80] }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
        <rect x="0" y="262" width="60" height="26" rx="6" fill="#f59e0b" />
        <rect x="6" y="267" width="12" height="9" rx="2" fill="#fff" />
        <rect x="22" y="267" width="12" height="9" rx="2" fill="#fff" />
        <rect x="38" y="267" width="12" height="9" rx="2" fill="#fff" />
        <circle cx="14" cy="289" r="5" fill="#0f2a4a" />
        <circle cx="46" cy="289" r="5" fill="#0f2a4a" />
      </motion.g>
    </svg>
  );
}

// ---- the hero ------------------------------------------------------------------------------------

export default function CampusMapHero() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [toast, setToast] = useState(0);

  const spot = SPOTS.find((s) => s.id === active) ?? null;
  const card = useMemo(() => (spot ? cardFor(spot) : null), [spot]);
  const roleInfo = ROLES.find((r) => r.id === role) ?? null;
  const complete = visited.length === SPOTS.length;

  // a notification pops up by the parent's home every few seconds
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setToast((n) => (n + 1) % TOASTS.length), 3000);
    return () => clearInterval(t);
  }, [reduce]);

  const pick = (id: string) => {
    setActive(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f8fd_0%,#ffffff_100%)] px-4 pb-14 pt-24 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0f2a4a] md:text-6xl">
          Your entire school. <span className="text-[#026dde]">One platform.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#4a5a70]">Tap a building to see what it runs. Admissions, fees, classes, buses and parents, all on one map.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact#contact-form" className="rounded-full bg-[#026dde] px-7 py-3.5 font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#0258b8] active:scale-[0.97]">Book a Demo</Link>
          <Link href="/product" className="rounded-full border border-[#dbe4f0] bg-white px-7 py-3.5 font-semibold text-[#0f2a4a] transition-[border-color,transform] duration-150 hover:border-[#026dde] active:scale-[0.97]">Explore Modules</Link>
        </div>

        {/* who are you? */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-semibold text-[#4a5a70]">I am a</span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={role === r.id}
              onClick={() => setRole(role === r.id ? null : r.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] ${role === r.id ? 'border-[#026dde] bg-[#026dde] text-white' : 'border-[#dbe4f0] bg-white text-[#0f2a4a] hover:border-[#026dde]'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="mt-2 h-5 text-sm text-[#4a5a70]" aria-live="polite">
          {roleInfo && (
            <>
              Your buildings are glowing.{' '}
              <Link href={`/solutions/role/${roleInfo.slug}`} className="font-semibold text-[#026dde] underline-offset-4 hover:underline">
                See the page for {roleInfo.label.toLowerCase()}s
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* the map (tablet and up) */}
        <div className="relative hidden aspect-[1000/560] w-full overflow-hidden rounded-[28px] border border-[#dbe4f0] shadow-[0_30px_70px_-35px_rgba(2,109,222,0.45)] md:block">
          <Scenery hover={hover} active={active} reduce={reduce} />
          {SPOTS.map((s) => {
            const lit = !roleInfo || roleInfo.spots.includes(s.id);
            const seen = visited.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s.id)}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(s.id)}
                onBlur={() => setHover(null)}
                aria-label={`${s.name}. ${seen ? 'Visited.' : 'Not visited yet.'}`}
                aria-pressed={active === s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%`, width: `${((s.w + 40) / W) * 100}%`, height: `${((s.h + 70) / H) * 100}%` }}
              >
                <span className="sr-only">{s.name}</span>
                {/* state badge: a pulsing dot until visited, then a tick */}
                <span className="absolute right-1 top-1">
                  {seen ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#10b981] text-white shadow"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  ) : (
                    <span className="relative flex h-4 w-4">
                      {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#026dde] opacity-60" />}
                      <span className="relative inline-flex h-4 w-4 rounded-full bg-[#026dde]" />
                    </span>
                  )}
                </span>
                {roleInfo && lit && <span aria-hidden="true" className="absolute inset-x-2 top-3 bottom-8 rounded-2xl ring-4 ring-[#026dde]/40" />}
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold shadow-sm transition-colors duration-200 ${active === s.id ? 'bg-[#026dde] text-white' : 'bg-white text-[#0f2a4a]'} ${roleInfo && !lit ? 'opacity-50' : ''}`}
                >
                  {s.name}
                </span>
              </button>
            );
          })}

          {/* a phone notification by the parent's home */}
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: `${(880 / W) * 100}%`, top: `${(335 / H) * 100}%`, transform: 'translateX(-50%)' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={toast}
                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="whitespace-nowrap rounded-xl bg-[#0f2a4a]/95 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg"
              >
                {TOASTS[toast]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* phones: the same buildings as a list */}
        <ul className="grid grid-cols-2 gap-2 md:hidden">
          {SPOTS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pick(s.id)}
                aria-pressed={active === s.id}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors duration-150 active:scale-[0.97] ${active === s.id ? 'border-[#026dde] bg-[#026dde] text-white' : 'border-[#dbe4f0] bg-white text-[#0f2a4a]'}`}
              >
                {s.name}
                {visited.includes(s.id) && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>

        {/* the card */}
        <div className="rounded-[24px] border border-[#dbe4f0] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,42,74,0.35)]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {card ? (
              <motion.div key={spot!.id} initial={reduce ? false : { opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#026dde]">{spot!.name}</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#0f2a4a]">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a70]">{card.promise}</p>
                <ul className="mt-4 space-y-3">
                  {card.items.map((it) => (
                    <li key={it.title} className="rounded-xl bg-[#f4f8fd] p-3">
                      <Link href={it.href} className="flex items-center justify-between gap-2 font-semibold text-[#0f2a4a] hover:text-[#026dde]">
                        {it.title}
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                      <p className="mt-0.5 text-xs text-[#4a5a70]">{it.line}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? undefined : { opacity: 0 }}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#026dde]">Start here</p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#0f2a4a]">Tap a building</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a70]">Each one is a part of your school. Open them all to see the whole platform.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* progress and reward */}
          <div className="mt-5 border-t border-[#dbe4f0] pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#4a5a70]">
              <span>Explored {visited.length} of {SPOTS.length}</span>
              <span className="flex gap-1" aria-hidden="true">
                {SPOTS.map((s) => <span key={s.id} className={`h-2 w-2 rounded-full transition-colors duration-300 ${visited.includes(s.id) ? 'bg-[#026dde]' : 'bg-[#dbe4f0]'}`} />)}
              </span>
            </div>
            <AnimatePresence>
              {complete && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: EASE }} className="mt-4 rounded-2xl bg-[#026dde] p-4 text-white">
                  <p className="flex items-center gap-2 font-bold"><PartyPopper className="h-5 w-5" aria-hidden="true" />You have seen the whole school.</p>
                  <p className="mt-1 text-sm text-white/85">See it running on your own data.</p>
                  <Link href="/contact#contact-form" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#026dde] transition-transform duration-150 active:scale-[0.97]">
                    Book a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
