'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Bot, Bus, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, EyeOff, FileBarChart, FileSpreadsheet, GraduationCap, IndianRupee, MessageCircle, MessageSquareOff, Package, Receipt, ShieldCheck, TrendingUp, UserPlus, Users, Wallet,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import Reveal, { EASE } from '@/components/preview/Reveal';

// Scroll-stack sequence for the homepage. Each card sticks near the top and the
// next one slides over it. Copy is taken from the site's own wording.

const MODULE_ICONS: LucideIcon[] = [UserPlus, GraduationCap, Users, IndianRupee, CalendarDays, ClipboardCheck, FileBarChart, MessageCircle, Package, Wallet, BookOpen, Bus, TrendingUp, Bot];

export default function ScrollStack() {
  return (
    <div className="relative">
      <StackCard index={0} color="#f59e0b" eyebrow="The challenge" title="Running a school shouldn't mean running after paperwork" text="Fee follow-ups are chased by hand, attendance sits in registers, and parents chase teachers across dozens of WhatsApp groups.">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Receipt, label: 'Fee defaulters tracked manually' },
            { icon: FileSpreadsheet, label: 'Attendance and marks in spreadsheets' },
            { icon: MessageSquareOff, label: 'Updates lost in WhatsApp groups' },
            { icon: EyeOff, label: 'No single view for management' },
          ].map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-[#f3d9a4] bg-[#fff8ea] p-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#d97706]" />
                <span className="text-sm font-medium text-[#0f2a4a]">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </StackCard>

      <StackCard index={1} color="#026dde" eyebrow="One platform" title="14 modules. One platform." text="Admissions, fees, attendance, examinations and parent communication share one record, so nobody enters the same data twice.">
        <div className="grid grid-cols-7 gap-2">
          {MODULE_ICONS.map((Icon, i) => (
            <Reveal key={i} y={8} scale={0.8} duration={0.4} delay={i * 0.03}>
              <div className="grid aspect-square place-items-center rounded-xl bg-[#026dde]/10 text-[#026dde]">
                <Icon className="h-5 w-5" />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#4a5a70]">Eight core modules and six add-ons, fully integrated from day one.</p>
      </StackCard>

      <StackCard index={2} color="#10b981" eyebrow="Decisions, not reports" title="Every figure comes with its target" text="Leadership sees each number against its goal, with the action it calls for. Figures shown are illustrative.">
        <div className="rounded-2xl border border-[#dbe4f0] bg-[#f8fbff] p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4a5a70]">Fees collected this month</p>
              <p className="mt-1 font-display text-4xl font-extrabold text-[#0f2a4a]">₹18.4L</p>
            </div>
            <p className="text-sm font-semibold text-[#10b981]">▲ 5.7% vs target ₹17.4L</p>
          </div>
          <div className="relative mt-6 flex h-28 items-end gap-3">
            {[52, 60, 58, 70, 74, 82, 100].map((h, i) => (
              <Bar key={i} h={h} i={i} />
            ))}
            <div className="absolute inset-x-0 border-t-2 border-dashed border-[#f59e0b]" style={{ bottom: '74%' }} />
          </div>
        </div>
      </StackCard>

      <StackCard index={3} color="#8b5cf6" eyebrow="Secure by design" title="Built for personal data" text="Role-based access, an audit trail on every access, and certification against the standards schools are held to.">
        <div className="space-y-3">
          {['ISO 27001:2022 certified', 'Aligned with the DPDP Act, 2023', 'Audit trail on every access to personal data', 'Role-based permissions for every user'].map((t, i) => (
            <Reveal key={t} y={10} delay={i * 0.08}>
              <div className="flex items-center gap-3 rounded-2xl border border-[#dbe4f0] bg-white px-5 py-4">
                <ShieldCheck className="h-5 w-5 text-[#8b5cf6]" />
                <span className="font-medium text-[#0f2a4a]">{t}</span>
                <CheckCircle2 className="ml-auto h-5 w-5 text-[#10b981]" />
              </div>
            </Reveal>
          ))}
        </div>
      </StackCard>

      <StackCard index={4} color="#0891b2" eyebrow="Live in three steps" title="From first call to fully operational" text="A demo for your school, a guided setup with data migration, and go-live with staff training and support.">
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: '1', t: 'Book a demo', d: 'A tailored walkthrough' },
            { n: '2', t: 'Setup and migration', d: 'We move your data' },
            { n: '3', t: 'Go live', d: 'Training and support' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} className="h-full">
              <div className="h-full rounded-2xl bg-[#0891b2]/10 p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0891b2] font-bold text-white">{s.n}</span>
                <p className="mt-4 font-bold text-[#0f2a4a]">{s.t}</p>
                <p className="mt-1 text-sm text-[#4a5a70]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#026dde] px-6 py-3 font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]">
          Book a Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </StackCard>
    </div>
  );
}

// A bar that grows up from the baseline when it scrolls into view.
function Bar({ h, i }: { h: number; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex-1 origin-bottom rounded-t-md bg-[#026dde]"
      style={{ height: `${h}%`, opacity: 0.35 + i * 0.1 }}
      initial={reduce ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
    />
  );
}

function StackCard({ index, eyebrow, title, text, color, children }: { index: number; eyebrow: string; title: string; text: string; color: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const reduce = useReducedMotion();
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.6]);

  return (
    <div ref={ref} className="h-[78vh]">
      <motion.div
        style={{ scale, opacity: dim, top: 96 + index * 22 }}
        className="sticky mx-auto grid h-[60vh] max-w-5xl origin-top grid-cols-1 gap-8 rounded-3xl border border-[#dbe4f0] bg-white p-8 shadow-xl md:grid-cols-[1fr_1.1fr] md:p-10"
      >
        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color }}>
            {String(index + 1).padStart(2, '0')} · {eyebrow}
          </p>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[#0f2a4a]">{title}</h3>
          <p className="mt-4 text-base leading-relaxed text-[#4a5a70]">{text}</p>
          <div className="mt-auto h-1.5 w-20 rounded-full" style={{ background: color }} />
        </div>
        <div className="flex min-h-0 items-center">
          <div className="w-full">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
