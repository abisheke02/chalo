'use client';

import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import ClassroomHero from '@/components/preview/ClassroomHero';
import HeroDashboard from '@/components/preview/HeroDashboard';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// The home page hero: a classroom with the product screen on the wall (search bar and module
// tiles). The words still come from messages/{locale}.json under "Hero". The earlier carousel
// hero is kept as HeroSection.carousel.tsx.
// `variant` picks the design: 'classroom' (the smart-board classroom, pre2) or 'dashboard' (the product dashboard, pre1).
// 'photo' is the classroom hero on a real photo: put the picture at public/images/hero-classroom.jpg.
export default function HeroSection({ variant = 'photo' }: { variant?: 'classroom' | 'dashboard' | 'photo' }) {
  const t = useTranslations('Hero');
  const { content } = useSiteContent();
  const text = (key: string, fallback: string) => getContentValue(content, key, fallback);
  const copy = {
        lead: text('home_hero_lead', t('titleLead')),
        accent: text('home_hero_accent', t('titleAccent')),
        subtitle: text('home_hero_subtitle', t('subtitle')),
        primary: text('home_hero_cta_primary', t('ctaPrimary')),
        secondary: text('home_hero_cta_secondary', t('ctaSecondary')),
        secondaryHref: '/product',
        proof: text('home_hero_proof', `Used by ${site.schoolsCount} schools · ISO 27001:2022 certified`),
        whatsapp: true,
  };
  return variant === 'dashboard' ? <HeroDashboard topPad copy={copy} /> : <ClassroomHero topPad copy={copy} photo={variant === 'photo' ? '/images/hero-classroom.jpg' : undefined} />;
}
