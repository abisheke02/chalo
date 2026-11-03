'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, X } from 'lucide-react';
import { MODULES } from '@/data/module-features';
import { CAMPUS_ZONES } from '@/data/campus-zones';
import { INTEGRATION_ITEMS } from '@/data/integrations';
import { moduleDetailHref } from '@/lib/module-links';

// The /product hero as a guided walk through the whole product. The campus floats and turns on one side,
// the module details sit on the other, and nothing moves in or hides. A visitor can click any building, or
// start the tour: seven buildings (16 modules), then the five integrations, then a closing screen with the
// demo button. Back and Next, the dots and auto-play (off until asked for) all move through the same steps.
const CampusScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });
const ModuleScene = dynamic(() => import('@/components/three/ModuleScene'), { ssr: false });

const ZONES = CAMPUS_ZONES.length; // steps 0..ZONES-1 are buildings
const INTEGRATIONS_STEP = ZONES; // then the integrations
const FINISH = ZONES + 1; // then the close
const INTRO = -1;
const STEP_MS = 14000;

const pill = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-heading hover:border-primary'}`;

export default function CampusGameHero() {
  const [step, setStep] = useState(INTRO);
  const [visited, setVisited] = useState<string[]>([]);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [integrationId, setIntegrationId] = useState(INTEGRATION_ITEMS[0].id);
  const [playing, setPlaying] = useState(false);

  const zone = step >= 0 && step < ZONES ? CAMPUS_ZONES[step] : null;
  const mod = zone ? MODULES.find((m) => m.id === moduleId) ?? null : null;
  const integration = INTEGRATION_ITEMS.find((i) => i.id === integrationId) ?? INTEGRATION_ITEMS[0];

  const go = useCallback((n: number) => {
    const next = Math.max(INTRO, Math.min(FINISH, n));
    setStep(next);
    if (next >= 0 && next < ZONES) {
      const z = CAMPUS_ZONES[next];
      setModuleId(z.modules[0]);
      setVisited((v) => (v.includes(z.id) ? v : [...v, z.id]));
    }
    if (next === INTEGRATIONS_STEP) setIntegrationId(INTEGRATION_ITEMS[0].id);
    if (next === FINISH || next === INTRO) setPlaying(false);
  }, []);

  // A click on a building in the scene.
  const openZone = useCallback(
    (id: string) => {
      const i = CAMPUS_ZONES.findIndex((z) => z.id === id);
      if (i >= 0) go(i);
    },
    [go],
  );

  // Auto-play: the next step after STEP_MS. Switched on only by the visitor.
  useEffect(() => {
    if (!playing || step < 0 || step >= FINISH) return;
    const t = setTimeout(() => go(step + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, go]);

  useEffect(() => {
    if (step < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') go(INTRO);
      else if (e.key === 'ArrowRight') go(step + 1);
      else if (e.key === 'ArrowLeft') go(step - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, go]);

  const intro = step === INTRO;

  return (
    <section className="relative overflow-hidden pt-16 bg-[linear-gradient(180deg,var(--hero-from)_0%,var(--background)_100%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-8 lg:py-4">
        {/* the words and the module details, always on this side */}
        <div className={`flex flex-col ${intro ? '' : 'rounded-3xl border border-border bg-card p-5 shadow-[0_24px_50px_-28px_rgba(15,42,74,0.35)] sm:p-6 lg:h-[calc(100svh-6rem)] lg:max-h-[680px] lg:min-h-[500px]'}`}>
          <div className="flex min-h-0 flex-1 flex-col">
            {intro && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="flex items-center gap-3 text-sm font-medium text-subtle">
                  <span className="h-px w-8 bg-primary" aria-hidden="true" />
                  Explore your school
                </p>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-heading text-balance sm:text-5xl">Your entire school. One platform.</h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-body">Click any building on the campus, or take the tour: {ZONES} buildings, 16 modules and {INTEGRATION_ITEMS.length} integrations, in about two minutes.</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      go(0);
                      setPlaying(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Start the tour
                  </button>
                  <Link href="/contact#contact-form" className="inline-flex items-center gap-1.5 font-semibold text-heading hover:text-primary">
                    Book a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href="#modules" className="inline-flex items-center gap-1.5 font-semibold text-heading hover:text-primary">
                    Explore Modules <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            )}

            {zone && (
              <div key={zone.id} className="flex min-h-0 flex-1 animate-fade-in-up flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-extrabold text-heading">{zone.title}</h2>
                  <div className="flex shrink-0 items-center gap-2">
                    {mod && (
                      <Link href={moduleDetailHref(mod.id) ?? `/product#${mod.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]">
                        Open this module <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                    <button type="button" onClick={() => go(INTRO)} aria-label="Close the tour" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-heading transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.95]"><X className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                </div>
                {zone.modules.length > 1 && (
                  <div role="tablist" aria-label={`Modules in the ${zone.title.toLowerCase()}`} className="mt-3 flex flex-wrap gap-2">
                    {zone.modules.map((id) => (
                      <button key={id} type="button" role="tab" aria-selected={id === moduleId} onClick={() => setModuleId(id)} className={pill(id === moduleId)}>
                        {MODULES.find((x) => x.id === id)?.title ?? id}
                      </button>
                    ))}
                  </div>
                )}
                {mod && (
                  <div key={mod.id} className="mt-3 flex min-h-0 flex-1 animate-fade-in-up flex-col">
                    {zone.modules.length === 1 && <p className="font-display text-lg font-bold text-heading">{mod.title}</p>}
                    <ModuleScene moduleId={mod.id} className="mt-2 min-h-0 flex-1" sceneClass="min-h-[170px]" steps />
                  </div>
                )}
              </div>
            )}

            {step === INTEGRATIONS_STEP && (
              <div className="flex min-h-0 flex-1 animate-fade-in-up flex-col overflow-y-auto">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Integrations</p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold text-heading">Works with what your school already uses</h2>
                  </div>
                  <button type="button" onClick={() => go(INTRO)} aria-label="Close the tour" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-heading transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.95]"><X className="h-4 w-4" aria-hidden="true" /></button>
                </div>
                <div role="tablist" aria-label="Integrations" className="mt-3 flex flex-wrap gap-2">
                  {INTEGRATION_ITEMS.map((it) => (
                    <button key={it.id} type="button" role="tab" aria-selected={it.id === integrationId} onClick={() => setIntegrationId(it.id)} className={pill(it.id === integrationId)}>
                      {it.title}
                    </button>
                  ))}
                </div>
                <div key={integration.id} className="mt-4 animate-fade-in-up">
                  <div className="grid place-items-center rounded-2xl py-3" style={{ background: integration.pill }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={integration.img} alt={integration.alt} width={400} height={400} className="h-28 w-28" />
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-body">{integration.paras[0]}</p>
                  <ul className="mt-3 space-y-1.5">
                    {integration.points?.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-body"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{p}</li>
                    ))}
                  </ul>
                  <Link href={integration.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    {integration.link} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}

            {step === FINISH && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-3xl font-extrabold text-heading text-balance">That is the whole school, on one platform.</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-body">From the first enquiry to the final report card, every module shares one record. See how it fits your school.</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href="/contact#contact-form" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97]">
                    Book a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={() => go(0)} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-heading transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.97]">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Watch again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* one control bar for every step of the tour */}
          {!intro && (
            <div className="mt-3 shrink-0 border-t border-border pt-3">
              {playing && (
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                  <span key={step} className="seg-fill block h-full bg-primary" style={{ animationDuration: `${STEP_MS}ms` }} />
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => go(step - 1)} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border text-heading transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.95]"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Tour steps">
                  {Array.from({ length: FINISH }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={i < ZONES ? CAMPUS_ZONES[i].title : i === INTEGRATIONS_STEP ? 'Integrations' : 'Finish'}
                      aria-current={i === step ? 'step' : undefined}
                      className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${i === step ? 'w-6 bg-primary' : i < step ? 'w-2.5 bg-primary/50' : 'w-2.5 bg-border hover:bg-primary/40'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {step < FINISH && (
                    <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause auto-play' : 'Play automatically'} className="grid h-10 w-10 place-items-center rounded-full border border-border text-heading transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.95]">
                      {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  )}
                  {step < FINISH && (
                    <button type="button" onClick={() => go(step + 1)} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 active:scale-[0.95]"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* the campus: floats and turns the whole time, never zooms or moves */}
        <div className="relative h-[460px] sm:h-[560px] lg:h-[calc(100svh-6rem)] lg:max-h-[680px] lg:min-h-[500px]">
          <CampusScene wideOffset={0} distance={1.25} zoneMode squarePlot onVisit={openZone} visited={visited} selected={zone?.id ?? null} />
        </div>
      </div>
    </section>
  );
}
