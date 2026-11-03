'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { moduleDetailHref } from '@/lib/module-links';
import dynamic from 'next/dynamic';

// three.js is client-only and heavy — load a module's scene only when its panel opens.
const ModuleScene = dynamic(() => import('@/components/three/ModuleScene'), { ssr: false });
import {
  CheckCircle2, ArrowRight,
  UserPlus, IndianRupee, ClipboardCheck, CalendarDays, MessageCircle, BarChart3,
  FileText, GraduationCap, Users, Wallet, Package, TrendingUp, Bot, BookOpen, Bus,
} from 'lucide-react';

// Icon components can't cross the Server -> Client Component boundary as props
// (React strips function references), so the modules array lives here instead
// of being passed in from product/page.tsx.
// Ordered to match the header nav's "Core Modules" then "Add-on Modules"
// grouping (see navDropdowns.Features in Header.tsx): the 8 core modules
// first, then Parent & Student App / Reports & Analytics (present here but
// not broken out in the nav's Core/Add-on lists), then the 4 add-ons that
// also appear in this 14-module set (Library and Transport are separate
// standalone feature pages, not part of this list).
const modules = [
  {
    id: 'admissions',
    icon: UserPlus,
    accent: '#026dde',
    title: 'Admissions Management',
    tagline: 'From enquiry to enrolment — fully automated.',
    description:
      'Digitize your entire admissions pipeline. Accept online applications, track enquiries, manage document verification, schedule interviews, and convert leads into enrolled students — all from a single dashboard.',
    features: [
      'Online application forms with custom fields',
      'Document upload and verification workflow',
      'Automated status notifications via SMS/WhatsApp',
      'Enquiry-to-admission conversion tracking',
      'Sibling linking and waitlist management',
      'Bulk admission processing for new academic year',
    ],
    stat: { value: '342', label: 'Applications processed/week' },
  },
  {
    id: 'student',
    icon: GraduationCap,
    accent: '#f59e0b',
    title: 'Student Management',
    tagline: "Every student's full record, always a click away.",
    description:
      'A single, searchable profile for every student — academic history, attendance, fees, and documents in one place. No more digging through physical files or scattered spreadsheets.',
    features: [
      'Centralized student profiles with photo ID',
      'Academic history across all years',
      'Emergency contacts and medical notes',
      'Document storage (birth certificate, transfer certificate, etc.)',
      'Sibling linking across admissions',
      'Bulk promotion to the next academic year',
    ],
    stat: { value: '2,450', label: 'Student profiles managed' },
  },
  {
    id: 'staff',
    icon: Users,
    accent: '#026dde',
    title: 'Staff Management',
    tagline: 'Manage your entire team from one place.',
    description:
      'Complete staff records, roles, and access control — from recruitment to appraisals. Track attendance, leave, and documents without spreadsheets.',
    features: [
      'Centralized staff records and documents',
      'Role-based access control',
      'Staff attendance and leave management',
      'Leave approval workflow',
      'Appraisal and performance tracking',
      'Staff directory with contact details',
    ],
    stat: { value: '45', label: 'Staff members tracked' },
  },
  {
    id: 'fees',
    icon: IndianRupee,
    accent: '#f59e0b',
    title: 'Fee Management',
    tagline: 'Collect fees on time, every time.',
    description:
      'Flexible fee structures for every board type. Set up instalments, apply concessions, send automated reminders, and accept online payments. Real-time dashboards show collection rates and pending dues at a glance.',
    features: [
      'Multi-instalment fee plans with custom due dates',
      'Online payment gateway integration (Razorpay, etc.)',
      'Automated fee reminders via SMS and WhatsApp',
      'Concession and scholarship management',
      'Transport, hostel, and activity fee modules',
      'Detailed financial reports and GST-ready receipts',
    ],
    stat: { value: '₹18.4L', label: 'Collected per month (avg school)' },
  },
  {
    id: 'timetable',
    icon: CalendarDays,
    accent: '#8b5cf6',
    title: 'AI Powered Timetable & Scheduling',
    tagline: 'AI-generated, zero conflicts, instant updates.',
    description:
      'Generate optimal timetables that respect teacher availability, room constraints, and subject load balancing. Substitution management handles last-minute absences without disrupting the school day.',
    features: [
      'AI-powered conflict-free timetable generation',
      'Teacher workload balancing and preferences',
      'Instant substitution assignment on teacher absence',
      'Multi-shift and multi-section support',
      'Export to PDF, print, or digital display boards',
    ],
    stat: { value: '0', label: 'Scheduling conflicts' },
  },
  {
    id: 'attendance',
    icon: ClipboardCheck,
    accent: '#10b981',
    title: 'Attendance Management',
    tagline: 'Mark, track, and notify — in seconds.',
    description:
      'Take daily attendance for students and staff with a single tap. Biometric and RFID integration supported. Parents receive instant notifications when their child is marked absent.',
    features: [
      'One-tap class-wise attendance marking',
      'Biometric and RFID device integration',
      'Instant parent notification on absence',
      'Leave management for staff with approval workflow',
      'Attendance analytics with trend reports',
    ],
    stat: { value: '96.8%', label: 'Average attendance rate' },
  },
  {
    id: 'exams',
    icon: FileText,
    accent: '#8b5cf6',
    title: 'Academic & Examination',
    tagline: 'From exam schedules to report cards, automated.',
    description:
      'Manage the full exam cycle — schedule exams, enter marks digitally, auto-generate report cards, and publish results online. Parents view marks in real time through the app.',
    features: [
      'Flexible exam scheduling',
      'Digital mark entry and grade calculation',
      'Automated report card generation',
      'Online result publication',
      'Performance analytics and trends',
      'Board-specific grading formats (CBSE/ICSE/State)',
    ],
    stat: { value: '360°', label: 'Result analytics per student' },
  },
  {
    id: 'communication',
    icon: MessageCircle,
    accent: '#10b981',
    title: 'Communication Management',
    tagline: 'Reach every parent, every time — WhatsApp, SMS & voice.',
    description:
      'Send announcements, fee reminders, and emergency alerts instantly across WhatsApp, SMS, and voice broadcast — with delivery and read receipts so nothing gets missed.',
    features: [
      'WhatsApp Business API integration',
      'Bulk SMS and voice broadcast',
      'Delivery and read-receipt tracking',
      'Class-wise or school-wide announcements',
      'Automated fee and event reminders',
      'Two-way parent-teacher messaging',
    ],
    stat: { value: '1,842', label: 'Parents reached instantly' },
  },
  {
    id: 'reports',
    icon: BarChart3,
    accent: '#026dde',
    title: 'Reports & Analytics',
    tagline: 'Data-driven decisions, not gut feelings.',
    description:
      'Pre-built and custom reports across every module — fee collection, attendance trends, academic performance, staff metrics. Exportable dashboards that school management committees actually want to read.',
    features: [
      '50+ pre-built reports across all modules',
      'Real-time dashboards for management',
      'Exportable to Excel, PDF, and CSV',
      'Scheduled email reports to stakeholders',
      'Year-over-year comparison and trend analysis',
    ],
    stat: { value: '50+', label: 'Pre-built report templates' },
  },
  {
    id: 'inventory',
    icon: Package,
    accent: '#026dde',
    title: 'Academic Inventory Tracking',
    tagline: 'Track every academic asset, in real time.',
    description:
      'Track lab equipment, sports gear, furniture, and academic stock in real time — know what you have, where it is, and when it needs replenishing.',
    features: [
      'Real-time stock tracking across departments',
      'Low-stock alerts and reorder reminders',
      'Asset assignment and check-in/check-out',
      'Purchase and vendor history',
      'Depreciation tracking for equipment',
      'Barcode/QR-based inventory scanning',
    ],
    stat: { value: '0', label: 'Stockouts this term' },
  },
  {
    id: 'payroll',
    icon: Wallet,
    accent: '#f59e0b',
    title: 'Payroll Management',
    tagline: 'Automated salary processing, zero manual errors.',
    description:
      'Automated salary processing and statutory compliance — PF, ESI, and TDS calculated automatically. Generate payslips in seconds, not days.',
    features: [
      'Automated salary calculation',
      'PF, ESI, and TDS compliance',
      'Digital payslip generation',
      'Loan and advance tracking',
      'Attendance-linked salary deductions',
      'Bank-ready payment files',
    ],
    stat: { value: '0', label: 'Manual calculation errors' },
  },
  {
    id: 'library',
    icon: BookOpen,
    accent: '#10b981',
    title: 'Library Management',
    tagline: 'A modern library — digitized and organized.',
    description:
      'Run your school library with barcode scanning, an online catalog, book issuance/returns, fines, and reservations. Students browse and reserve books right from the app.',
    features: [
      'Digital book catalog with search',
      'Barcode-based issuance and return',
      'Online reservation system',
      'Fine and overdue tracking',
      'Inventory management',
      'Reading progress tracking',
    ],
    stat: { value: '0', label: 'Manual issue registers' },
  },
  {
    id: 'transport',
    icon: Bus,
    accent: '#8b5cf6',
    title: 'Transport Management',
    tagline: 'Track every bus in real time, GPS-enabled.',
    description:
      'GPS-enabled bus tracking, route management, and driver information with real-time notifications to parents. Ensure student safety with live tracking on the parent app.',
    features: [
      'Real-time GPS bus tracking',
      'Route planning and optimization',
      'Parent live tracking on app',
      'Driver and attendant management',
      'Pickup/drop notifications',
      'Fleet maintenance tracking',
    ],
    stat: { value: 'Live', label: 'GPS bus tracking' },
  },
  {
    id: 'performance-insights',
    icon: TrendingUp,
    accent: '#0891b2',
    title: 'Inspace Performance Insights',
    tagline: 'Deep, school-wide analytics — beyond basic reports.',
    description:
      'Go past standard report cards with cross-module analytics — track academic trends, attendance patterns, fee collection health, and staff performance from a single insights dashboard.',
    features: [
      'Cross-module performance dashboards',
      'Academic trend analysis by class and subject',
      'Attendance and fee collection health scores',
      'Staff performance benchmarking',
      'Custom KPI tracking',
      'Exportable insights for management reviews',
    ],
    stat: { value: '360°', label: 'School-wide visibility' },
  },
  {
    id: 'ai-secretary',
    icon: Bot,
    accent: '#e11d48',
    title: 'AI Secretary',
    tagline: 'An AI assistant built exclusively for school management.',
    description:
      "Ask questions in plain language and get instant answers pulled from your school's own data — attendance, fees, admissions, and more — without digging through reports.",
    features: [
      'Natural-language queries across school data',
      'Instant answers on attendance, fees & admissions',
      'Automated daily/weekly summary briefings',
      'Smart alerts for anomalies (e.g. attendance drops)',
      'Available inside the management app',
      "Continuously learns from your school's data",
    ],
    stat: { value: '24/7', label: 'Always-on assistant' },
  },
  {
    id: 'parent-app',
    icon: MessageCircle,
    accent: '#026dde',
    title: 'Parent & Student App',
    tagline: 'Keep parents informed, involved, and happy.',
    description:
      'A dedicated mobile app for parents and students. View attendance, track bus location, check exam results, pay fees, communicate with teachers — all in one place. Reduce the 50+ WhatsApp groups your school currently manages.',
    features: [
      'Real-time attendance and bus tracking',
      'Exam results and progress reports',
      'Fee payment and receipt download',
      'Direct messaging with class teacher',
      'Homework and circular notifications',
      'Event calendar and photo gallery',
    ],
    stat: { value: '1,842', label: 'Active parents connected' },
  },
];

