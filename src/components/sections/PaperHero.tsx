'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { animate, createScope, stagger, utils } from 'animejs';
import { moduleHref } from '@/lib/module-links';

// Homepage hero visual: loose paper records fly into one decision panel and
// dissolve into it. The panel shows a single question, its answer against the
// target, and the decision that follows. Figures are illustrative.

const BRAND = '#026dde';
const GREEN = '#10b981';
const PANEL = '#0b1f3a';
const PERIOD = 10000;

function countText(el: Element | null, to: number, format: (v: number) => string, delay: number) {
  if (!el) return;
  const c = { v: 0 };
  animate(c, {
    v: to,
    duration: 1200,
    delay,
    ease: 'outExpo',
    onUpdate: () => {
      el.textContent = format(c.v);
    },
  });
}

export default function PaperHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fmt = (v: number) => `₹${v.toFixed(1)}L`;

    if (reduced) {
      const panel = root.querySelector<SVGGElement>('.panel');
      if (panel) panel.style.opacity = '1';
      const val = root.querySelector('.val');
      if (val) val.textContent = fmt(18.4);
      root.querySelectorAll<SVGGElement>('.row').forEach((r) => (r.style.opacity = '1'));
      return;
    }

    const play = () =>
      createScope({ root }).add(() => {
        const papers = utils.$('.paper');
        const pos = papers.map((_, i) => ({ x: 40 + ((i * 97) % 220), y: 60 + ((i * 53) % 280), r: ((i * 37) % 50) - 25 }));
        utils.set(papers, {
          translateX: (_?: unknown, i = 0): number => pos[i].x,
          translateY: (_?: unknown, i = 0): number => pos[i].y,
          rotate: (_?: unknown, i = 0): number => pos[i].r,
          scale: 1,
          opacity: 1,
        });
        animate(papers, {
          translateX: (_?: unknown, i = 0): number => 330 + (i % 3) * 20 - pos[i].x,
          translateY: (_?: unknown, i = 0): number => 200 + (i % 4) * 12 - pos[i].y,
          rotate: 0,
          scale: (_?: unknown, i = 0): number => (i < 8 ? 0.2 : 0.0001),
          opacity: 0,
          duration: 1100,
          delay: stagger(70),
          ease: 'inOutCubic',
        });
        animate('.panel', { opacity: [0, 1], translateY: [14, 0], duration: 650, delay: 900, ease: 'outExpo' });
        countText(root.querySelector('.val'), 18.4, fmt, 1000);
        animate('.delta', { opacity: [0, 1], duration: 500, delay: 1500 });
        animate('.row', { opacity: [0, 1], translateX: [18, 0], duration: 600, delay: 1650, ease: 'outExpo' });
      });

    let scope = play();
    const id = window.setInterval(() => {
      scope.revert();
      scope = play();
    }, PERIOD);
    return () => {
      window.clearInterval(id);
      scope.revert();
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <svg viewBox="0 0 560 440" className="h-auto w-full" role="img" aria-label="Paper records becoming one decision for today">
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`p${i}`} className="paper" style={{ transformBox: 'view-box' }}>
            <rect x="-40" y="-52" width="80" height="104" rx="6" fill="#fff" stroke="#d6dfee" />
            {[0, 1, 2, 3].map((l) => (
              <rect key={l} x="-28" y={-34 + l * 13} width={l === 0 ? 44 : 50 - l * 6} height="5" rx="2" fill={l === 0 ? BRAND : '#c3ccda'} />
            ))}
          </g>
        ))}

        <g className="panel" style={{ opacity: 0 }}>
          <rect x="300" y="70" width="240" height="330" rx="22" fill={PANEL} />
          <text x="324" y="106" fill="#8fb8ff" fontSize="11" fontWeight="700" letterSpacing="1.5">DECISION FOR TODAY</text>
          <text x="324" y="134" fill="#fff" fontSize="18" fontWeight="700">Are fees on target?</text>
          <text className="val" x="324" y="186" fill="#fff" fontSize="38" fontWeight="800">₹0.0L</text>
          <text className="delta" x="324" y="210" fill={GREEN} fontSize="12" fontWeight="700" style={{ opacity: 0 }}>▲ 5.7% vs target ₹17.4L</text>
          <line x1="324" x2="516" y1="232" y2="232" stroke="#1d3f70" />
          <g className="row" style={{ opacity: 0 }}>
            <text x="324" y="258" fill="#cbd9ec" fontSize="13">38 families overdue 30+ days</text>
            <Link href={moduleHref('fees')}>
              <rect x="324" y="278" width="192" height="38" rx="19" fill={BRAND} />
              <text x="420" y="302" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Send reminders</text>
            </Link>
          </g>
          <text x="324" y="378" fill="#5f7ba3" fontSize="10">Figures illustrative</text>
        </g>
      </svg>
    </div>
  );
}
