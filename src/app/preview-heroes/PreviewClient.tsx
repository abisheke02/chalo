'use client';

import dynamic from 'next/dynamic';
import type { MotionValue } from 'framer-motion';
import ScrollStack from '@/components/preview/ScrollStack';
import ModuleCarousel from '@/components/preview/ModuleCarousel';

const CampusScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });

// The product-page campus, sized to sit in the centre of the carousel.
function CampusCentre({ spin }: { spin: MotionValue<number> }) {
  return (
    <div className="absolute left-1/2 top-1/2 h-[380px] w-[460px] -translate-x-1/2 -translate-y-1/2">
      <CampusScene wideOffset={0} distance={1.6} spin={spin} labels={false} />
    </div>
  );
}

export default function PreviewClient() {
  return (
    <main className="min-h-screen bg-[#f4f8fd] text-[#0f2a4a]">
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">A · Module carousel</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">Fourteen modules. One platform.</h1>
        <p className="mt-3 max-w-xl text-lg text-[#4a5a70]">Switch the layout, drag to spin, or click a module to open it.</p>
        <div className="mt-8">
          <ModuleCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">B · Product page campus</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold">The campus from the product page</h2>
        <p className="mt-3 max-w-xl text-lg text-[#4a5a70]">Shown on its own for comparison. Hover a building to see its module.</p>
        <div className="relative mt-8 h-[560px] overflow-hidden rounded-3xl bg-[#e8f0fa]">
          <CampusScene wideOffset={0} distance={1} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">C · Carousel with campus centre</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold">Modules around the campus</h2>
        <p className="mt-3 max-w-xl text-lg text-[#4a5a70]">The same carousel, with the product-page campus at its centre.</p>
        <div className="mt-8">
          <ModuleCarousel centre={(spin) => <CampusCentre spin={spin} />} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#026dde]">D · Scroll stack</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold">The homepage, as one sequence</h2>
        <p className="mt-3 max-w-xl text-lg text-[#4a5a70]">Each section stays in place and the next one slides over it, instead of a long list.</p>
        <div className="mt-12">
          <ScrollStack />
        </div>
      </section>
    </main>
  );
}
