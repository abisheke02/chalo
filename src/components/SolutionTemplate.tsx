import Link from 'next/link';
import {
  BookOpen, FileText, ClipboardCheck, CalendarDays, TrendingUp, MessageCircle, Layers, Globe, Wallet, Users, Bus, ShieldCheck,
  GraduationCap, Building2, BarChart3, Bot, Smartphone, Landmark, Shapes, School, Award, Heart, Calculator, UserCog, Presentation,
  Network, ClipboardList, Sprout, UserPlus, IndianRupee, Map, Bell, Eye, Smile, Target, ArrowRight, ChevronRight, Home,
  type LucideIcon,
} from 'lucide-react';
import { moduleHref } from '@/lib/module-links';
import type { SolutionIcon, SolutionPage } from '@/data/solution-pages';

const ICONS: Record<SolutionIcon, LucideIcon> = {
  BookOpen, FileText, ClipboardCheck, CalendarDays, TrendingUp, MessageCircle, Layers, Globe, Wallet, Users, Bus, ShieldCheck,
  GraduationCap, Building2, BarChart3, Bot, Smartphone, Landmark, Shapes, School, Award, Heart, Calculator, UserCog, Presentation,
  Network, ClipboardList, Sprout, UserPlus, IndianRupee, Map, Bell, Eye, Smile, Target,
};

// One layout for every "By board" and "By role" page: breadcrumb, headline, what the school gets, an "At a glance" panel,
// a three-step workflow, the questions and a demo button.
export default function SolutionTemplate({
  groupLabel,
  eyebrow,
  title,
  subtitle,
  page,
  faqs,
  faqTitle,
  overview,
}: {
  groupLabel: string; // e.g. "Solutions"
  eyebrow: string; // e.g. "IB Schools"
  title: string;
  subtitle: string;
  page: SolutionPage;
  faqs?: { q: string; a: string }[];
  faqTitle?: string;
  overview?: string;
}) {
  const Pill = ({ Icon }: { Icon: LucideIcon }) => (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8f0fb] text-[#026dde]">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
  return (
    <div className="bg-[#f3f7fd] pb-14 pt-24 md:pt-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#4a5a70]">
          <Link href="/" aria-label="Home" className="hover:text-[#026dde]"><Home className="h-4 w-4" /></Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{groupLabel}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-current="page" className="font-medium text-[#026dde]">{eyebrow}</span>
        </nav>

        <div className="mt-6">
          <span className="inline-block rounded-full bg-[#dbe9fd] px-3 py-1 text-sm font-semibold text-[#026dde]">{eyebrow}</span>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0a1a4a] sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4a5a70]">{subtitle}</p>
        </div>

        {/* what the school gets + at a glance */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <section aria-labelledby="sol-list" className="rounded-2xl border border-[#dbe5f5] bg-white p-5 sm:p-6">
            <h2 id="sol-list" className="font-display text-2xl font-bold text-[#0a1a4a]">{page.listTitle}</h2>
            <ul className="mt-5 space-y-3">
              {page.rows.map((row) => {
                const Icon = ICONS[row.icon];
                const inner = (
                  <>
                    <Pill Icon={Icon} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-[#0a1a4a]">{row.title}</span>
                      <span className="block text-sm leading-relaxed text-[#4a5a70]">{row.text}</span>
                    </span>
                    {row.moduleId && <ArrowRight className="h-4 w-4 shrink-0 text-[#4a5a70] transition-transform group-hover:translate-x-0.5 group-hover:text-[#026dde]" aria-hidden="true" />}
                  </>
                );
                const cls = 'group flex items-center gap-4 rounded-xl border border-[#e3ebf7] bg-white px-4 py-3 transition-colors';
                return (
                  <li key={row.title}>
                    {row.moduleId ? (
                      <Link href={moduleHref(row.moduleId)} className={`${cls} hover:border-[#026dde]/40 hover:bg-[#026dde]/5`}>{inner}</Link>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <aside aria-labelledby="sol-glance" className="rounded-2xl border border-[#dbe5f5] bg-[#eaf2fd] p-5 sm:p-6">
            <h2 id="sol-glance" className="flex items-center gap-2 font-display text-xl font-bold text-[#0a1a4a]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe9fd] text-[#026dde]"><Target className="h-5 w-5" aria-hidden="true" /></span>
              At a glance
            </h2>
            <ul className="mt-4 space-y-3">
              {page.glance.map((g) => {
                const Icon = ICONS[g.icon];
                return (
                  <li key={g.title} className="flex items-start gap-3 rounded-xl border border-[#dbe5f5] bg-white p-4">
                    <Pill Icon={Icon} />
                    <span>
                      <span className="block font-bold text-[#0a1a4a]">{g.title}</span>
                      <span className="block text-sm leading-relaxed text-[#4a5a70]">{g.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link href="/contact#contact-form" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#026dde] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0258b5]">
              Book a Demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>

        {/* a short overview */}
        {overview && (
          <section aria-label="Overview" className="mt-6 rounded-2xl border border-[#dbe5f5] bg-white p-5 sm:p-6">
            <p className="max-w-4xl text-lg leading-relaxed text-[#4a5a70]">{overview}</p>
          </section>
        )}

        {/* the workflow */}
        <section aria-labelledby="sol-flow" className="mt-6 rounded-2xl border border-[#dbe5f5] bg-white p-5 sm:p-6">
          <h2 id="sol-flow" className="font-display text-2xl font-bold text-[#0a1a4a]">{page.workflowTitle}</h2>
          <p className="mt-1 text-[#4a5a70]">{page.workflowSub}</p>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {page.steps.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <li key={s.title} className="flex items-center gap-4 rounded-xl border border-[#e3ebf7] p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dbe9fd] text-lg font-bold text-[#026dde]">{i + 1}</span>
                  <Pill Icon={Icon} />
                  <span>
                    <span className="block font-bold text-[#0a1a4a]">{s.title}</span>
                    <span className="block text-sm leading-relaxed text-[#4a5a70]">{s.text}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* questions */}
        {faqs && faqs.length > 0 && (
          <section aria-labelledby="sol-faq" className="mt-6 rounded-2xl border border-[#dbe5f5] bg-white p-5 sm:p-6">
            <h2 id="sol-faq" className="font-display text-2xl font-bold text-[#0a1a4a]">{faqTitle ?? 'Questions'}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-[#e3ebf7] p-4">
                  <h3 className="font-bold text-[#0a1a4a]">{f.q}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4a5a70]">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
