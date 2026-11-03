'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { moduleHref } from '@/lib/module-links';
import { Fingerprint, Navigation, Calculator, CreditCard, MessageCircle } from 'lucide-react';

const INTEGRATIONS = [
  { icon: Fingerprint, label: 'Biometric Attendance', href: moduleHref('attendance'), gradient: 'from-[#026dde] to-[#00d4ff]', shadow: 'shadow-[#026dde]/30' },
  { icon: Navigation, label: 'GPS Fleet Tracking', href: moduleHref('transport'), gradient: 'from-[#f59e0b] to-[#fbbf24]', shadow: 'shadow-[#f59e0b]/30' },
  { icon: Calculator, label: 'Tally ERP', href: moduleHref('fees'), gradient: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/30' },
  { icon: CreditCard, label: 'Online Payment Gateway', href: moduleHref('fees'), gradient: 'from-[#8b5cf6] to-[#a78bfa]', shadow: 'shadow-[#8b5cf6]/30' },
  { icon: MessageCircle, label: 'WhatsApp', href: moduleHref('communication'), gradient: 'from-[#0891b2] to-[#22d3ee]', shadow: 'shadow-[#0891b2]/30' },
];

export default function IntegrationsStrip() {
  return (
    // Rendered at the foot of FeatureHighlights rather than as its own band.
    <div className="mt-12 pt-8 border-t border-border">
      <p className="text-center text-xs font-semibold text-subtle uppercase tracking-wider mb-2">Integrates with your existing systems</p>
      <p className="mx-auto mb-5 max-w-2xl text-center text-sm text-subtle">Works with your biometric and RFID devices, GPS bus tracking, Tally, online payments and WhatsApp.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {INTEGRATIONS.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={it.href}
              className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
            >
            <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${it.gradient} flex items-center justify-center shrink-0 shadow-sm ${it.shadow}`}>
              <it.icon className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-medium text-heading">{it.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
