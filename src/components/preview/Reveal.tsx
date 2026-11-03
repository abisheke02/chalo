'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Strong ease-out: fast start, gentle landing. Transform and opacity only.
export const EASE = [0.23, 1, 0.32, 1] as const;

// Fades and lifts its children in when they enter the viewport, once.
// With reduced motion it renders in place with no animation.
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  scale = 1,
  duration = 0.55,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
