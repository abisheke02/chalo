'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import {
  Bot, Bus, CalendarDays, ClipboardCheck, FileBarChart, GraduationCap, IndianRupee, MessageCircle, Package, UserPlus, Users, Wallet, BookOpen, TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { MODULES } from '@/data/module-features';
import { moduleHref } from '@/lib/module-links';

// Preview only. The fourteen modules from the homepage feature grid, arranged
// as a helix, barrel, ring or sphere — the four layouts from motion.dev's demo.
// Drag to spin with momentum; tabs morph between layouts; click a card to open
// its module.

export const ICONS: Record<string, LucideIcon> = {
  admissions: UserPlus,
  student: GraduationCap,
  staff: Users,
  fees: IndianRupee,
  timetable: CalendarDays,
  attendance: ClipboardCheck,
  exams: FileBarChart,
  communication: MessageCircle,
  inventory: Package,
  payroll: Wallet,
  library: BookOpen,
  transport: Bus,
  'performance-insights': TrendingUp,
  'ai-secretary': Bot,
};
const IDS = Object.keys(ICONS);
const N = IDS.length;
const CW = 150;
const CH = 168;
const R = 430;
// One colour per module, so no two cards share a colour.
export const ACCENTS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#e11d48', '#84cc16', '#f97316', '#ec4899', '#14b8a6', '#eab308', '#6366f1', '#ef4444', '#0ea5e9'];
const LAYOUTS = ['helix', 'barrel', 'ring', 'sphere'] as const;
type Layout = (typeof LAYOUTS)[number];

type Pose = { outerY: number; outerX: number; innerX: number; innerY: number; innerZ: number };
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function poseFor(layout: Layout, i: number): Pose {
  if (layout === 'ring') {
    return { outerY: (i / N) * 360, outerX: 0, innerX: 0, innerY: 0, innerZ: R };
  }
  if (layout === 'barrel') {
    // Two staggered rows of seven around a cylinder.
    const col = i % 7;
    const row = Math.floor(i / 7);
    return { outerY: (col / 7) * 360 + row * (360 / 14), outerX: 0, innerX: 0, innerY: row === 0 ? -104 : 104, innerZ: R * 0.95 };
  }
  if (layout === 'helix') {
    return { outerY: i * 26, outerX: 0, innerX: 0, innerY: (i - (N - 1) / 2) * 22, innerZ: R * 0.85 };
  }
  // Sphere: Fibonacci points, each card turned to face outward.
  // Keep cards in a band around the equator so none stack at the poles.
  const y = (1 - (2 * (i + 0.5)) / N) * 0.7;
  const r = Math.sqrt(1 - y * y);
  const phi = i * GOLDEN;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  return {
    outerY: (Math.atan2(x, z) * 180) / Math.PI,
    outerX: (-Math.asin(y) * 180) / Math.PI * 0.5,
    innerX: 0,
    innerY: 0,
    // Push cards further out so neighbours on the sphere don't intersect.
    innerZ: R * 1.22,
  };
}

const SPRING = { type: 'spring' as const, stiffness: 110, damping: 20, mass: 1 };

export default function ModuleCarousel({
  centre,
  defaultLayout = 'helix',
  fixedLayout = false,
  height = 560,
}: {
  centre?: (spin: MotionValue<number>) => ReactNode;
  defaultLayout?: Layout;
  fixedLayout?: boolean;
  height?: number;
}) {
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });

  const [layout, setLayout] = useState<Layout>(defaultLayout);
  const spin = useMotionValue(0);
  const drag = useRef({ active: false, lastX: 0, vel: 0, moved: 0 });
  const paused = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(true);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const items = IDS.map((id, i) => {
    const m = MODULES.find((x) => x.id === id);
    return { id, title: m?.title ?? id, line: m?.features[0]?.name ?? '', accent: ACCENTS[i % ACCENTS.length], href: moduleHref(id), Icon: ICONS[id] };
  });

  // Only spin while on screen: no point animating a carousel nobody can see.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Momentum after a drag, then a slow idle turn.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible.current) return;
      if (!drag.current.active) {
        drag.current.vel *= 0.94;
        const base = paused.current || hovering.current || reduce ? 0 : 6;
        spin.set(spin.get() + drag.current.vel * (dt * 60) + base * dt);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spin, reduce]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lastX: e.clientX, vel: 0, moved: 0 };
    paused.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    drag.current.moved += Math.abs(dx);
    drag.current.vel = dx * 0.35;
    spin.set(spin.get() + dx * 0.35);
  };
  const onUp = () => {
    drag.current.active = false;
    paused.current = false;
  };

  const open = (href: string, moved: number) => {
    if (moved > 6) return;
    routerRef.current.push(href);
  };

  return (
    <div className="w-full">
      {!fixedLayout && <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {LAYOUTS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLayout(l)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
              layout === l ? 'bg-[#0f2a4a] text-white' : 'bg-white text-[#4a5a70] border border-[#dbe4f0] hover:text-[#026dde]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>}

      <div
        ref={wrap}
        onPointerEnter={() => { hovering.current = true; }}
        className="relative w-full select-none overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_40%,#17365f,#071325)] [perspective:1800px]"
        style={{ height, touchAction: 'pan-y' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={() => { hovering.current = false; onUp(); }}
      >
        {/* Centre piece sits behind the cards, so the modules pass in front of it. */}
        {centre && <div className="pointer-events-none absolute inset-0">{centre(spin)}</div>}
        <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', rotateY: spin }}>
          {items.map((it, i) => {
            const p = poseFor(layout, i);
            return (
              <motion.div
                key={it.id}
                className="absolute left-1/2 top-1/2"
                style={{ width: CW, height: CH, marginLeft: -CW / 2, marginTop: -CH / 2, transformStyle: 'preserve-3d' }}
                animate={{ rotateY: p.outerY, rotateX: p.outerX }}
                transition={SPRING}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }}
                  animate={{ x: p.innerX, y: p.innerY, z: p.innerZ }}
                  transition={SPRING}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => open(it.href, drag.current.moved)}
                >
                  <div
                    className="flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 p-3.5 text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
                    style={{ background: `linear-gradient(165deg, ${it.accent} 0%, #0b1f3a 100%)`, backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/25 text-white">
                        <it.Icon className="h-[18px] w-[18px]" />
                      </span>
                    </div>
                    <div>
                      <p className="line-clamp-2 font-display text-base font-bold leading-tight">{it.title}</p>
                      <p className="mt-1.5 truncate text-[11px] text-white/70">{it.line}</p>
                    </div>
                    <span className="self-start rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-semibold text-white">Open module →</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <p className="mt-3 text-center text-xs text-[#4a5a70]">Drag to spin · click a module to open it</p>
    </div>
  );
}
