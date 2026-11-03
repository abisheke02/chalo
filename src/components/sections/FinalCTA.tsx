'use client';

import { Button } from '@/components/ui/button';

import { motion, useReducedMotion } from 'framer-motion';

import { ArrowRight, Phone, Sparkles } from 'lucide-react';

import Link from 'next/link';

// Floating particle positions (independent animations).

const PARTICLES = [

  { left: '8%', top: '30%', size: 6, dur: 7, delay: 0 },

  { left: '22%', top: '70%', size: 4, dur: 9, delay: 1 },

  { left: '40%', top: '20%', size: 5, dur: 8, delay: 0.5 },

  { left: '62%', top: '75%', size: 4, dur: 10, delay: 1.5 },

  { left: '78%', top: '35%', size: 6, dur: 7.5, delay: 0.8 },

  { left: '90%', top: '60%', size: 5, dur: 9.5, delay: 2 },

];

export default function FinalCTA() {

  const reduce = useReducedMotion();

  return (

    <section className="py-12 lg:py-16 bg-brand-gradient text-white relative overflow-hidden">

      {/* Animated background elements */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08),transparent_50%)]" />

      <motion.div

        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}

        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}

        className="absolute top-1/4 right-1/4 w-96 h-96 bg-card rounded-full blur-3xl"

      />

      <motion.div

        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}

        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}

        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#f59e0b] rounded-full blur-[120px]"

      />

      {/* Floating particles (independent animations) */}

      {!reduce && (

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

          {PARTICLES.map((p, i) => (

            <motion.span

              key={i}

              className="absolute rounded-full bg-white/40"

              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}

              animate={{ y: [0, -24, 0], opacity: [0.2, 0.6, 0.2] }}

              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}

            />

          ))}

        </div>

      )}

      {/* Grid pattern */}

      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-8">

          <h2 className="text-3xl lg:text-5xl font-bold leading-tight">

            Ready to Modernise<br />Your School?

          </h2>

          <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">

            Book a demo to see ChaloSchools in action.

          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

            {/* Primary CTA — rotating conic-gradient border + shimmer sweep */}

            <div className="relative inline-flex">
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[#f59e0b] blur-xl"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            <div className="conic-border rounded-full p-[2px] inline-flex relative">

              <Button asChild size="lg" className="relative overflow-hidden text-base px-10 h-13 bg-gradient-to-r from-[#f59e0b] to-[#e88d04] hover:from-[#d97706] hover:to-[#c76f05] text-white rounded-full font-semibold group shadow-lg shadow-[#f59e0b]/25 transition-all hover:shadow-xl hover:shadow-[#f59e0b]/30 hover:-translate-y-0.5">

                <Link href="/contact#contact-form">

                  {/* shimmer sweep */}

                  {!reduce && (

                    <span className="absolute inset-0 -translate-x-full animate-[shine-sweep_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />

                  )}

                  <Sparkles className="w-4 h-4 mr-2 relative" />

                  <span className="relative">Book a Demo</span>

                  <ArrowRight className="w-5 h-5 ml-2 relative group-hover:translate-x-1 transition-transform" />

                </Link>

              </Button>

            </div>
            </div>


            <Button asChild size="lg" className="text-base px-8 h-13 border border-white/20 bg-card/5 text-white hover:bg-card/10 rounded-full backdrop-blur-sm transition-all hover:-translate-y-0.5">

              <a href="tel:+919962228160"><Phone className="w-4 h-4 mr-2" />Talk to Sales</a>

            </Button>

          </div>

          <p className="text-sm text-white/50 pt-2">Free setup and staff training</p>

        </motion.div>

      </div>

    </section>

  );

}

