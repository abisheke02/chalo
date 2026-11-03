'use client';

import { useEffect } from 'react';

/**
 * Global scroll-reveal: adds `.is-visible` to any element with the
 * `.wow-reveal` or `.fade-in-up` class when it scrolls into view.
 * Mount once in the layout. Reduced-motion users get everything shown
 * immediately (the CSS media query neutralizes the animations).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.wow-reveal, .fade-in-up')
    );
    if (els.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target); // reveal once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
