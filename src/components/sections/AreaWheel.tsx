'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { MODULE_AREAS } from '@/data/module-areas';
import { MODULES } from '@/data/module-features';
import { moduleDetailHref, moduleHref } from '@/lib/module-links';

// A wheel of the six areas a school runs. The wheel turns slowly by itself, so the areas come round
// one by one to the right-hand side, where the chosen segment lifts out and glows and the matching
// text shows. Clicking a segment turns the wheel to it. Hovering pauses the turning. All six text
// panels are in the page at all times (the inactive ones are only faded), so every module link stays
// visible to search engines. Layout idea: a segmented wheel beside a detail panel.

const LABELS: Record<string, string[]> = {
  'admissions-students': ['ADMISSIONS'],
  'fees-finance': ['FEES &', 'FINANCE'],
  'teaching-academics': ['TEACHING'],
  'people-communication': ['PEOPLE'],
  'campus-operations': ['CAMPUS'],
  'insight-ai': ['INSIGHT', '& AI'],
};

const CX = 250;
const CY = 250;
const R_OUT = 222;
const R_IN = 112;
const R_LABEL = (R_OUT + R_IN) / 2;
const GAP = 2.5; // degrees between segments
const LIFT = 12; // how far the chosen segment moves out
const SPEED = 20; // degrees per second, so one area comes round every 3 seconds
// The areas are laid out anticlockwise (area i has its middle at -30 - 60i degrees) and the wheel turns clockwise,
// so they still come round in order 1, 2, 3 ... REST is the wheel angle that puts area 0 on the right: -30 + 120 = 90.
const REST = 120;

const rad = (deg: number) => (deg * Math.PI) / 180;
// Angles run clockwise from the top.
const pt = (r: number, deg: number) => `${(CX + r * Math.sin(rad(deg))).toFixed(2)},${(CY - r * Math.cos(rad(deg))).toFixed(2)}`;

function wedge(a0: number, a1: number) {
  return `M ${pt(R_OUT, a0)} A ${R_OUT} ${R_OUT} 0 0 1 ${pt(R_OUT, a1)} L ${pt(R_IN, a1)} A ${R_IN} ${R_IN} 0 0 0 ${pt(R_IN, a0)} Z`;
}

const N = MODULE_AREAS.length;
const SEG = 360 / N;
const labelAt = (i: number) => {
  const mid = -(i * SEG + SEG / 2);
  return { x: CX + R_LABEL * Math.sin(rad(mid)), y: CY - R_LABEL * Math.cos(rad(mid)) };
};

