'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Bot, Bus, CalendarCheck, GraduationCap, IndianRupee, Mic, Search, ShieldCheck, Users } from 'lucide-react';
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

// Home hero option "pre2": a hero in the style of a smart-board home screen. A big screen in the middle with a
// search bar and app tiles, buttons underneath on a clear wall, and a quiet classroom around it (windows with
// light, desks along the floor). Everything is drawn in the site's blues, so no photo is needed. Everything on
// the screen is a mock-up.

const PROMPTS = [
  'Which class has the lowest attendance today?',
  'Who has not paid fees this month?',
  'Show Class 8 results by subject',
  'Where is bus 12 right now?',
];

const TILES = [
  { icon: Users, label: 'Students', href: '/features/student', from: '#4aa3ff', to: '#026dde' },
  { icon: IndianRupee, label: 'Fees', href: '/features/fees', from: '#38c6a0', to: '#0f9d78' },
  { icon: CalendarCheck, label: 'Attendance', href: '/features/attendance', from: '#7aa7ff', to: '#3b6fe0' },
  { icon: GraduationCap, label: 'Exams', href: '/features/exams', from: '#ffb347', to: '#f08a00' },
  { icon: Bus, label: 'Transport', href: '/features/transport', from: '#5cc8ff', to: '#0b8fd6' },
  { icon: Bot, label: 'AI Secretary', href: '/features/ai-secretary', from: '#9b8cff', to: '#5b45e0' },
];

