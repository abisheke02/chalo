import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import FAQStructuredData from '@/components/FAQStructuredData';

import { Badge } from '@/components/ui/badge';

import { CheckCircle2, ArrowRight, ShieldCheck, GraduationCap, Smartphone, HeadphonesIcon } from 'lucide-react';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/pricing');
}

const tiers = [

  {

    name: 'Basic',

    tagline: 'For small schools getting started',

    highlight: false,

    features: [

      'Admissions management',

      'Fees & finance',

      'Attendance tracking',

      'Parent & staff mobile apps',

      'Standard reports',

      'Email & chat support',

      'Helpdesk support',

    ],

  },

  {

    name: 'Growth',

    tagline: 'Most popular for growing schools',

    highlight: true,

    features: [

      'Everything in Basic, plus:',

      'Academics, exams & marks portal',

      'Timetable scheduler',

      'Parent app with full engagement',

      'Academic inventory tracking',

      'Transport tracking',

      'Helpdesk support',

      'Advanced reports & analytics',

    ],

  },

  {

    name: 'Enterprise',

    tagline: 'For multi-branch schools & trusts',

    highlight: false,

    features: [

      'Everything in Growth, plus:',

      'Staff, HR & payroll',

      'Transport management',

      'Academic inventory tracking',

      'Multi-branch management',

      'Library management',

      'Helpdesk support',

      'Dedicated account manager & priority support',

    ],

  },

];

const includedInEveryPlan = [

  { icon: GraduationCap, label: 'Free onboarding & data migration', gradient: 'from-[#026dde] to-[#00d4ff]', shadow: 'shadow-[#026dde]/20' },

  { icon: HeadphonesIcon, label: 'Free training for staff', gradient: 'from-[#f59e0b] to-[#fbbf24]', shadow: 'shadow-[#f59e0b]/20' },

  { icon: Smartphone, label: 'Mobile apps for parents, teachers & management', gradient: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/20' },

  { icon: ShieldCheck, label: 'Data security & cloud backup', gradient: 'from-[#8b5cf6] to-[#a78bfa]', shadow: 'shadow-[#8b5cf6]/20' },

];

const faqs = [

  {

    q: 'Is pricing per student or per school?',

    a: 'ChaloSchools is priced per student, per year — so you only pay for what you use, and your cost scales naturally with your school.',

  },

  {

    q: 'Are there setup or onboarding charges?',

    a: 'No. Onboarding, data migration, and staff training are included free with every plan.',

  },

  {

    q: 'Can we upgrade plans later?',

    a: 'Yes. You can move from Basic to Growth to Enterprise at any time as your needs grow — there is no long-term lock-in.',

  },

  {

    q: 'Is there a discount for multi-branch schools or trusts?',

    a: 'Yes. Multi-branch schools and education trusts get custom pricing — request a quote and our team will tailor a plan for your group.',

  },

];

export default function PricingPage() {

  return (

    <>
      <FAQStructuredData faqs={faqs.map((f, i) => ({ id: `pricing-${i}`, question: f.q, answer: f.a, category: 'Pricing' }))} />

      {/* Hero */}

      <PageHero
        scene="pricing"
        eyebrow="Pricing"
        title="Pricing That Scales with Your School"
        subtitle="Priced per student, per year. No hidden costs and no lock-in."
        features={[{ name: 'Basic', line: 'Admissions, fees and attendance.' }, { name: 'Growth', line: 'Adds academics, parent app and WhatsApp.' }, { name: 'Enterprise', line: 'Full suite with priority support.' }]}
      />

      {/* Pricing Tiers */}

      <section className="py-12 md:py-16 bg-card">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

            {tiers.map((tier) => (

              <div key={tier.name} className="relative">

                {tier.highlight && (

                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground border-0 rounded-full px-4">

                    Most Popular

                  </Badge>

                )}

                <div

                  className={`relative flex flex-col h-full rounded-2xl border p-8 transition-all card-lift card-shine ${

                    tier.highlight

                      ? 'border-primary shadow-xl shadow-primary/10 bg-card scale-[1.02]'

                      : 'border-border bg-card hover:border-primary/30 hover:shadow-lg'

                  }`}

                >

                <h3 className="text-2xl font-bold text-heading">{tier.name}</h3>

                <p className="text-sm text-subtle mt-1 mb-6">{tier.tagline}</p>

                <ul className="space-y-3 flex-1">

                  {tier.features.map((f) => (

                    <li key={f} className="flex items-start gap-2.5">

                      <CheckCircle2 className="w-5 h-5 shrink-0 text-primary mt-0.5" />

                      <span className="text-sm text-body">{f}</span>

                    </li>

                  ))}

                </ul>

                <Button

                  asChild

                  className={`mt-8 w-full rounded-full font-semibold ${

                    tier.highlight

                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'

                      : 'bg-card border border-primary text-primary hover:bg-primary hover:text-primary-foreground'

                  }`}

                >

                  <Link href="/contact#contact-form">

                    Get a Custom Quote <ArrowRight className="w-4 h-4 ml-1.5" />

                  </Link>

                </Button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* What's included in every plan */}

      <section className="py-16 md:py-20 bg-surface-2">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-3">

              What&apos;s Included in Every Plan

            </h2>

            <p className="text-body text-lg max-w-2xl mx-auto">

              No matter which plan you choose, you get everything you need to go live with confidence.

            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {includedInEveryPlan.map(({ icon: Icon, label, gradient, shadow }) => (

              <div key={label} className="flex flex-col items-center text-center gap-3 bg-card rounded-xl border border-border p-6">

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} text-white`}>

                  <Icon className="w-6 h-6" />

                </div>

                <p className="text-sm font-medium text-body">{label}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="py-16 md:py-20 bg-card">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">

            <Badge variant="secondary" className="mb-3 bg-[#026dde]/10 text-primary border-[#026dde]/20">

              Pricing FAQ

            </Badge>

            <h2 className="text-2xl md:text-3xl font-bold text-heading">

              Questions About Pricing?

            </h2>

          </div>

          <div className="space-y-4">

            {faqs.map((faq) => (

              <details key={faq.q} className="group bg-card rounded-xl border border-border p-5 open:shadow-sm">

                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">

                  <h3 className="text-base font-semibold text-heading">{faq.q}</h3>

                  <ArrowRight className="w-4 h-4 shrink-0 text-primary transition-transform group-open:rotate-90" />

                </summary>

                <p className="text-sm text-subtle leading-relaxed mt-3">{faq.a}</p>

              </details>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-brand-gradient py-16 md:py-20">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">

            Get Pricing Tailored to Your School

          </h2>

          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">

            Tell us about your school and we&apos;ll put together a plan that fits your size, board, and budget.

          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Button

              size="lg"

              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"

              asChild

            >

              <Link href="/contact#contact-form">

                Get a Custom Quote <ArrowRight className="w-5 h-5 ml-2" />

              </Link>

            </Button>

            <Button

              size="lg"

              variant="outline"

              className="border-white/30 bg-transparent text-white hover:bg-card/10 font-semibold px-8 py-6 text-base rounded-lg transition-all"

              asChild

            >

              <Link href="/contact">Talk to Sales</Link>

            </Button>

          </div>

        </div>

      </section>

    </>

  );

}

