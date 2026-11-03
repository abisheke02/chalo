'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus, IndianRupee, ClipboardCheck, FileBarChart, CalendarDays,
  Users, BookOpen, Bus, MessageCircle, ArrowRight, GraduationCap, Package, Wallet, Bot, TrendingUp,
} from 'lucide-react';
import { useSiteContent, getContentValue } from './SiteContentProvider';

import IntegrationsStrip from './IntegrationsStrip';

import { moduleHref } from '@/lib/module-links';

type ModuleBadge = 'Popular' | 'New' | 'AI Powered' | 'Most Used' | 'Add-on' | null;
type Category = 'Academics' | 'Administration' | 'Finance' | 'Communication' | 'Analytics' | 'Add-ons';

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
  desc: string;
  id: string;      // module id — the link comes from moduleHref() so it matches the menu
  color: string;   // icon gradient
  accent: string;  // hex for top border + accents
  tag: ModuleBadge;
  categories: Category[]; // a module can belong to multiple tabs
}

const BLUE = '#026dde';
const AMBER = '#f59e0b';

// Per-category color identity — every module inherits its icon gradient + accent
// from its category, so modules are visually grouped by domain.
const CATEGORY_COLORS: Record<Category, { gradient: string; accent: string }> = {
  Academics:      { gradient: 'from-[#026dde] to-[#024fb3]', accent: '#026dde' }, // blue
  Administration: { gradient: 'from-[#6366f1] to-[#4f46e5]', accent: '#6366f1' }, // indigo
  Finance:        { gradient: 'from-[#f59e0b] to-[#d97706]', accent: '#f59e0b' }, // amber
  Communication:  { gradient: 'from-[#10b981] to-[#059669]', accent: '#10b981' }, // emerald
  Analytics:      { gradient: 'from-[#0891b2] to-[#0e7490]', accent: '#0891b2' }, // cyan
  'Add-ons':      { gradient: 'from-[#e11d48] to-[#be123c]', accent: '#e11d48' }, // rose
};

// Standard modules (8) + add-on modules (6) — matches the official ChaloSchools product brochure.
const features: FeatureItem[] = [
  { icon: <UserPlus className="w-6 h-6" />, label: 'Admission Management', desc: 'Online applications and enquiry tracking.', id: 'admissions', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: null, categories: ['Administration'] },
  { icon: <GraduationCap className="w-6 h-6" />, label: 'Student Management', desc: 'Complete student records in one place.', id: 'student', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: null, categories: ['Academics'] },
  { icon: <Users className="w-6 h-6" />, label: 'Staff Management', desc: 'Staff records, roles and access control.', id: 'staff', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: null, categories: ['Administration'] },
  { icon: <IndianRupee className="w-6 h-6" />, label: 'Fee Management', desc: 'Collection, reminders and reconciliation.', id: 'fees', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: 'Most Used', categories: ['Finance'] },
  { icon: <CalendarDays className="w-6 h-6" />, label: 'AI Powered Timetable & Scheduling', desc: 'Conflict-free schedules and substitutions.', id: 'timetable', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: 'AI Powered', categories: ['Academics'] },
  { icon: <ClipboardCheck className="w-6 h-6" />, label: 'Attendance Management', desc: 'Biometric, RFID and mobile attendance.', id: 'attendance', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: null, categories: ['Academics'] },
  { icon: <FileBarChart className="w-6 h-6" />, label: 'Academic & Examination', desc: 'Assessments, report cards and analytics.', id: 'exams', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: 'Popular', categories: ['Academics'] },
  { icon: <MessageCircle className="w-6 h-6" />, label: 'Communication Management', desc: 'WhatsApp, SMS and voice messaging.', id: 'communication', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: null, categories: ['Communication'] },
  { icon: <Package className="w-6 h-6" />, label: 'Academic Inventory Tracking', desc: 'Real-time tracking of academic stock.', id: 'inventory', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: 'Add-on', categories: ['Add-ons', 'Analytics'] },
  { icon: <Wallet className="w-6 h-6" />, label: 'Payroll Management', desc: 'Salaries with PF, ESI and TDS compliance.', id: 'payroll', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: 'Add-on', categories: ['Add-ons'] },
  { icon: <BookOpen className="w-6 h-6" />, label: 'Library Management', desc: 'Cataloguing, issues and returns.', id: 'library', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: 'Add-on', categories: ['Add-ons'] },
  { icon: <Bus className="w-6 h-6" />, label: 'Transport Management', desc: 'GPS tracking and route management.', id: 'transport', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: 'Add-on', categories: ['Add-ons'] },
  { icon: <TrendingUp className="w-6 h-6" />, label: 'Inspace Performance Insights', desc: 'School-wide academic analytics.', id: 'performance-insights', color: 'from-[#026dde] to-[#024fb3]', accent: BLUE, tag: 'Add-on', categories: ['Analytics', 'Add-ons'] },
  { icon: <Bot className="w-6 h-6" />, label: 'AI Secretary', desc: 'An AI assistant for school administration.', id: 'ai-secretary', color: 'from-[#f59e0b] to-[#d97706]', accent: AMBER, tag: 'Add-on', categories: ['Add-ons'] },
];

