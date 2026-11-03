import type { Metadata } from 'next';
import Link from 'next/link';

// Preview of the two hero videos in three layouts. Not linked from the site. Remove when done.
export const metadata: Metadata = { title: 'Hero video preview', robots: { index: false, follow: false } };

const LIVE = { src: '/videos/chalo-hero-live.mp4', poster: '/images/videos/chalo-hero-live.jpg' };
const MOTION = { src: '/videos/chalo-hero-motion.mp4', poster: '/images/videos/chalo-hero-motion.jpg' };

function Video({ v, className = '' }: { v: { src: string; poster: string }; className?: string }) {
  return (
    <video className={`block w-full ${className}`} src={v.src} poster={v.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
  );
}

function Copy({ centre = false }: { centre?: boolean }) {
  return (
    <div className={centre ? 'mx-auto max-w-3xl text-center' : 'max-w-xl'}>
      <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0f2a4a] md:text-6xl">
        Your entire school. <span className="text-[#026dde]">One platform.</span>
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[#4a5a70]">Admissions, fees, attendance, examinations and parent communication, managed in one secure system.</p>
      <div className={`mt-7 flex flex-wrap gap-3 ${centre ? 'justify-center' : ''}`}>
        <Link href="/contact#contact-form" className="rounded-full bg-[#026dde] px-7 py-3.5 font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#0258b8] active:scale-[0.97]">Book a Demo</Link>
        <Link href="/product" className="rounded-full border border-[#dbe4f0] bg-white px-7 py-3.5 font-semibold text-[#0f2a4a] transition-[border-color,transform] duration-150 hover:border-[#026dde] active:scale-[0.97]">Explore Modules</Link>
      </div>
    </div>
  );
}

function Label({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-7xl px-4 pt-10 text-sm font-bold uppercase tracking-[0.18em] text-[#026dde] sm:px-6">
      Option {n} · <span className="text-[#4a5a70]">{children}</span>
    </p>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#0f2a4a]">
      <header className="border-b border-[#dbe4f0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-display text-2xl font-extrabold text-[#026dde]">chalo</span>
          <span className="text-sm text-[#4a5a70]">Hero video preview. Three layouts, two videos.</span>
        </div>
      </header>

      {/* 1: the long video (26 s, four live scenes) under centred text */}
      <Label n={1}>Long video (chalo-hero-live, 26 s) under centred text</Label>
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6">
        <Copy centre />
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl border border-[#dbe4f0] shadow-[0_30px_70px_-35px_rgba(2,109,222,0.45)]">
          <Video v={LIVE} />
        </div>
      </section>

      {/* 2: the short video (10 s, build-up and toasts) under centred text */}
      <Label n={2}>Short video (chalo-hero-motion, 10 s) under centred text</Label>
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6">
        <Copy centre />
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl border border-[#dbe4f0] shadow-[0_30px_70px_-35px_rgba(2,109,222,0.45)]">
          <Video v={MOTION} />
        </div>
      </section>

      {/* 3: text on the left, the long video on the right, no frame so it blends into the page */}
      <Label n={3}>Text left, long video right, blended into the page</Label>
      <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Copy />
        <Video v={LIVE} />
      </section>
    </main>
  );
}
