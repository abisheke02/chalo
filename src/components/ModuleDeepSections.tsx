import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lightbulb, Users } from 'lucide-react';
import type { ModuleContent } from '@/data/module-content';
import { MODULES } from '@/data/module-features';
import { moduleDetailHref, moduleHref } from '@/lib/module-links';

// The in-depth part of a module page: what it is for, what you will see, how to
// use it step by step, who uses it and what comes out of it. All of the words
// come from src/data/module-content.ts. Server component: no client code.

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

export default function ModuleDeepSections({ content, shortTitle }: { content: ModuleContent; shortTitle: string }) {
  return (
    <>
      {/* The answer, in a sentence or two */}
      <section className="bg-card py-10 md:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>In short</Eyebrow>
          <p className="mt-3 text-xl font-medium leading-relaxed text-heading md:text-2xl">{content.answer}</p>
        </div>
      </section>

      {/* Purpose and the problem it replaces */}
      <section className="bg-surface-2 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-7">
            <Eyebrow>What it is for</Eyebrow>
            <p className="mt-3 text-base leading-relaxed text-heading">{content.purpose}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <Eyebrow>What it replaces</Eyebrow>
            <p className="mt-3 text-base leading-relaxed text-heading">{content.problem}</p>
          </div>
        </div>
      </section>

      {/* Open it and you'll see */}
      <section className="bg-card py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-heading md:text-3xl">Open it and you&apos;ll see</h2>
          <p className="mt-2 max-w-2xl text-subtle">Six things {shortTitle.toLowerCase()} gives your school from day one.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.seeInside.map((item, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-surface-2 p-5">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <p className="text-base font-medium leading-relaxed text-heading">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to use it */}
      <section className="bg-surface-2 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-heading md:text-3xl">How to use it</h2>
          <p className="mt-2 max-w-2xl text-subtle">From first set-up to everyday routine.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {content.howTo.map((stage) => (
              <div key={stage.stage} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-heading">{stage.stage}</h3>
                <ol className="mt-4 space-y-3">
                  {stage.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-body">
                      <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          {content.example && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <Eyebrow>Example</Eyebrow>
              <p className="mt-2 text-base leading-relaxed text-heading">{content.example}</p>
            </div>
          )}
        </div>
      </section>

      {/* Who uses it */}
      <section className="bg-card py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-heading md:text-3xl"><Users className="h-6 w-6 text-primary" aria-hidden="true" />Who uses it</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.roles.map((r) => (
              <div key={r.who} className="rounded-2xl border border-border bg-surface-2 p-6">
                <h3 className="text-lg font-bold text-heading">{r.who}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{r.what}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-6">
              <Eyebrow>What you get out of it</Eyebrow>
              <p className="mt-2 text-base leading-relaxed text-heading">{content.outputs}</p>
            </div>
            <div className="rounded-2xl border border-border p-6">
              <Eyebrow>How it connects</Eyebrow>
              <p className="mt-2 text-base leading-relaxed text-heading">{content.connects}</p>
            </div>
          </div>
        </div>
      </section>

      {content.tips.length > 0 && (
        <section className="bg-surface-2 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-heading"><Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />Good habits</h2>
            <ul className="mt-4 space-y-2">
              {content.tips.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base text-heading"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

// The next steps at the foot of a module page, so no page is a dead end.
export function ContinueTo({ labels }: { labels: string[] }) {
  const links = labels
    .map((raw) => {
      const label = raw.replace(/\s*\(.*\)\s*$/, '').trim();
      if (/^book a demo/i.test(label)) return { label: 'Book a demo', href: '/contact#contact-form' };
      const c = label.toLowerCase();
      const m = c.includes('timetable') ? MODULES.find((x) => x.id === 'timetable') : MODULES.find((x) => x.title.toLowerCase().includes(c) || c.includes(x.title.toLowerCase()));
      return m ? { label, href: moduleDetailHref(m.id) ?? moduleHref(m.id) } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
  if (links.length === 0) return null;
  return (
    <section className="border-t border-border bg-card py-8">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold text-subtle">Continue to</span>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-1.5 text-sm font-semibold text-heading transition-colors hover:border-primary/40 hover:text-primary">
            {l.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