// All the modules as cards that stack as you scroll: each one stays in place while the next slides
// over it (the same effect as "From first enquiry to final report card" on the home page). Every
// card is in the page at all times, so every module stays fully indexable and the pills above
// (and /product#<id> links from the menu) jump straight to a card. Only the card on top loads its
// 3D scene, so there is a single WebGL context at a time; on phones the cards just follow one
// another and show an icon instead of the scene.

// Where a pinned card rests below the top of the window: under the site menu and the name bar.
const PIN = '10.5rem';
const PIN_PX = 168;

// One of the module's feature lines. On large screens it fades up and slides in when the scroll reaches its turn.
function FeatureLine({ text, pin, i, n, animate }: { text: string; pin: MotionValue<number>; i: number; n: number; animate: boolean }) {
  const start = 0.1 + (i / n) * 0.7;
  const opacity = useTransform(pin, [start, start + 0.1], animate ? [0.12, 1] : [1, 1]);
  const x = useTransform(pin, [start, start + 0.1], animate ? [28, 0] : [0, 0]);
  return (
    <motion.li style={{ opacity, x }} className="flex items-start gap-2.5">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--brand)' }} aria-hidden="true" />
      <span className="text-sm text-body">{text}</span>
    </motion.li>
  );
}

// One module, one screen. On large screens the card stays pinned under the name bar while you scroll through its block of the page:
// it rises in as it arrives, its feature lines then appear one after another as you scroll, and it moves on when the block ends.
// Nothing is laid over anything: each block is its own stretch of page. On phones the cards simply follow one another.
function ModuleCard({ mod, current, wide }: { mod: (typeof modules)[number]; i: number; total: number; current: boolean; wide: boolean }) {
  const reduce = useReducedMotion();
  const IconComp = mod.icon;
  const ref = useRef<HTMLDivElement>(null);
  const motionOn = wide && !reduce;
  // arriving: from the block's top entering the bottom of the window to it reaching the pin position
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', `start ${PIN_PX}px`] });
  // pinned: from the pin position to the end of the block
  const { scrollYProgress: pin } = useScroll({ target: ref, offset: [`start ${PIN_PX}px`, 'end end'] });
  const y = useTransform(enter, [0, 1], motionOn ? [90, 0] : [0, 0]);
  const scale = useTransform(enter, [0, 1], motionOn ? [0.93, 1] : [1, 1]);
  const inOpacity = useTransform(enter, [0, 0.6], motionOn ? [0, 1] : [1, 1]);
  const outOpacity = useTransform(pin, [0.9, 1], motionOn ? [1, 0.4] : [1, 1]);
  const opacity = useTransform([inOpacity, outOpacity], ([a, b]: number[]) => a * b);
  const textX = useTransform(enter, [0, 1], motionOn ? [-60, 0] : [0, 0]);
  const picX = useTransform(enter, [0, 1], motionOn ? [60, 0] : [0, 0]);

  return (
    <div id={mod.id} ref={ref} className="scroll-mt-48 md:h-[175svh]">
      <div className="md:sticky" style={wide ? { top: PIN } : undefined}>
        <motion.article
          style={{ y, scale, opacity }}
          className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_50px_-28px_rgba(15,42,74,0.35)] md:h-[calc(100svh-11.5rem)] md:min-h-[400px] md:p-8"
        >
          <div className="grid h-full gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
            <motion.div style={{ x: textX }} className="flex min-h-0 flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-heading">{mod.title}</h3>
              <p className="mt-2 text-base font-medium md:text-lg" style={{ color: 'var(--brand)' }}>{mod.tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">{mod.description}</p>
              <ul className="mt-4 space-y-1.5">
                {mod.features.map((feature, k) => (
                  <FeatureLine key={feature} text={feature} pin={pin} i={k} n={mod.features.length} animate={motionOn} />
                ))}
              </ul>
              {/* Only modules with a dedicated page get a "Learn more" — the rest are fully
                  described right here, so the CTA is a demo. */}
              <Button className="mt-5 self-start rounded-lg font-semibold" style={{ backgroundColor: 'var(--brand)' }} asChild>
                <Link href={moduleDetailHref(mod.id) ?? '/contact#contact-form'}>
                  {moduleDetailHref(mod.id) ? 'Learn More' : 'See It in a Demo'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div style={{ x: picX }} className="relative hidden min-h-[240px] overflow-hidden rounded-2xl bg-[#0b1a33] md:flex">
              {current && wide ? (
                <ModuleScene moduleId={mod.id} className="h-full w-full" />
              ) : (
                <div className="m-auto grid h-24 w-24 place-items-center rounded-3xl bg-white/10 text-white" aria-hidden="true">
                  <IconComp className="h-10 w-10" />
                </div>
              )}
            </motion.div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

// The one-line description of each module, for the hero on the same page.
export const MODULE_COPY: Record<string, { tagline: string; description: string }> = Object.fromEntries(modules.map((m) => [m.id, { tagline: m.tagline, description: m.description }]));
export const MODULE_TAGLINES: Record<string, string> = Object.fromEntries(modules.map((m) => [m.id, m.tagline]));

export default function ModuleExplorer() {
  const stack = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [wide, setWide] = useState(false);

  const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  // Which card is the one in view: the last one whose top has passed the name bar.
  const { scrollY } = useScroll();
  const work = useCallback(() => {
    const root = stack.current;
    if (!root || !root.children.length) return;
    let idx = 0;
    Array.from(root.children).forEach((c, i) => {
      if ((c as HTMLElement).getBoundingClientRect().top <= 12 * remPx()) idx = i;
    });
    setCurrent(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMotionValueEvent(scrollY, 'change', work);
  useEffect(() => {
    work();
    window.addEventListener('resize', work);
    return () => window.removeEventListener('resize', work);
  }, [work]);

  // One click on any name scrolls to that module. On large screens it lands late in the module's block, where the card is pinned and
  // all its feature lines are showing; on phones it lands on the top of the card, just under the name bar.
  const goTo = (i: number, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const pinPx = 10.5 * remPx();
    const cardH = window.innerHeight - 11.5 * remPx();
    const pinned = getComputedStyle(el.firstElementChild as HTMLElement).position === 'sticky';
    const target = pinned ? top - pinPx + 0.82 * (el.offsetHeight - cardH) : top - 12 * remPx();
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  // The 3D scene and the pinned scrolling are for large screens only.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  return (
    <section className="bg-surface-2 py-10 md:py-14" id="modules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">All Modules</h2>
          <p className="text-subtle">Scroll to go through every module, or jump straight to one.</p>
        </div>

        {/* Module names: stay in view while the cards scroll, the one on top is highlighted, one click jumps to any module */}
        <nav aria-label="Modules" className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border bg-surface-2/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-1.5 py-2">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              const on = i === current;
              return (
                <a
                  key={mod.id}
                  href={`#${mod.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(i, mod.id);
                  }}
                  aria-current={on ? 'true' : undefined}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                    on ? 'border-transparent text-white shadow-md' : 'border-border bg-card text-body hover:border-[color-mix(in_srgb,var(--brand)_40%,transparent)]'
                  }`}
                  style={on ? { backgroundColor: 'var(--brand)' } : undefined}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {mod.title}
                </a>
              );
            })}
          </div>
        </nav>

        <div ref={stack} className="space-y-6 md:space-y-0">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} i={i} total={modules.length} current={i === current || i === current + 1} wide={wide} />
          ))}
        </div>
      </div>
    </section>
  );
}
