'use client';

import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function PageChrome() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <>
      {/* Scroll progress bar (top of viewport) */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#026dde] via-[#00d4ff] to-[#f59e0b]"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Back-to-top button (spring entrance) */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            whileHover={reduce ? undefined : { scale: 1.1 }}
            whileTap={reduce ? undefined : { scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
