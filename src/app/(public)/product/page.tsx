import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import Link from 'next/link';

import { Button } from '@/components/ui/button';



import ModuleStack from '@/components/sections/ModuleStack';


import { MessageCircle, ArrowRight, CheckCircle2, Shield, Zap, Fingerprint, Navigation, Calculator, CreditCard, Link2 } from 'lucide-react';

import CampusExplorerHero from '@/components/sections/CampusExplorerHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/product');
}

const productFaqs = [

  {

    question: 'What modules does ChaloSchools include?',

    answer: 'ChaloSchools includes 8 standard modules — Admission Management, Student Management, Staff Management, Fee Management, AI-Powered Timetable & Scheduling, Attendance Management, Academic & Examination, and Communication Management — plus add-on modules for Academic Inventory Tracking, Payroll, Library Management, Transport Management, Inspace Performance Insights, and an AI Secretary for school management.',

  },

  {

    question: 'Is ChaloSchools suitable for CBSE, ICSE, IB, or Cambridge schools?',

    answer: 'Yes. ChaloSchools supports Pre School, State & CBSE, IB, Cambridge, Montessori, and Matriculation/Higher Education boards and curricula, with board-specific reporting and workflows.',

  },

  {

    question: 'Does ChaloSchools have a mobile app?',

    answer: 'Yes — ChaloSchools includes three dedicated apps: Chaloschools for parents, AnsApp for teachers, and C-365 for school management, each built for its specific role.',

  },

  {

    question: 'Is student and staff data secure with ChaloSchools?',

    answer: 'ChaloSchools is ISO 27001:2022 certified and follows DPDP Act 2023 data protection principles, with role-based access, OTP-verified changes, and personal data masked by default for unauthorised roles.',

  },

  {

    question: 'How does ChaloSchools handle setup and training?',

    answer: 'ChaloSchools includes free setup and training as part of onboarding — the team handles data migration and configuration so schools can go live without needing in-house technical staff.',

  },

];

export default async function ProductPage() {

  return (

    <>

      {/* Hero Section */}

      <CampusExplorerHero title="Everything Your School Needs, in One Platform" tags={false} />

      {/* Highlights Bar */}

      <section className="bg-surface-2 border-y border-border">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">

            <div className="flex items-center justify-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#026dde] to-[#00d4ff] flex items-center justify-center shadow-lg shadow-[#026dde]/20 text-white">

                <Shield className="w-5 h-5" />

              </div>

              <span className="text-sm font-medium text-heading">ISO 27001:2022 Certified</span>

            </div>

            <div className="flex items-center justify-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center shadow-lg shadow-[#f59e0b]/20 text-white">

                <Zap className="w-5 h-5" />

              </div>

              <span className="text-sm font-medium text-heading">All Modules</span>

            </div>

            <div className="flex items-center justify-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 text-white">

                <Link2 className="w-5 h-5" />

              </div>

              <span className="text-sm font-medium text-heading">5 Integrations</span>

            </div>

            <div className="flex items-center justify-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center shadow-lg shadow-[#10b981]/20 text-white">

                <CheckCircle2 className="w-5 h-5" />

              </div>

              <span className="text-sm font-medium text-heading">All Boards Supported</span>

            </div>

          </div>

        </div>

      </section>

      {/* What is ChaloSchools — direct, citable definition */}

      <section className="bg-card py-10 md:py-12">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">What is ChaloSchools?</h2>

          <p className="text-lg text-body leading-relaxed">

            ChaloSchools is a school management ERP built for K-12 schools in India. It replaces spreadsheets,

            WhatsApp groups, and paper registers with one platform covering admissions, fee collection, attendance,

            timetable scheduling, staff management, and parent communication — used by 200+ schools serving 1.5+ Million students,

            with dedicated apps for parents, teachers, and school management.

          </p>

        </div>

      </section>

      {/* Module Explorer — click a module name to see its details, instead of
          scrolling past all 14 full sections stacked one after another */}

      <ModuleStack />

      {/* Integrations */}
      <section className="py-10 bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-subtle uppercase tracking-wider mb-6">Seamless Integrations</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Fingerprint, label: 'Biometric Attendance', gradient: 'from-[#026dde] to-[#00d4ff]', shadow: 'shadow-[#026dde]/30' },
              { icon: Navigation, label: 'GPS Fleet Tracking', gradient: 'from-[#f59e0b] to-[#fbbf24]', shadow: 'shadow-[#f59e0b]/30' },
              { icon: Calculator, label: 'Tally ERP', gradient: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/30' },
              { icon: CreditCard, label: 'Online Payment Gateway', gradient: 'from-[#8b5cf6] to-[#a78bfa]', shadow: 'shadow-[#8b5cf6]/30' },
              { icon: MessageCircle, label: 'WhatsApp', gradient: 'from-[#0891b2] to-[#22d3ee]', shadow: 'shadow-[#0891b2]/30' },
            ].map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all"
              >
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${it.gradient} flex items-center justify-center shrink-0 shadow-sm ${it.shadow}`}>
                  <it.icon className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="text-sm font-medium text-heading">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product FAQ */}

      <section className="py-12 md:py-16 bg-surface-2">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-2xl md:text-3xl font-bold text-heading text-center mb-10">Frequently Asked Questions</h2>

          <div className="space-y-3">

            {productFaqs.map((faq) => (

              <details key={faq.question} className="group bg-card rounded-xl border border-border p-5 open:shadow-sm">

                <summary className="flex items-center justify-between cursor-pointer font-semibold text-heading list-none">

                  {faq.question}

                  <ArrowRight className="w-4 h-4 shrink-0 text-primary transition-transform group-open:rotate-90" />

                </summary>

                <p className="mt-3 text-sm text-body leading-relaxed">{faq.answer}</p>

              </details>

            ))}

          </div>

        </div>

      </section>

      <script

        type="application/ld+json"

        dangerouslySetInnerHTML={{

          __html: safeJsonLd({

            '@context': 'https://schema.org',

            '@type': 'FAQPage',

            mainEntity: productFaqs.map((faq) => ({

              '@type': 'Question',

              name: faq.question,

              acceptedAnswer: { '@type': 'Answer', text: faq.answer },

            })),

          }),

        }}

      />

      {/* CTA Section */}

      <section className="py-12 md:py-16 bg-brand-gradient">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">

            Ready to See It in Action?

          </h2>

          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">

            Book a personalized demo and see how ChaloSchools fits your school&apos;s specific needs. No commitment, no pressure.

          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Button

              size="lg"

              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"

              asChild

            >

              <Link href="/contact">

                Book a Demo

                <ArrowRight className="w-5 h-5 ml-2" />

              </Link>

            </Button>

            <Button

              size="lg"

              variant="outline"

              className="border-white/30 bg-transparent text-white hover:bg-card/10 font-semibold px-8 py-6 text-base rounded-lg transition-all"

              asChild

            >

              <Link href="/compare">

                Compare With Alternatives

                <ArrowRight className="w-5 h-5 ml-2" />

              </Link>

            </Button>

          </div>

        </div>

      </section>

    </>

  );

}

