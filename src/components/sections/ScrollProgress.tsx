'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

// A thin bar across the very top of the page that fills as you scroll down.
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, originX: 0, backgroundColor: 'var(--brand)' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    />
  );
}
