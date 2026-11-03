'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// A small bar at the bottom of the preview pages to jump between the options. Previews only: remove with them.
const GROUPS = [
  { label: 'Home hero', items: ['pre1', 'pre2', 'pre3', 'pre4'] },
  { label: 'Modules page', items: ['mod1', 'mod2', 'mod3', 'mod4', 'mod5'] },
  { label: 'Whole home page', items: ['main1', 'main2'] },
];

export default function PreviewSwitcher() {
  const path = usePathname();
  return (
    <nav aria-label="Preview options" className="fixed bottom-3 left-1/2 z-[70] flex max-w-[96vw] -translate-x-1/2 items-center gap-3 overflow-x-auto rounded-full border border-border bg-card/95 px-4 py-2 text-xs shadow-xl backdrop-blur">
      {GROUPS.map((g, gi) => (
        <div key={g.label} className={`flex shrink-0 items-center gap-1.5 ${gi > 0 ? 'border-l border-border pl-3' : ''}`}>
          <span className="font-semibold text-subtle">{g.label}</span>
          {g.items.map((id) => (
            <Link key={id} href={`/${id}`} className={`rounded-full px-2.5 py-1 font-semibold transition-colors ${path === `/${id}` ? 'bg-primary text-primary-foreground' : 'text-heading hover:bg-primary/10'}`}>
              {id}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
