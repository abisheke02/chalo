'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/components/preview/Reveal';

// Wraps one home page section so every section arrives the same way: it fades up and settles as it scrolls
// into view, once. `label` is the name shown on the dot rail at the edge of the page (see SectionRail).
//
// `fit`: on laptops and desktops, a section taller than the window is drawn a little smaller (never below 75%,
// never larger than normal) so all of it is on screen at 100% browser zoom. Phones and tablets are not changed.
// The tallest the section has been is remembered, so it does not jump about when a tab or a slide changes.
export default function ScrollSection({ label, children, fit = false }: { label: string; children: ReactNode; fit?: boolean }) {
  const reduce = useReducedMotion();
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fit) return;
    const el = inner.current;
    if (!el) return;
    let tallest = 0;
    const apply = () => {
      if (window.innerWidth < 1024) {
        el.style.zoom = '';
        tallest = 0;
        return;
      }
      el.style.zoom = '1'; // measure at normal size, then set the size to use, in the same moment
      tallest = Math.max(tallest, el.offsetHeight);
      const z = Math.max(0.75, Math.min(1, (window.innerHeight - 8) / tallest));
      el.style.zoom = z < 0.995 ? String(z) : '';
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    const onResize = () => {
      tallest = 0;
      apply();
    };
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [fit]);

  return (
    <motion.div
      data-section={label}
      className="scroll-mt-20"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}
