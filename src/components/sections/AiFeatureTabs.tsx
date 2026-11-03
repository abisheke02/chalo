'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, type LucideIcon } from 'lucide-react';
import { EASE } from '@/components/preview/Reveal';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// Tabs that rotate by themselves: the active item has a blue line that fills while it is
// shown, then the next one opens and the screen crossfades. Hover or focus pauses it, and a click
// picks one. All the words sit in the HTML for every tab; only the screen changes.

export interface AiTab {
  slug: string;
  title: string;
  blurb: string;
  points: string[];
  href?: string; // where the link goes; the module page by default
  icon?: LucideIcon;
}

export interface TabsCopy {
  id?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  screenLabel?: string;
  linkLabel?: string;
  tone?: 'white' | 'blue';
  ariaLabel?: string;
}

const DEFAULT_COPY: TabsCopy = {
  id: 'ai-features',
  eyebrow: 'Built-in intelligence',
  heading: 'Smart help, built into the school day.',
  intro: 'Ask questions, build timetables and spot problems early, all from your own school records.',
};

const INTERVAL_SECONDS = 3; // how long each tab stays open

export default function AiFeatureTabs({ tabs, copy: copyProp = DEFAULT_COPY }: { tabs: AiTab[]; copy?: TabsCopy }) {
  const reduce = useReducedMotion();
  const { content } = useSiteContent();
  // The built-in intelligence section's words can be edited in Admin > Site Content.
  const copy: TabsCopy =
    copyProp.id === 'ai-features'
      ? {
          ...copyProp,
          eyebrow: getContentValue(content, 'aitabs_eyebrow', copyProp.eyebrow),
          heading: getContentValue(content, 'aitabs_heading', copyProp.heading),
          intro: getContentValue(content, 'aitabs_intro', copyProp.intro),
        }
      : copyProp;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the open tab and its screen hold the rotation. The pointer on any other tab leaves it running.
  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseMove: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };
  const tab = tabs[active];
  if (!tab) return null;

  return (
    <section id={copy.id} className={`${copy.tone === 'blue' ? 'bg-[#f4f8fd]' : 'bg-card'} py-10 md:py-12 lg:[zoom:0.85]`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">{copy.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#0f2a4a] md:text-[2rem]">{copy.heading}</h2>
          <p className="mt-2 text-base text-[#4a5a70] md:text-[17px]">{copy.intro}</p>
        </div>

        <div className="mt-6 grid items-center gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
          {/* the screen: holding the pointer on it (or focus inside it) holds the rotation */}
          <div {...hold} className="rounded-[18px] bg-[#1b2433] p-2.5 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.55)] sm:p-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0b1a33]">
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(110deg,transparent_20%,rgba(2,109,222,0.5)_45%,rgba(120,200,255,0.45)_55%,transparent_80%)] blur-xl" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab.slug}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 flex flex-col p-4 sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6db4ff]">{copy.screenLabel ?? 'In the product'}</p>
                  <h3 className="mt-1 flex items-center gap-3 font-display text-xl font-extrabold text-white sm:text-2xl">
                    {tab.icon && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#026dde]"><tab.icon className="h-5 w-5" aria-hidden="true" /></span>}
                    {tab.title}
                  </h3>
                  <ul className="mt-3 space-y-2 sm:mt-4">
                    {tab.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm leading-snug text-white">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#026dde]">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* the list */}
          <ul className="space-y-3" role="tablist" aria-label={copy.ariaLabel ?? 'Intelligent features'}>
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.slug} role="presentation" className="relative pl-5" {...(on ? hold : {})}>
                  <span aria-hidden="true" className="absolute left-0 top-0 h-full w-0.5 bg-[#dbe4f0]" />
                  {on && (
                    <span
                      key={`${active}-${reduce ? 'still' : 'run'}`}
                      aria-hidden="true"
                      className={`absolute left-0 top-0 w-0.5 bg-[#026dde] ${reduce ? 'h-full' : 'tab-fill'}`}
                      style={reduce ? undefined : { animationDuration: `${INTERVAL_SECONDS}s`, animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={() => setActive((a) => (a + 1) % tabs.length)}
                    />
                  )}
                  <button type="button" role="tab" aria-selected={on} onClick={() => setActive(i)} className="block w-full text-left">
                    <span className={`block text-base font-bold transition-colors duration-300 ${on ? 'text-[#0f2a4a]' : 'text-[#9aa8bb]'}`}>{t.title}</span>
                    <span className={`mt-0.5 block text-[13px] leading-snug transition-colors duration-300 ${on ? 'text-[#4a5a70]' : 'text-[#b7c2d1]'}`}>{t.blurb}</span>
                  </button>
                  {on && (
                    <Link href={t.href ?? `/features/${t.slug}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#026dde] underline-offset-4 hover:underline">
                      {copy.linkLabel ?? 'Learn more'}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
