'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Settings, Rocket } from 'lucide-react';
import { useSiteContent, getContentValue } from './SiteContentProvider';

const STEP_ICONS = [CalendarCheck, Settings, Rocket];
const STEP_COLORS = [
  'bg-[#026dde] text-white',
  'bg-[#f59e0b] text-white',
  'bg-emerald-500 text-white',
];
const NODE_COLORS = ['#026dde', '#f59e0b', '#10b981'];

const FALLBACK_STEPS = [
  { title: 'Book a Demo', description: 'A tailored walkthrough for your school.' },
  { title: 'Setup and Migration', description: 'We configure the system and migrate your data.' },
  { title: 'Go Live', description: 'Staff training and ongoing support included.' },
];

export default function ProcessSteps() {
  const { content } = useSiteContent();

  const badge = getContentValue(content, 'process_badge', 'Getting Started');
  const headline = getContentValue(content, 'process_headline', 'Live in Three Steps');
  const subtitle = getContentValue(content, 'process_subtitle', 'A structured onboarding, managed by our team.');

  const steps = FALLBACK_STEPS.map((s, i) => ({
    title: getContentValue(content, `process_step_${i + 1}_title`, s.title),
    description: getContentValue(content, `process_step_${i + 1}_desc`, s.description),
  }));

  return (
    <section className="py-12 lg:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#026dde]/5 rounded-2xl border border-[#026dde]/10 p-6 md:p-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-8">
            <Badge className="mb-3 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">{badge}</Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-heading mb-3">{headline}</h2>
            <p className="text-base text-body">{subtitle}</p>
          </motion.div>

          {/* Steps + animated connector line */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            {/* Glowing connector line — drawn from the beginning on scroll-in (desktop only) */}
            <div className="hidden md:block absolute top-8 left-0 right-0 px-16 pointer-events-none" aria-hidden="true">
              <svg
                className="w-full h-3 overflow-visible"
                viewBox="0 0 100 3"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="processLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#026dde" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="processLineGlow" x="-20%" y="-400%" width="140%" height="900%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Faint base track */}
                <line x1="0" y1="1.5" x2="100" y2="1.5" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />

                {/* Animated glowing line */}
                <motion.line
                  x1="0" y1="1.5" x2="100" y2="1.5"
                  stroke="url(#processLineGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  filter="url(#processLineGlow)"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1.4, ease: 'easeInOut' },
                    },
                  }}
                />

                {/* Continuous traveling glow — a bright light segment looping from step 1 → step 3 */}
                <motion.line
                  x1="0" y1="1.5" x2="100" y2="1.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#processLineGlow)"
                  strokeDasharray="14 100"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: [0, 0.9, 0.9],
                      strokeDashoffset: [114, 0],
                      transition: {
                        strokeDashoffset: { duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6, delay: 1.4 },
                        opacity: { duration: 1.4, delay: 1.4 },
                      },
                    },
                  }}
                />
              </svg>

              {/* Glowing nodes at each step position (0%, 50%, 100% of the line) */}
              {NODE_COLORS.map((color, i) => (
                <motion.span
                  key={i}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${i * 50}%`,
                    width: 16,
                    height: 16,
                    backgroundColor: color,
                    boxShadow: `0 0 0 4px ${color}22, 0 0 12px 2px ${color}88`,
                  }}
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        // Light up roughly as the drawing line reaches each node
                        delay: 0.2 + i * 0.6,
                        duration: 0.45,
                        ease: 'backOut',
                      },
                    },
                  }}
                />
              ))}
            </div>

            <div className="relative grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <motion.div
                    key={step.title}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        // Reveal each step roughly as the line reaches it
                        transition: { delay: 0.3 + i * 0.5, duration: 0.5, ease: 'easeOut' },
                      },
                    }}
                    className="text-center relative group"
                  >
                    <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl ${STEP_COLORS[i]} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-bold text-subtle uppercase tracking-wider mb-2">Step {i + 1}</div>
                    <h3 className="text-lg font-bold text-heading mb-2">{step.title}</h3>
                    <p className="text-sm text-subtle leading-relaxed">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
