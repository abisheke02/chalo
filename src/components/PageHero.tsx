'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Home, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ModuleFeature } from '@/data/module-features';

// three.js is client-only and heavy — the copy paints first, the scene follows.
const ModuleScene = dynamic(() => import('@/components/three/ModuleScene'), { ssr: false });
const CampusScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });

export interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  // A module or page scene id from components/three/module-scenes, or 'campus'.
  scene: string;
  // Three features shown on the scene's interactive objects (not needed for a module's own scene or 'campus').
  features?: ModuleFeature[];
  moduleId?: string;
  actions?: ReactNode;
  children?: ReactNode;
  // Campus hero only: 'stacked' puts the words and buttons in the middle at the top and the campus wide underneath
  // (the default puts the words on the left and the campus on the right). Stacked also shows one name tag for each of seven places.
  layout?: 'split' | 'stacked';
}

// The standard top-of-page hero: copy on the left, an interactive 3D scene
// relevant to the page on the right (stacked on mobile).
// Which menu group a page belongs to, for the breadcrumb of the flat hero.
function groupOf(path: string) {
  const seg = path.split('/')[1] ?? '';
  if (['help', 'news', 'webinars', 'case-studies', 'release-notes', 'blog'].includes(seg)) return 'Resources';
  if (['platform-capabilities', 'managed-it-services', 'pricing'].includes(seg)) return 'Product';
  if (seg.startsWith('school-erp')) return 'Regions';
  return 'Company';
}

// The flat hero used on the information pages (security, about, pricing, resources and so on): a breadcrumb, the headline,
// and an "At a glance" panel with the three features. Module pages and the campus keep the 3D hero.
function FlatHero({ eyebrow, title, subtitle, features, actions, children, path }: PageHeroProps & { path: string }) {
  const cards = (features ?? []).slice(0, 3);
  return (
    <section className="bg-[#f3f7fd] pb-10 pt-24 md:pt-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#4a5a70]">
          <Link href="/" aria-label="Home" className="hover:text-[#026dde]"><Home className="h-4 w-4" /></Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{groupOf(path)}</span>
          {eyebrow && (
            <>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span aria-current="page" className="font-medium text-[#026dde]">{eyebrow}</span>
            </>
          )}
        </nav>
        <div className={`mt-6 grid gap-8 ${cards.length ? 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start' : ''}`}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {eyebrow && <span className="inline-block rounded-full bg-[#dbe9fd] px-3 py-1 text-sm font-semibold text-[#026dde]">{eyebrow}</span>}
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0a1a4a] text-balance sm:text-4xl lg:text-5xl">{title}</h1>
            {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4a5a70]">{subtitle}</p>}
            {actions && <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">{actions}</div>}
            {children}
          </motion.div>
          {cards.length > 0 && (
            <aside aria-label="At a glance" className="rounded-2xl border border-[#dbe5f5] bg-[#eaf2fd] p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#0a1a4a]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe9fd] text-[#026dde]"><Target className="h-5 w-5" aria-hidden="true" /></span>
                At a glance
              </h2>
              <ul className="mt-4 space-y-3">
                {cards.map((c) => (
                  <li key={c.name} className="rounded-xl border border-[#dbe5f5] bg-white p-4">
                    <span className="block font-bold text-[#0a1a4a]">{c.name}</span>
                    {c.line && <span className="mt-0.5 block text-sm leading-relaxed text-[#4a5a70]">{c.line}</span>}
                  </li>
                ))}
              </ul>
              <Link href="/contact#contact-form" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#026dde] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0258b5]">
                Book a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PageHero(props: PageHeroProps) {
  const path = usePathname() ?? '';
  const { eyebrow, title, subtitle, scene, features, moduleId, actions, children, layout = 'split' } = props;
  if (!moduleId && scene !== 'campus' && !path.startsWith('/features/') && !path.startsWith('/mod') && !path.startsWith('/pre') && !path.startsWith('/main')) {
    return <FlatHero {...props} path={path} />;
  }
  if (scene === 'campus' && layout === 'stacked') {
    return (
      <section className="relative overflow-hidden pt-16 bg-[linear-gradient(180deg,var(--hero-from)_0%,var(--background)_100%)] lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 pb-2 pt-8 text-center sm:px-6 lg:px-8 lg:pt-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center">
            {eyebrow && (
              <p className="flex items-center gap-3 text-sm font-medium text-subtle">
                <span className="h-px w-8 bg-primary" aria-hidden="true" />
                {eyebrow}
                <span className="h-px w-8 bg-primary" aria-hidden="true" />
              </p>
            )}
            <h1 className="max-w-6xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-heading text-balance sm:text-5xl lg:text-[2.3rem] xl:text-[2.6rem]">{title}</h1>
            {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">{subtitle}</p>}
            {actions && <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">{actions}</div>}
            {children}
          </motion.div>
        </div>
        {/* the campus, wide, under the words */}
        <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[calc(100svh-9.5rem)] lg:min-h-[420px]">
          <CampusScene wideOffset={0} distance={1.28} zoneMode />
        </div>
      </section>
    );
  }
  return (
    <section className={`relative overflow-hidden pt-16 bg-[linear-gradient(180deg,var(--hero-from)_0%,var(--background)_100%)] ${scene === 'campus' ? 'lg:flex lg:min-h-[100svh] lg:items-center' : ''}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-12 items-center py-10 lg:py-14 ${scene === 'campus' ? 'w-full lg:py-6' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          {eyebrow && (
            <p className="flex items-center gap-3 text-sm font-medium text-subtle">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-heading text-balance">{title}</h1>
          {subtitle && <p className="mt-5 text-lg text-body leading-relaxed max-w-xl">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{actions}</div>}
          {children}
        </motion.div>
        <div className={scene === 'campus' ? 'relative h-[460px] sm:h-[560px] lg:h-[calc(100svh-6rem)] lg:min-h-[560px]' : ''}>
          {scene === 'campus' ? (
            // Pulled back so the whole campus fits its box rather than being cropped.
            <CampusScene wideOffset={0} distance={1.4} />
          ) : (
            <ModuleScene sceneId={scene} moduleId={moduleId} features={features} className="h-[440px] sm:h-[480px]" />
          )}
        </div>
      </div>
    </section>
  );
}