// The room: a soft wall with light, a tall window at each edge on wide screens, and a row of desks along the
// floor. Nothing sits behind the text or the buttons.
function Classroom({ photo }: { photo?: string }) {
  // A real photo (public/images/hero-classroom.jpg): full width behind the board, with a light wash so the buttons stay readable.
  // If the file is missing, the soft blue background shows instead.
  if (photo) {
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#dbe8f5]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,248,254,0.22)_0%,rgba(231,240,252,0)_50%,rgba(220,230,244,0.18)_100%)]" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#d3deea]">
      {/* the back wall: a soft vertical fall-off, a fine grain so it is not flat, and light from the window side */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#eaf0f6_0%,#d8e2ed_52%,#c5d1df_100%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.22] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg">
        <filter id="ch-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ch-grain)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_28%,rgba(255,255,255,0.75),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgba(255,255,255,0.35),transparent_60%)]" />

      {/* the left side wall, turned away from us, with a window in it */}
      <div className="absolute left-0 top-0 hidden h-[88%] w-[17%] lg:block" style={{ clipPath: 'polygon(0 0, 100% 7%, 100% 93%, 0 100%)', background: 'linear-gradient(90deg,#b8c6d8 0%,#cfdae7 70%,#d9e3ee 100%)' }} />
      <div className="absolute left-[1.2%] top-[15%] hidden h-[48%] w-[11.5%] lg:block [transform-origin:left_center] [transform:perspective(520px)_rotateY(17deg)]">
        <div className="absolute inset-0 rounded-sm bg-[#f7f9fc] shadow-[0_18px_40px_-14px_rgba(15,42,74,0.45),inset_0_0_0_2px_rgba(255,255,255,0.9)]" />
        <div className="absolute inset-[7px] overflow-hidden rounded-[2px] bg-[linear-gradient(180deg,#bcdcf7_0%,#e4f1fc_58%,#cfe3c9_100%)] shadow-[inset_0_3px_10px_rgba(15,42,74,0.28)]">
          <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[radial-gradient(ellipse_at_30%_100%,rgba(86,140,86,0.55),transparent_65%),radial-gradient(ellipse_at_75%_100%,rgba(70,120,80,0.5),transparent_60%)]" />
          <div className="absolute -left-[20%] top-0 h-full w-[60%] -skew-x-12 bg-gradient-to-r from-white/55 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-[#f7f9fc] shadow-[0_0_4px_rgba(15,42,74,0.25)]" />
          <div className="absolute inset-x-0 top-[52%] h-[6px] bg-[#f7f9fc] shadow-[0_0_4px_rgba(15,42,74,0.25)]" />
        </div>
        <div className="absolute -bottom-2 -left-1 -right-1 h-3 rounded-sm bg-gradient-to-b from-[#fbfcfe] to-[#d5dfea] shadow-[0_6px_10px_-4px_rgba(15,42,74,0.4)]" />
      </div>
      {/* sunlight from the window falling across the wall and floor */}
      <div className="absolute left-[9%] top-[16%] hidden h-[78%] w-[20%] -skew-x-[18deg] bg-gradient-to-b from-white/55 via-white/25 to-transparent blur-2xl lg:block" />

      {/* the right side wall, with a wooden door and a tall cabinet */}
      <div className="absolute right-0 top-0 hidden h-[88%] w-[17%] lg:block" style={{ clipPath: 'polygon(0 7%, 100% 0, 100% 100%, 0 93%)', background: 'linear-gradient(270deg,#aebdd0 0%,#c6d3e2 70%,#d3deea 100%)' }} />
      <div className="absolute right-[1.6%] top-[14%] hidden h-[63%] w-[8.5%] lg:block [transform-origin:right_center] [transform:perspective(520px)_rotateY(-14deg)]">
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#c8a47a] to-[#b48a5c] shadow-[0_18px_40px_-14px_rgba(15,42,74,0.5),inset_0_0_0_3px_rgba(120,88,52,0.5)]" />
        <div className="absolute inset-x-[14%] top-[8%] h-[36%] rounded-[2px] bg-[#bb9367]/60 shadow-[inset_0_2px_5px_rgba(80,52,24,0.35)]" />
        <div className="absolute inset-x-[14%] bottom-[8%] h-[38%] rounded-[2px] bg-[#bb9367]/60 shadow-[inset_0_2px_5px_rgba(80,52,24,0.35)]" />
        <div className="absolute left-[8%] top-[52%] h-3 w-3 rounded-full bg-gradient-to-br from-[#e8e3d8] to-[#8d8575] shadow-md" />
      </div>
      <div className="absolute bottom-[17%] right-[11%] hidden h-[15%] w-[13%] lg:block">
        <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-t-sm bg-gradient-to-b from-[#d3b88f] to-[#b99a6c] shadow-[0_14px_24px_-10px_rgba(15,42,74,0.45)]" />
        <div className="absolute bottom-[72%] left-[6%] flex items-end gap-[3px]">
          {[['#1d6fd6', 34], ['#0f2a4a', 40], ['#5aa7f2', 30], ['#2d8c6a', 38], ['#e0a02a', 32], ['#8c5ad0', 36]].map(([c, h], i) => (
            <span key={i} className="block w-[9px] rounded-t-[1px] shadow-sm" style={{ background: c as string, height: h as number }} />
          ))}
        </div>
      </div>

      {/* the floor: planks that run away from us, a skirting board, and desks standing on it with shadows */}
      <div className="absolute inset-x-0 bottom-0 h-[130px] overflow-hidden lg:h-[104px]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#bcc8d6] to-[#a0b0c3]" />
        <div className="absolute -inset-x-[40%] top-0 h-[360%] origin-top [transform:perspective(220px)_rotateX(52deg)] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0_2px,transparent_2px_88px),repeating-linear-gradient(0deg,rgba(15,42,74,0.07)_0_2px,transparent_2px_120px)]" />
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#f4f7fb] to-[#bfcbd9] shadow-[0_3px_6px_rgba(15,42,74,0.25)]" />
        <svg className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1600 130" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="ch-desk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6efe2" />
              <stop offset="1" stopColor="#d9c9ac" />
            </linearGradient>
            <linearGradient id="ch-chair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d3d66" />
              <stop offset="1" stopColor="#0f2a4a" />
            </linearGradient>
          </defs>
          {[60, 420, 780, 1140, 1500].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="124" rx="110" ry="9" fill="rgba(15,42,74,0.22)" />
              <rect x={x - 76} y="66" width="8" height="60" fill="#8e9db2" />
              <rect x={x + 68} y="66" width="8" height="60" fill="#8e9db2" />
              <rect x={x - 90} y="52" width="180" height="15" rx="4" fill="url(#ch-desk)" />
              <rect x={x - 90} y="52" width="180" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
              <rect x={x - 60} y="12" width="120" height="36" rx="11" fill="url(#ch-chair)" />
            </g>
          ))}
        </svg>
      </div>

      {/* the corners of the room are a little darker, as in a photograph */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_52%,rgba(15,42,74,0.2)_100%)]" />
    </div>
  );
}