export default function AreaWheel() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  const rot = useMotionValue(REST);
  const ring = useRef<SVGGElement>(null);
  const labels = useRef<(SVGGElement | null)[]>([]);
  const activeRef = useRef(0);
  const busy = useRef(false); // true while a click is turning the wheel to its segment

  // Turn the wheel (and keep every label upright), and work out which area is now on the right.
  useMotionValueEvent(rot, 'change', (v) => {
    ring.current?.setAttribute('transform', `rotate(${v.toFixed(2)} ${CX} ${CY})`);
    labels.current.forEach((g, i) => {
      const { x, y } = labelAt(i);
      g?.setAttribute('transform', `rotate(${(-v).toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})`);
    });
    if (busy.current) return;
    const idx = ((Math.round((v - REST) / SEG) % N) + N) % N;
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  // Click, tap or keyboard: turn the shortest way round to that area.
  const pick = useCallback(
    (i: number) => {
      const from = rot.get();
      const d = ((((REST + SEG * i - from) % 360) + 540) % 360) - 180;
      activeRef.current = i;
      setActive(i);
      if (reduce) {
        rot.set(from + d);
        return;
      }
      busy.current = true;
      animate(rot, from + d, { type: 'spring', stiffness: 70, damping: 16, mass: 0.9, onComplete: () => { busy.current = false; } });
    },
    [reduce, rot],
  );

  // The slow turning. Paused while hovered or off screen.
  useEffect(() => {
    if (reduce || hover || !inView) return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (!busy.current) rot.set(rot.get() + SPEED * dt);
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [reduce, hover, inView, rot]);

  // Reduced motion: no turning, just a step to the next area now and then.
  useEffect(() => {
    if (!reduce || hover || !inView) return;
    const t = setTimeout(() => pick((activeRef.current + 1) % N), 4800);
    return () => clearTimeout(t);
  }, [reduce, hover, inView, active, pick]);

  return (
    <div ref={wrap} className="mx-auto mt-10 grid max-w-[1280px] items-center gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14">
      {/* the wheel */}
      <div className="mx-auto w-full max-w-[640px] lg:-ml-10 lg:mr-auto">
        <svg viewBox="0 0 500 500" className="w-full overflow-visible" role="group" aria-label="The six areas a school runs. Select one to read about it.">
          <defs>
            <linearGradient id="wheel-on" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4aa3ff" />
              <stop offset="1" stopColor="#026dde" />
            </linearGradient>
            <filter id="wheel-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#026dde" floodOpacity="0.55" />
            </filter>
            <radialGradient id="wheel-centre" cx="50%" cy="40%" r="70%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#e6f0fc" />
            </radialGradient>
          </defs>

          {/* Only the circle itself pauses the turning, not the space around it. The clear disc fills the gaps between segments. */}
          <g onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <circle cx={CX} cy={CY} r={R_OUT + LIFT} fill="transparent" />
          <g ref={ring} transform={`rotate(${REST} ${CX} ${CY})`}>
            {MODULE_AREAS.map((area, i) => {
              const a0 = -(i + 1) * SEG + GAP / 2;
              const a1 = -i * SEG - GAP / 2;
              const mid = (a0 + a1) / 2;
              const on = i === active;
              const dx = Math.sin(rad(mid)) * LIFT;
              const dy = -Math.cos(rad(mid)) * LIFT;
              const { x, y } = labelAt(i);
              const lines = LABELS[area.id] ?? [area.title.toUpperCase()];
              return (
                <motion.g
                  key={area.id}
                  initial={false}
                  animate={{ x: on ? dx : 0, y: on ? dy : 0 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  onClick={() => pick(i)}
                  onFocus={() => i !== activeRef.current && pick(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${area.title}. ${area.promise}`}
                  aria-pressed={on}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      pick(i);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <path
                    d={wedge(a0, a1)}
                    fill={on ? 'url(#wheel-on)' : '#cfe2f8'}
                    fillOpacity={on ? 1 : 0.75}
                    stroke="#ffffff"
                    strokeWidth={on ? 3 : 1.5}
                    filter={on ? 'url(#wheel-glow)' : undefined}
                    style={{ transition: 'fill 0.4s, fill-opacity 0.4s, stroke-width 0.3s' }}
                  />
                  {/* the label turns against the wheel, so it always reads upright */}
                  <g ref={(el) => { labels.current[i] = el; }} transform={`rotate(${-REST} ${x.toFixed(2)} ${y.toFixed(2)})`}>
                    <text x={x} y={y - ((lines.length - 1) * 7)} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700" letterSpacing="1.4" fill={on ? '#ffffff' : '#0f2a4a'} style={{ transition: 'fill 0.3s' }}>
                      {lines.map((l, k) => (
                        <tspan key={l} x={x} dy={k === 0 ? 0 : 14}>{l}</tspan>
                      ))}
                    </text>
                  </g>
                </motion.g>
              );
            })}
          </g>

          {/* centre: glass disc, a slowly turning dashed ring, the logo */}
          <circle cx={CX} cy={CY} r={R_IN - 14} fill="url(#wheel-centre)" stroke="#dbe4f0" strokeWidth="1.5" />
          <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: reduce ? undefined : 'wheel-spin 22s linear infinite reverse' }}>
            <circle cx={CX} cy={CY} r={R_IN - 26} fill="none" stroke="#026dde" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" opacity="0.55" />
          </g>
          <image href="/images/logo.png" x={CX - 56} y={CY - 28} width="112" height="56" preserveAspectRatio="xMidYMid meet" />
          </g>
        </svg>
      </div>

      {/* the text for the chosen area. All six are in the page; only the chosen one shows. */}
      <div className="grid">
        {MODULE_AREAS.map((area, i) => {
          const on = i === active;
          return (
            <div
              key={area.id}
              aria-hidden={!on}
              className={`[grid-area:1/1] transition-[opacity,transform] ease-out ${on ? 'translate-y-0 opacity-100 duration-300 delay-200' : 'pointer-events-none translate-y-3 opacity-0 duration-150'}`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#026dde]">Area {i + 1} of {N}</p>
              <h3 className="mt-2 font-display text-4xl font-extrabold leading-tight text-[#0f2a4a] md:text-5xl">{area.title}</h3>
              <p className="mt-4 text-xl text-[#4a5a70]">{area.promise}</p>
              <ul className="mt-6 space-y-4">
                {area.modules.map((id) => {
                  const m = MODULES.find((x) => x.id === id);
                  if (!m) return null;
                  return (
                    <li key={id} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#026dde]" aria-hidden="true" />
                      <span>
                        <Link href={moduleDetailHref(id) ?? moduleHref(id)} tabIndex={on ? 0 : -1} className="text-lg font-semibold text-[#0f2a4a] underline-offset-4 hover:text-[#026dde] hover:underline">
                          {m.title}
                        </Link>
                        <span className="block text-base text-[#4a5a70]">{m.features[0].line}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={moduleDetailHref(area.modules[0]) ?? moduleHref(area.modules[0])}
                tabIndex={on ? 0 : -1}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#026dde] px-8 py-4 text-base font-bold uppercase tracking-[0.12em] text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]"
              >
                Explore
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
