'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { site } from '@/config/site';
import { WhatsAppLink } from '@/components/lp/LandingCta';
import { useTranslations } from 'next-intl';
import ModuleCarousel from '@/components/preview/ModuleCarousel';
import CampusCentre from '@/components/preview/CampusCentre';
import Reveal from '@/components/preview/Reveal';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function HeroSection() {
  // Copy comes from messages/{locale}.json under "Hero".
  const t = useTranslations('Hero');
  // Light parallax: the copy drifts up a little, the carousel down.
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const copyY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : -30]);
  const carouselY = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 40]);

  return (
    <section className="relative overflow-hidden pt-16 bg-[linear-gradient(180deg,var(--hero-from)_0%,var(--background)_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-8 lg:gap-12 py-12 lg:py-20">
        <motion.div style={{ y: copyY }} className="max-w-xl">
          <motion.p {...fadeUp(0)} className="flex items-center gap-3 text-sm font-medium text-subtle">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {t('eyebrow')}
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 font-display text-[2.6rem] sm:text-6xl lg:text-[4.1rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-heading"
          >
            <span className="block text-balance">{t('titleLead')}</span>
            <span className="block text-balance text-primary">{t('titleAccent')}</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 text-lg text-body leading-relaxed max-w-md">
            {t('subtitle')}
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button asChild size="lg" className="h-12 px-7 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold group">
              <Link href="/contact#contact-form">
                {t('ctaPrimary')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Link href="#features" className="group inline-flex items-center gap-1.5 text-base font-semibold text-heading hover:text-primary transition-colors">
              {t('ctaSecondary')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <WhatsAppLink className="inline-flex items-center gap-2 text-base font-semibold text-heading hover:text-primary transition-colors">Chat on WhatsApp</WhatsAppLink>
          </motion.div>

          <motion.p {...fadeUp(0.32)} className="mt-6 text-sm font-medium text-subtle">
            Used by {site.schoolsCount} schools <span aria-hidden="true">·</span> ISO 27001:2022 certified
          </motion.p>
        </motion.div>

        {/* The carousel is laid out at full size and scaled down to fit its column. */}
        <motion.div style={{ y: carouselY }}>
        <Reveal delay={0.25} y={0} scale={0.94} duration={0.8} className="relative h-[300px] w-full overflow-hidden sm:h-[380px] lg:h-[440px]">
          <div className="absolute left-1/2 top-1/2 w-[1000px] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.34] sm:scale-[0.46] lg:scale-[0.66]">
            <ModuleCarousel fixedLayout defaultLayout="barrel" height={640} centre={(spin) => <CampusCentre spin={spin} />} />
          </div>
        </Reveal>
        </motion.div>
      </div>
    </section>
  );
}
