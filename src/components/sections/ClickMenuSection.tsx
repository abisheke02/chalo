'use client';

import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, Building2, CircleAlert, CirclePlay, IndianRupee, Layers, LayoutGrid, Megaphone, ShieldCheck, Smartphone, Star, type LucideIcon } from 'lucide-react';
import { EASE } from '@/components/preview/Reveal';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// Several smaller home page sections in one place: a menu of topics, and the one you click opens beside it.
// On a phone the menu is a row of pills above the content. Every topic's content is in the page all the
// time (the others are only hidden), so nothing is lost for search engines. The heading words are editable
// in Admin > Site Content (Homepage - More).
export interface MoreItem {
  id: string;
  label: string;
  content: ReactNode;
}

const ICONS: Record<string, LucideIcon> = {
  'data-protection': ShieldCheck, 'why-chalo': Star, 'mobile-apps': Smartphone, numbers: BarChart3, schools: Building2,
  problems: CircleAlert, demo: CirclePlay, 'case-study': Layers, pricing: IndianRupee, news: Megaphone,
};

export default function ClickMenuSection({ items }: { items: MoreItem[] }) {
  const { content } = useSiteContent();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(items[0]?.id);
  if (!items.length) return null;

  return (
    <section id="more" className="bg-[#f4f8fd] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">{getContentValue(content, 'more_eyebrow', 'More about ChaloSchools')}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-[#0f2a4a] md:text-4xl">{getContentValue(content, 'more_heading', 'Everything else, one click away.')}</h2>
          <p className="mt-2 text-lg text-[#4a5a70]">{getContentValue(content, 'more_intro', 'Pick a topic and read it right here.')}</p>
        </div>

        {/* one rounded card: the topics down the left, the chosen one on the right */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#dbe4f0] bg-white shadow-[0_24px_50px_-30px_rgba(15,42,74,0.3)] lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
          <div role="tablist" aria-label="Topics" aria-orientation="vertical" className="flex gap-2 overflow-x-auto border-b border-[#e6edf7] p-3 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-5 [&::-webkit-scrollbar]:hidden">
            {items.map((it) => {
              const on = it.id === active;
              const Icon = ICONS[it.id] ?? LayoutGrid;
              return (
                <button
                  key={it.id}
                  type="button"
                  role="tab"
                  id={`more-tab-${it.id}`}
                  aria-selected={on}
                  aria-controls={`more-panel-${it.id}`}
                  onClick={() => setActive(it.id)}
                  className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] lg:whitespace-normal lg:px-5 lg:py-3.5 lg:text-base ${on ? 'border-transparent bg-[#026dde] text-white shadow-lg shadow-[#026dde]/25' : 'border-[#e6edf7] bg-white text-[#0f2a4a] shadow-sm hover:border-[#026dde]'}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${on ? 'text-white' : 'text-[#026dde]'}`} aria-hidden="true" />
                  {it.label}
                </button>
              );
            })}
          </div>

          <div className="min-w-0 p-3 sm:p-5 lg:p-6">
            {items.map((it) => {
              const on = it.id === active;
              return (
                <motion.div
                  key={it.id}
                  role="tabpanel"
                  id={`more-panel-${it.id}`}
                  aria-labelledby={`more-tab-${it.id}`}
                  hidden={!on}
                  initial={false}
                  animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: reduce ? 0 : 24 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="min-h-[360px] [&_section]:bg-transparent! [&_section]:py-2! md:[&_section]:py-4!"
                >
                  {it.content}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
