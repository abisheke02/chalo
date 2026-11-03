'use client';

import { useEffect, useState } from 'react';

// A rail of dots at the right edge of the home page, one for every section wrapped in ScrollSection (and the
// hero). The dot of the section you are in is filled; a click scrolls to that section. Wide screens only.
export default function SectionRail() {
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = () => Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const list = els();
    setLabels(list.map((e) => e.dataset.section ?? ''));
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.4;
        let idx = 0;
        els().forEach((e, i) => {
          if (e.getBoundingClientRect().top <= mid) idx = i;
        });
        setActive(idx);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (labels.length < 2) return null;
  const go = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>('[data-section]')[i];
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav aria-label="Sections of this page" className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 2xl:flex">
      {labels.map((label, i) => (
        <button key={label + i} type="button" onClick={() => go(i)} aria-label={label} aria-current={i === active ? 'true' : undefined} className="group flex items-center gap-2">
          <span className="pointer-events-none rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-heading opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
          <span className={`block rounded-full transition-[width,height,background-color] duration-300 ${i === active ? 'h-3 w-3 bg-primary' : 'h-2 w-2 bg-primary/30 group-hover:bg-primary/60'}`} />
        </button>
      ))}
    </nav>
  );
}
