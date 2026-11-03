'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Clock, FileText, Layers, CalendarDays, Video, Megaphone, Search, Home, ChevronRight, Star, type LucideIcon } from 'lucide-react';

export interface HubItem {
  id: string;
  kind: string; // Blogs, Case Studies, News & Events, Webinars or Release Notes
  title: string;
  excerpt: string;
  href: string;
  image: string | null;
  tag: string;
  by: string | null;
  date: string; // ISO
  minutes: number; // reading time, 0 when not known
}

const TABS: { label: string; Icon: LucideIcon | null }[] = [
  { label: 'All', Icon: null },
  { label: 'Blogs', Icon: FileText },
  { label: 'Case Studies', Icon: Layers },
  { label: 'News & Events', Icon: CalendarDays },
  { label: 'Webinars', Icon: Video },
  { label: 'Release Notes', Icon: Megaphone },
];
const KIND_ICON: Record<string, LucideIcon> = { Blogs: FileText, 'Case Studies': Layers, 'News & Events': CalendarDays, Webinars: Video, 'Release Notes': Megaphone };
const day = (iso: string) => format(new Date(iso), 'd MMM yyyy');

// A picture for the card: the cover image, or a plain blue tile with the kind's icon (no stock photos).
function Cover({ item, className, height }: { item: HubItem; className: string; height?: number }) {
  const Icon = KIND_ICON[item.kind] ?? FileText;
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.image} alt="" className={`${className} object-cover`} style={height ? { height } : undefined} loading="lazy" />;
  }
  return (
    <div aria-hidden="true" className={`${className} grid place-items-center text-[#026dde]`} style={{ background: 'linear-gradient(135deg,#dbe9fd,#eef5ff)', ...(height ? { height } : {}) }}>
      <Icon className="h-10 w-10 opacity-70" />
    </div>
  );
}

export default function BlogPageClient({ items }: { items: HubItem[] }) {
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => (tab === 'All' || i.kind === tab) && (!needle || `${i.title} ${i.excerpt} ${i.tag}`.toLowerCase().includes(needle)));
  }, [items, tab, q]);

  const featured = shown[0];
  const recent = shown.slice(1, 4);
  const grid = shown.slice(1);
  const counts = useMemo(() => {
    const m: Record<string, number> = { All: items.length };
    items.forEach((i) => (m[i.kind] = (m[i.kind] ?? 0) + 1));
    return m;
  }, [items]);

  return (
    <div className="bg-[#f3f7fd] pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#4a5a70]">
          <Link href="/" aria-label="Home" className="hover:text-[#026dde]"><Home className="h-4 w-4" /></Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Resources</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-current="page" className="font-medium text-[#026dde]">Blogs</span>
        </nav>

        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.02em] text-[#0a1a4a] sm:text-5xl">Blogs &amp; Insights</h1>
        <p className="mt-2 max-w-2xl text-lg text-[#4a5a70]">Ideas, updates and best practices for smarter school management.</p>

        {/* tabs */}
        <div role="tablist" aria-label="Type of article" className="mt-6 flex flex-wrap gap-2">
          {TABS.filter((t) => t.label === 'All' || (counts[t.label] ?? 0) > 0).map(({ label, Icon }) => (
            <button
              key={label}
              role="tab"
              aria-selected={tab === label}
              onClick={() => setTab(label)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === label ? 'border-transparent bg-[#026dde] text-white shadow-sm' : 'border-[#dbe5f5] bg-white text-[#0a1a4a] hover:border-[#026dde] hover:text-[#026dde]'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
              {label}
            </button>
          ))}
        </div>

        {/* search */}
        <label className="mt-5 flex max-w-md items-center gap-2 rounded-full border border-[#dbe5f5] bg-white px-4 py-2.5 text-[#4a5a70] focus-within:border-[#026dde]">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search blogs, topics or keywords…" aria-label="Search" className="w-full bg-transparent text-sm text-[#0a1a4a] outline-none placeholder:text-[#7a8aa0]" />
        </label>

        {shown.length === 0 && <p className="mt-10 text-[#4a5a70]">Nothing matches that yet. Try another word or tab.</p>}

        {featured && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Link href={featured.href} className="group grid overflow-hidden rounded-2xl border border-[#dbe5f5] bg-white transition-shadow hover:shadow-lg md:grid-cols-2">
              <Cover item={featured} className="h-full min-h-[260px] w-full" />
              <div className="flex flex-col justify-center gap-3 p-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#dbe9fd] px-3 py-1 text-sm font-semibold text-[#026dde]"><Star className="h-3.5 w-3.5" aria-hidden="true" /> Latest · {featured.kind}</span>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-[#0a1a4a] group-hover:text-[#026dde]">{featured.title}</h2>
                {featured.excerpt && <p className="line-clamp-3 text-[#4a5a70]">{featured.excerpt}</p>}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#4a5a70]">
                  {featured.by && <span className="font-medium text-[#0a1a4a]">{featured.by}</span>}
                  <span>{day(featured.date)}</span>
                  {featured.minutes > 1 && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{featured.minutes} min read</span>}
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#026dde] px-4 py-2 text-sm font-semibold text-[#026dde] group-hover:bg-[#026dde] group-hover:text-white">
                  Read <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {recent.length > 0 && (
              <aside aria-labelledby="recent" className="rounded-2xl border border-[#dbe5f5] bg-white p-5">
                <h2 id="recent" className="font-display text-xl font-bold text-[#0a1a4a]">Recently published</h2>
                <ul className="mt-4 space-y-4">
                  {recent.map((r) => (
                    <li key={r.id}>
                      <Link href={r.href} className="group flex items-center gap-3">
                        <Cover item={r} className="w-20 shrink-0 rounded-lg" height={64} />
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-sm font-bold text-[#0a1a4a] group-hover:text-[#026dde]">{r.title}</span>
                          <span className="mt-1 block text-xs text-[#4a5a70]">{r.kind} · {day(r.date)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        )}

        {grid.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-2xl font-extrabold text-[#0a1a4a]">{tab === 'All' ? 'Latest from ChaloSchools' : `Latest ${tab.toLowerCase()}`}</h2>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((g) => (
                <li key={g.id}>
                  <Link href={g.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dbe5f5] bg-white transition-shadow hover:shadow-lg">
                    <Cover item={g} className="w-full" height={176} />
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <span className="w-fit rounded-full bg-[#e8f0fb] px-2.5 py-0.5 text-xs font-semibold text-[#026dde]">{g.tag}</span>
                      <h3 className="font-display text-lg font-bold leading-snug text-[#0a1a4a] group-hover:text-[#026dde]">{g.title}</h3>
                      {g.excerpt && <p className="line-clamp-2 text-sm text-[#4a5a70]">{g.excerpt}</p>}
                      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-[#4a5a70]">
                        <span>{g.by ? `${g.by} · ` : ''}{day(g.date)}{g.minutes > 1 ? ` · ${g.minutes} min read` : ''}</span>
                        <ArrowRight className="h-4 w-4 text-[#026dde] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
