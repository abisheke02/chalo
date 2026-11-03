import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Brain, IndianRupee, MessageCircle, ShieldCheck, Bus, Wallet, CheckCircle2 } from 'lucide-react';
import LandingLeadForm from '@/components/lp/LandingLeadForm';
import { WhatsAppLink, CallLink } from '@/components/lp/LandingCta';
import { site } from '@/config/site';

// Landing page for Google and Meta ads. It has no site menu, one message and
// one form. It is kept out of search results (noindex) so it never competes
// with the SEO pages, and it is not in the sitemap.
export const metadata: Metadata = {
  title: 'School ERP for Tamil Nadu Schools',
  description: 'One ERP for admissions, fees, attendance, exams, payroll and transport. Built in Chennai, used by 200+ schools. Book a free demo.',
  robots: { index: false, follow: true },
};

const BENEFITS = [
  { icon: Brain, title: 'AI timetable in minutes', text: 'Conflict-free timetables built around every teacher and room, with one-click substitutions when someone is absent.' },
  { icon: IndianRupee, title: 'Fees collected on time', text: 'Online and counter payments, automatic reminders and a ledger that reconciles every receipt. Works with Tally.' },
  { icon: MessageCircle, title: 'Parents on one app', text: 'Attendance, results, fees and bus location in one app. Notices go by WhatsApp, SMS and voice, with read receipts.' },
  { icon: Bus, title: 'Live bus tracking', text: 'See every bus in real time and alert parents at each stop.' },
  { icon: Wallet, title: 'Payroll with PF, ESI and TDS', text: 'Salaries run accurately every month, with digital payslips in seconds.' },
  { icon: ShieldCheck, title: 'Secure by design', text: 'ISO 27001:2022 certified company, built in line with the DPDP Act, 2023. Encrypted and backed up daily.' },
];

const BOARDS = ['State Board', 'Matriculation', 'CBSE', 'IB', 'Cambridge', 'Montessori and Pre-School'];

const FAQ = [
  { q: 'Is there a cost to set up?', a: 'Onboarding, data migration and staff training are included free with every plan.' },
  { q: 'How is ChaloSchools priced?', a: 'Per student, per year, with no hidden costs and no lock-in. Book a demo and we will quote for your school.' },
  { q: 'Can you move our existing data?', a: 'Yes. Our team migrates your student, fee and staff records as part of onboarding.' },
];

// Tamil Nadu features, each shown only once the company confirms it in config.
const TN_FEATURES = [
  { on: site.flags.emisSupported, text: 'EMIS export and ID matching' },
  { on: site.flags.samacheerFormats, text: 'Samacheer Kalvi report cards and exam patterns' },
  { on: site.flags.tamilMessaging, text: 'Tamil in the parent app, SMS, WhatsApp and circulars' },
  { on: site.flags.rteAdmissions, text: 'RTE admission and seat tracking' },
  { on: site.flags.tamilTcFormats, text: 'Tamil transfer certificate formats' },
].filter((f) => f.on);

const cta = 'inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-heading transition-colors hover:border-[var(--brand)]';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/"><Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="theme-logo h-10 w-auto" priority /></Link>
          <div className="flex items-center gap-2">
            <CallLink className={cta} />
            <WhatsAppLink className={cta} />
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>Built in Chennai</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-heading sm:text-5xl">School ERP for Tamil Nadu schools</h1>
          <p className="mt-5 max-w-xl text-lg text-subtle">
            One system for admissions, fees, attendance, exams, payroll and transport, with a parent app and WhatsApp alerts. Used by {site.schoolsCount} schools and {site.studentsCount} students.
          </p>
          {site.priceFrom && <p className="mt-4 text-base font-semibold text-heading">{site.priceFrom}</p>}
          {site.launchOffer && <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{site.launchOffer}</p>}
          <ul className="mt-6 space-y-2 text-heading">
            {['Free onboarding, data migration and staff training', 'AI timetable and instant substitutions', 'ISO 27001:2022 certified, built for the DPDP Act'].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{t}</li>
            ))}
          </ul>
        </div>
        <LandingLeadForm source="Ads landing page: School ERP Tamil Nadu" />
      </section>

      <section className="border-y border-border bg-surface-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-4">
          {[
            { v: site.schoolsCount, l: 'Schools' },
            { v: site.studentsCount, l: 'Students' },
            { v: 'ISO 27001', l: 'Certified 2022' },
            { v: 'DPDP', l: 'Act 2023 aligned' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-extrabold text-heading">{s.v}</div>
              <div className="text-sm text-subtle">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-heading sm:text-3xl">Everything your school runs on, in one place</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundColor: 'var(--brand)' }}><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-bold text-heading">{title}</h3>
              <p className="mt-2 text-sm text-subtle">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {TN_FEATURES.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-heading">Made for Tamil Nadu</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {TN_FEATURES.map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-heading"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{f.text}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="text-xl font-bold text-heading">Works for every board</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {BOARDS.map((b) => (
            <span key={b} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-heading">{b}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="text-xl font-bold text-heading">Questions schools ask</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5">
              <dt className="font-semibold text-heading">{f.q}</dt>
              <dd className="mt-1 text-sm text-subtle">{f.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <WhatsAppLink className={cta}>Chat on WhatsApp</WhatsAppLink>
          <CallLink className={cta} />
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-subtle">
        © ChaloSchools · Inspace Edu Solutions Private Limited ·{' '}
        <Link href="/privacy" className="underline">Privacy</Link>
      </footer>
    </div>
  );
}
