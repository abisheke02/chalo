'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Smartphone, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { moduleHref } from '@/lib/module-links';

// Tracks the cursor position over a card as CSS custom properties, driving
// the .spotlight radial-glow effect defined in globals.css.
function handleSpotlightMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
}

const APPS = [
  {
    icon: GraduationCap,
    role: 'Parent & Student App',
    href: moduleHref('parent-app'),
    name: 'Chaloschools',
    desc: 'Attendance, fees, results and school updates.',
    color: 'from-[#026dde] to-[#024fb3]',
  },
  {
    icon: Smartphone,
    role: 'Teacher App',
    href: '/solutions/role/teachers',
    name: 'AnsApp',
    desc: 'Attendance, grading and parent messages on the go.',
    color: 'from-[#f59e0b] to-[#d97706]',
  },
  {
    icon: ShieldCheck,
    role: 'Management App',
    href: '/solutions/role/school-owners',
    name: 'C-365',
    desc: 'Live dashboards and approvals, anywhere.',
    color: 'from-[#10b981] to-[#059669]',
  },
];

export default function OurApps() {
  return (
    <section id="our-apps" className="py-12 lg:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-10">
          <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">Mobile Apps</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-4">An App for Every Role</h2>
          <p className="text-lg text-body">Dedicated apps for parents, teachers and management.</p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6">
          {APPS.map((app, i) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={app.href}
                onMouseMove={handleSpotlightMove}
                className="group spotlight flex flex-col h-full bg-surface-2 rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                <app.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-1">{app.name}</p>
              <h3 className="text-lg font-bold text-heading mb-2">{app.role}</h3>
              <p className="text-sm text-subtle leading-relaxed mb-4">{app.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
