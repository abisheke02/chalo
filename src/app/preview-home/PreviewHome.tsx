'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import ModuleCarousel from '@/components/preview/ModuleCarousel';
import CampusCentre from '@/components/preview/CampusCentre';
import ScrollStack from '@/components/preview/ScrollStack';
import Reveal from '@/components/preview/Reveal';
import HorizontalModules from '@/components/preview/HorizontalModules';
import AskYourSchool from '@/components/preview/AskYourSchool';
import ClassroomHero from '@/components/preview/ClassroomHero';

// Preview homepage: hero with the barrel carousel around the campus (option C),
// then the scroll-stack sequence (option D). Copy follows the site's wording.

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Modules', href: '/product' },
  { label: 'Solutions', href: '/solutions/state-cbse' },
  { label: 'Resources', href: '/blog' },
  { label: 'Company', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
];

export default function PreviewHome() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  // Reading-progress bar, smoothed with a spring.
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  // Header slides away on the way down and returns on the way up.
  const [hideHeader, setHideHeader] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const diff = y - (scrollY.getPrevious() ?? 0);
    if (y < 120) setHideHeader(false);
    else if (diff > 4) setHideHeader(true);
    else if (diff < -4) setHideHeader(false);
  });
  // Light parallax: the copy drifts slower than the carousel.
  const copyY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : -30]);
  const carouselY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 40]);

  return (
    <main className="min-h-screen bg-[#f4f8fd] text-[#0f2a4a]">
      <motion.div aria-hidden style={{ scaleX: progress, originX: 0 }} className="fixed inset-x-0 top-0 z-30 h-[3px] bg-[#026dde]" />
      <motion.header
        animate={{ y: hideHeader && !reduce ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="sticky top-0 z-20 border-b border-[#dbe4f0] bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-[#026dde]">chalo</Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#374151] lg:flex">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="transition-colors duration-150 hover:text-[#026dde]">{n.label}</Link>
            ))}
          </nav>
          <Link href="/contact#contact-form" className="rounded-full bg-[#026dde] px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">
            Book a Demo
          </Link>
        </div>
      </motion.header>

      <ClassroomHero />

      <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-4 lg:pt-14">
        <motion.div style={{ y: copyY }} className="text-center lg:text-left">
          <Reveal><p className="text-sm font-medium text-[#4a5a70]">School ERP for CBSE, IB, Cambridge and State Boards</p></Reveal>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0f2a4a] md:text-6xl">
            <Reveal delay={0.08} y={22}><span className="block">Your entire school.</span></Reveal>
            <Reveal delay={0.18} y={22}><span className="block text-[#026dde]">One platform.</span></Reveal>
          </h1>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#4a5a70] lg:mx-0">
              Admissions, fees, attendance, examinations and parent communication, managed in one secure system.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link href="/contact#contact-form" className="rounded-full bg-[#026dde] px-7 py-3.5 font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#0258b8] active:scale-[0.97]">Book a Demo</Link>
            <Link href="/product" className="rounded-full border border-[#dbe4f0] bg-white px-7 py-3.5 font-semibold text-[#0f2a4a] transition-[border-color,transform] duration-150 ease-out hover:border-[#026dde] active:scale-[0.97]">Explore Modules</Link>
          </div>
          </Reveal>
        </motion.div>

        {/* The carousel is laid out at full size and scaled down to fit its column. */}
        <motion.div style={{ y: carouselY }}>
        <Reveal delay={0.25} y={0} scale={0.94} duration={0.8} className="relative h-[300px] w-full overflow-hidden sm:h-[380px] lg:h-[440px]">
          <div className="absolute left-1/2 top-1/2 w-[1000px] -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.34] sm:scale-[0.46] lg:scale-[0.66]">
            <ModuleCarousel fixedLayout defaultLayout="barrel" height={640} centre={(spin) => <CampusCentre spin={spin} />} />
          </div>
        </Reveal>
        </motion.div>
      </section>

      <AskYourSchool />

      <HorizontalModules />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">Why schools choose ChaloSchools</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold">One sequence, from problem to go-live</h2>
        </Reveal>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
        <ScrollStack />
      </section>

      <footer className="border-t border-[#dbe4f0] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-[#4a5a70] sm:px-6">
          <span className="font-display text-lg font-extrabold text-[#026dde]">chalo</span>
          <span>© ChaloSchools · Inspace Edu Solutions Private Limited</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#026dde]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#026dde]">Terms</Link>
            <Link href="/security" className="hover:text-[#026dde]">Security</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
