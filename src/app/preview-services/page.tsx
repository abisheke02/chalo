import type { Metadata } from 'next';
import ServicesSticky from '@/components/preview/ServicesSticky';

// Preview of the sticky-scroll services section. Not linked from the site. Remove when done.
export const metadata: Metadata = { title: 'Services sticky preview', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#0f2a4a]">
      <header className="border-b border-[#dbe4f0] px-4 py-4 text-sm text-[#4a5a70] sm:px-6">Preview: sticky-scroll services</header>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-20 sm:px-6">
        <h1 className="max-w-2xl text-5xl font-medium leading-[1.05] tracking-tight">What we build for you</h1>
      </section>
      <ServicesSticky />
    </main>
  );
}
