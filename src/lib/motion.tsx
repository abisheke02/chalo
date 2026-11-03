'use client';

/**

 * Reusable Framer Motion primitives for ChaloSchools.

 * Compose these across sections instead of hand-writing motion props.

 *

 * Timing defaults (per design spec):

 *   entrances 0.5–0.6s · hover 0.2–0.3s · spring stiffness 200–300, damping 15–25

 *   stagger 0.05–0.15s · counter 2000ms cubic ease-out · viewport once:true

 *

 * All components respect prefers-reduced-motion via useReducedMotion().

 */

import {

  motion,

  useReducedMotion,

  useInView,

  type Variants,

  type HTMLMotionProps,

} from 'framer-motion';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// ---- Shared spring / transition presets -------------------------------------

export const spring = { type: 'spring' as const, stiffness: 260, damping: 22 };

export const springSoft = { type: 'spring' as const, stiffness: 200, damping: 25 };

export const springSnappy = { type: 'spring' as const, stiffness: 300, damping: 18 };

export const ease = [0.22, 1, 0.36, 1] as const; // cubic ease-out

// ---- Variants ---------------------------------------------------------------

export const fadeUp: Variants = {

  hidden: { opacity: 0, y: 24 },

  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },

};

export const staggerParent = (stagger = 0.1, delayChildren = 0.05): Variants => ({

  hidden: {},

  visible: { transition: { staggerChildren: stagger, delayChildren } },

});

export const staggerChild: Variants = {

  hidden: { opacity: 0, y: 16 },

  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },

};

// ---- FadeIn: scroll-triggered fade/slide (whileInView, once) ----------------

export function FadeIn({

  children,

  delay = 0,

  y = 24,

  className,

  as = 'div',

  ...rest

}: {

  children: ReactNode;

  delay?: number;

  y?: number;

  className?: string;

  as?: keyof typeof motion;

} & Omit<HTMLMotionProps<'div'>, 'children'>) {

  const reduce = useReducedMotion();

  const Comp = motion[as] as typeof motion.div;

  return (

    <Comp

      className={className}

      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}

      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}

      viewport={{ once: true, margin: '-80px' }}

      transition={{ duration: 0.6, ease, delay }}

      {...rest}

    >

      {children}

    </Comp>

  );

}

// ---- Stagger container + item -----------------------------------------------

export function Stagger({

  children,

  stagger = 0.1,

  className,

}: {

  children: ReactNode;

  stagger?: number;

  className?: string;

}) {

  const reduce = useReducedMotion();

  return (

    <motion.div

      className={className}

      variants={reduce ? undefined : staggerParent(stagger)}

      initial={reduce ? undefined : 'hidden'}

      whileInView={reduce ? undefined : 'visible'}

      viewport={{ once: true, margin: '-80px' }}

    >

      {children}

    </motion.div>

  );

}

export function StaggerItem({

  children,

  className,

  ...rest

}: { children: ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {

  const reduce = useReducedMotion();

  return (

    <motion.div className={className} variants={reduce ? undefined : staggerChild} {...rest}>

      {children}

    </motion.div>

  );

}

// ---- AnimatedCounter: rAF cubic ease-out, triggered by useInView ------------

function easeOutCubic(t: number) {

  return 1 - Math.pow(1 - t, 3);

}

export function AnimatedCounter({

  value,

  duration = 2000,

  prefix = '',

  suffix = '',

  className,

}: {

  value: number;

  duration?: number;

  prefix?: string;

  suffix?: string;

  className?: string;

}) {

  const ref = useRef<HTMLSpanElement>(null);

  const inView = useInView(ref, { once: true, margin: '-60px' });

  const reduce = useReducedMotion();

  const [display, setDisplay] = useState(0);

  useEffect(() => {

    if (!inView) return;

    if (reduce) {

      setDisplay(value);

      return;

    }

    let raf = 0;

    const start = performance.now();

    const tick = (now: number) => {

      const t = Math.min((now - start) / duration, 1);

      setDisplay(Math.round(easeOutCubic(t) * value));

      if (t < 1) raf = requestAnimationFrame(tick);

    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);

  }, [inView, value, duration, reduce]);

  return (

    <span ref={ref} className={className}>

      {prefix}

      {display.toLocaleString('en-IN')}

      {suffix}

    </span>

  );

}

// ---- Marquee: CSS translateX infinite scroll, pauses on hover ---------------

export function Marquee({

  children,

  className,

}: {

  children: ReactNode;

  className?: string;

}) {

  // Duplicate content for a seamless loop. Uses the .animate-marquee class

  // (defined in globals.css) which pauses on hover and under reduced-motion.

  return (

    <div className={`relative w-full overflow-hidden ${className ?? ''}`}>

      <div className="animate-marquee flex items-center gap-3 w-max">

        {children}

        {children}

      </div>

    </div>

  );

}

// ---- GlassCard: glass morphism + gradient border on hover -------------------

export function GlassCard({

  children,

  className,

  ...rest

}: { children: ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {

  return (

    <motion.div

      className={`glass-card glow-border rounded-2xl ${className ?? ''}`}

      whileHover={{ y: -4 }}

      transition={{ duration: 0.25, ease }}

      {...rest}

    >

      {children}

    </motion.div>

  );

}

// ---- TiltCard: 3D perspective tilt tracking the pointer ---------------------

export function TiltCard({

  children,

  className,

  max = 8,

}: {

  children: ReactNode;

  className?: string;

  max?: number;

}) {

  const reduce = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);

  const [t, setT] = useState({ rx: 0, ry: 0 });

  function onMove(e: React.MouseEvent) {

    if (reduce || !ref.current) return;

    const r = ref.current.getBoundingClientRect();

    const px = (e.clientX - r.left) / r.width - 0.5;

    const py = (e.clientY - r.top) / r.height - 0.5;

    setT({ rx: -py * max, ry: px * max });

    // feed spotlight position too

    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);

    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);

  }

  return (

    <motion.div

      ref={ref}

      onMouseMove={onMove}

      onMouseLeave={() => setT({ rx: 0, ry: 0 })}

      className={`card-shine spotlight rounded-2xl ${className ?? ''}`}

      style={{ transformStyle: 'preserve-3d' }}

      animate={{ rotateX: t.rx, rotateY: t.ry }}

      transition={{ type: 'spring', stiffness: 200, damping: 20 }}

    >

      {children}

    </motion.div>

  );

}

