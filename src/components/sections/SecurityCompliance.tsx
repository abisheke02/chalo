'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, FileCheck, Lock, Scale, ShieldCheck } from 'lucide-react';

const PILLARS = [
  { icon: FileCheck, title: 'Transparency', description: 'Clear disclosure of what is collected and why.', tile: 'bg-[#dbe9fd] text-[#026dde]' },
  { icon: Lock, title: 'Security', description: 'Safeguards built into the platform.', tile: 'bg-[#fdeccb] text-[#d97706]' },
  { icon: Scale, title: 'Accountability', description: 'An audit trail for every access.', tile: 'bg-[#d6f3e1] text-[#16a34a]' },
];
const POINTS = ['Built around the DPDP Act, 2023 and the DPDP Rules, 2025', 'ISO 27001:2022 certified', 'Every access to personal data is recorded in an audit trail'];

export default function SecurityCompliance() {
  return (
    <section className="py-12 lg:py-16 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-2 md:p-4">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-0">
            <div className="md:border-r md:border-[#e6edf7] md:pr-10">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Data Protection
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-heading mb-4">
                Compliant with India&apos;s DPDP Act, 2023
              </h2>
              <ul className="mb-6 space-y-2.5">
                {POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-body">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Button asChild className="rounded-full bg-[#026dde] px-6 text-white hover:bg-[#0258b5]">
                <Link href="/security">
                  How We Protect Data
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1 md:pl-10">
              {PILLARS.map((p, i) => {
                return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl bg-card border border-border p-4"
                >
                  <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${p.tile}`}>
                    <p.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading">{p.title}</h3>
                    <p className="text-sm text-body">{p.description}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