export default function ClassroomHero({ copy = DEFAULT_COPY, topPad = false, photo }: { copy?: ClassroomHeroCopy; topPad?: boolean; photo?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  // On laptops and desktops the whole hero is shrunk (never enlarged) so it fits the window's height at 100% zoom:
  // the headline board, the buttons and the proof line are all in view without scrolling. On phones and tablets it is
  // laid out at its natural size and the page scrolls as usual.
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ s: 1, h: 0 });
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const calc = () => {
      if (window.innerWidth < 1024) {
        setFit((f) => (f.s === 1 && f.h === 0 ? f : { s: 1, h: 0 }));
        return;
      }
      const h = el.offsetHeight; // the natural height: a transform does not change it
      const s = Math.max(0.55, Math.min(1, window.innerHeight / h));
      setFit((f) => (Math.abs(f.s - s) < 0.002 && f.h === h ? f : { s, h }));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, []);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % PROMPTS.length), 3200);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[680px] sm:min-h-[740px] lg:min-h-0" style={fit.h ? { height: fit.h * fit.s } : undefined}>
        <Classroom photo={photo} />

        <div ref={inner} style={fit.s < 1 ? { transform: `scale(${fit.s})`, transformOrigin: 'top center' } : undefined} className={`relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-40 sm:px-6 ${topPad ? 'pt-24 sm:pt-28' : 'pt-12 sm:pt-16'}`}>
          {copy.eyebrow && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-[#0f2a4a] shadow-sm backdrop-blur"
            >
              {copy.eyebrow}
            </motion.p>
          )}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className={`relative w-full max-w-[820px] ${copy.eyebrow ? 'mt-6' : ''}`}
          >
            <div className="rounded-[20px] bg-[#1b2433] p-2.5 shadow-[0_50px_90px_-35px_rgba(15,42,74,0.6)] sm:p-3">
              <div className="relative overflow-hidden rounded-[14px] bg-[#0b1a33] px-5 pb-8 pt-9 sm:px-12 sm:pb-11 sm:pt-12">
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(110deg,transparent_20%,rgba(2,109,222,0.55)_45%,rgba(120,200,255,0.5)_55%,transparent_80%)] blur-xl" />
                <div aria-hidden="true" className="absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-[#4aa3ff]/20 blur-3xl" />
                <h1 className="relative text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
                  <span className="block text-balance">{copy.lead}</span>
                  <span className="block text-balance text-[#6db4ff]">{copy.accent}</span>
                </h1>
                {copy.subtitle && <p className="relative mx-auto mt-4 max-w-xl text-center text-sm font-medium leading-relaxed text-white/80 sm:text-base">{copy.subtitle}</p>}

                <Link
                  href="/features/ai-secretary"
                  aria-label="Ask AI Secretary. Example: Which class has the lowest attendance today?"
                  className="relative mx-auto mt-7 flex max-w-[560px] items-center gap-3 rounded-full bg-white px-5 py-3.5 text-left shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
                >
                  <Search className="h-4 w-4 shrink-0 text-[#026dde]" aria-hidden="true" />
                  <span className="relative h-5 min-w-0 flex-1 overflow-hidden text-sm text-[#4a5a70]">
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

                <ul className="relative mt-8 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6">
                  {TILES.map((t, k) => (
                    <motion.li
                      key={t.label}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + k * 0.06, ease: EASE }}
                    >
                      <Link href={t.href} className="group flex flex-col items-center gap-2">
                        <span
                          className="grid h-14 w-14 place-items-center rounded-2xl text-white shadow-md transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:scale-95 sm:h-16 sm:w-16"
                          style={{ background: `linear-gradient(145deg, ${t.from}, ${t.to})` }}
                        >
                          <t.icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-semibold text-white/90 sm:text-xs">{t.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            <div aria-hidden="true" className="mx-auto mt-2 h-3 w-[70%] rounded-[50%] bg-[#0f2a4a]/15 blur-md" />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link href="/contact#contact-form" className="inline-flex items-center gap-2 rounded-full bg-[#026dde] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(2,109,222,0.7)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">
              {copy.primary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={copy.secondaryHref} className="inline-flex items-center rounded-full border border-[#0f2a4a]/20 bg-white px-8 py-3.5 text-sm font-semibold text-[#0f2a4a] shadow-sm transition-[border-color,transform] duration-150 ease-out hover:border-[#026dde] active:scale-[0.97]">
              {copy.secondary}
            </Link>
            {copy.whatsapp && <WhatsAppLink className="inline-flex items-center gap-2 rounded-full border border-[#0f2a4a]/20 bg-white px-7 py-3.5 text-sm font-semibold text-[#0f2a4a] shadow-sm transition-[border-color,transform] duration-150 ease-out hover:border-[#16a34a] active:scale-[0.97]">Chat on WhatsApp</WhatsAppLink>}
          </motion.div>
          {copy.proof && (
            <p className={`mt-5 flex items-center gap-2 text-sm font-medium text-[#4a5a70] ${photo ? 'rounded-full bg-white/85 px-4 py-1.5 backdrop-blur' : ''}`}>
              <ShieldCheck className="h-4 w-4 text-[#026dde]" aria-hidden="true" />
              {copy.proof}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