const CATEGORIES: ('All' | Category)[] = ['All', 'Academics', 'Administration', 'Finance', 'Communication', 'Analytics', 'Add-ons'];

const BADGE_STYLES: Record<Exclude<ModuleBadge, null>, string> = {
  'Popular': 'bg-emerald-100 text-emerald-700',
  'New': 'bg-blue-100 text-blue-700',
  'AI Powered': 'bg-purple-100 text-purple-700',
  'Most Used': 'bg-amber-100 text-amber-700',
  'Add-on': 'bg-muted text-muted-foreground',
};

// Tracks the cursor position over a card as CSS custom properties, driving
// the .spotlight radial-glow effect defined in globals.css.
function handleSpotlightMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
}

export default function FeatureHighlights({ showIntegrations = true }: { showIntegrations?: boolean }) {
  const { content } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');

  const badge = getContentValue(content, 'features_badge', 'Modules');
  const headline = getContentValue(content, 'features_headline', '14 Modules. One Platform.');
  const subtitle = getContentValue(content, 'features_subtitle', 'Eight core modules and six add-ons, fully integrated from day one.');

  const visibleFeatures = features
    .map((f, i) => ({ ...f, originalIndex: i }))
    .filter((f) => activeCategory === 'All' || f.categories.includes(activeCategory as Category));

  return (
    <section id="features" className="relative py-12 lg:py-16 bg-gradient-to-b from-background to-surface-2 overflow-hidden">
      {/* Faint dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #026dde12 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 rounded-full">{badge}</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">{headline}</h2>
          <p className="text-lg text-body">{subtitle}</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'bg-card text-body border border-border hover:border-primary/40 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleFeatures.map((f, i) => {
              const featureIndex = f.originalIndex + 1;
              const cmsName = getContentValue(content, `feature_${featureIndex}_name`, '');
              const cmsDesc = getContentValue(content, `feature_${featureIndex}_desc`, '');
              const displayName = cmsName || f.label;
              const displayDesc = cmsDesc || f.desc;
              const catColor = CATEGORY_COLORS[f.categories[0]];
              const linkHref = moduleHref(f.id);

              const cardInner = (
                <>
                  {/* Colored top accent border */}
                  <span
                    className="absolute inset-x-0 top-0 h-1 rounded-t-2xl origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ backgroundColor: catColor.accent }}
                  />

                  {/* Badge */}
                  {f.tag && (
                    <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[f.tag]}`}>
                      {f.tag}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${catColor.gradient} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                  >
                    {f.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-heading mb-1.5">{displayName}</h3>

                  {/* One-line description */}
                  <p className="text-sm text-subtle leading-relaxed">{displayDesc}</p>

                  <div
                    className="mt-4 flex items-center gap-1.5 text-sm font-semibold transition-all duration-300"
                    style={{ color: catColor.accent }}
                  >
                    View Module
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </>
              );

              return (
                <motion.div
                  key={f.label}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Link
                    href={linkHref}
                    onMouseMove={handleSpotlightMove}
                    className="group card-shine spotlight relative block h-full rounded-2xl bg-card border border-border p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-transparent"
                  >
                    {cardInner}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {showIntegrations && <IntegrationsStrip />}
      </div>
    </section>
  );
}
