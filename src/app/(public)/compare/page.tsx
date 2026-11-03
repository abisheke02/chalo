import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle, Shield } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/compare');
}

type Support = 'yes' | 'no' | 'partial';

interface ComparisonRow {
  feature: string;
  chalo: Support;
  excel: Support;
  whatsapp: Support;
  genericErp: Support;
}

const comparisonData: ComparisonRow[] = [
  { feature: 'Online Admissions & Enquiry Tracking', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'Automated Fee Collection & Reminders', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'Online Payment Gateway (Razorpay, etc.)', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'One-Tap Attendance with Parent Notifications', chalo: 'yes', excel: 'no', whatsapp: 'partial', genericErp: 'partial' },
  { feature: 'AI Timetable Scheduler (Zero Conflicts)', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'no' },
  { feature: 'Dedicated Parent & Student Mobile App', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'WhatsApp & SMS Notifications Built-In', chalo: 'yes', excel: 'no', whatsapp: 'partial', genericErp: 'no' },
  { feature: 'Exam & Marks Portal with Report Cards', chalo: 'yes', excel: 'partial', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'Transport & GPS Bus Tracking', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'no' },
  { feature: 'Staff HR, Payroll & Leave Management', chalo: 'yes', excel: 'partial', whatsapp: 'no', genericErp: 'yes' },
  { feature: 'Library Management', chalo: 'yes', excel: 'partial', whatsapp: 'no', genericErp: 'no' },
  { feature: 'Real-Time Dashboards & Analytics', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'Multi-Board Support (CBSE, ICSE, IB, State)', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'no' },
  { feature: 'ISO 27001:2022 Data Security', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'Dedicated Success Manager & Training', chalo: 'yes', excel: 'no', whatsapp: 'no', genericErp: 'partial' },
  { feature: 'No IT Team Required to Operate', chalo: 'yes', excel: 'yes', whatsapp: 'yes', genericErp: 'no' },
  { feature: 'Works on Slow/Mobile Internet', chalo: 'yes', excel: 'partial', whatsapp: 'yes', genericErp: 'partial' },
];

function SupportIcon({ value }: { value: Support }) {
  switch (value) {
    case 'yes':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'no':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'partial':
      return <MinusCircle className="w-5 h-5 text-amber-400" />;
  }
}

function SupportLabel({ value }: { value: Support }) {
  switch (value) {
    case 'yes':
      return <span className="text-xs font-medium text-emerald-600">Yes</span>;
    case 'no':
      return <span className="text-xs font-medium text-red-400">No</span>;
    case 'partial':
      return <span className="text-xs font-medium text-amber-500">Partial</span>;
  }
}

const painPoints = [
  {
    title: 'Excel / Spreadsheets',
    problems: [
      'No automation — every entry is manual and error-prone',
      'No parent communication or notifications',
      'Data lives on one person\'s laptop — single point of failure',
      'No mobile access for teachers or parents',
      'Reporting is painful and always out of date',
    ],
  },
  {
    title: 'WhatsApp Groups',
    problems: [
      'Messages get buried — no way to track action items',
      'No data privacy — anyone in the group sees everything',
      'Can\'t collect fees, mark attendance, or generate reports',
      'Parents get annoyed with 50+ group notifications daily',
      'Zero analytics or institutional knowledge retention',
    ],
  },
  {
    title: 'Generic ERP Software',
    problems: [
      'Not built for schools — you pay for features you\'ll never use',
      'No multi-board academic structure support (CBSE, ICSE, IB)',
      'Complex setup requiring IT team to configure and maintain',
      'No parent-facing mobile app or WhatsApp integration',
      'Expensive per-user licensing not designed for school budgets',
    ],
  },
];

export default function ComparePage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        scene="performance-insights"
        eyebrow="Why ChaloSchools"
        title="ChaloSchools vs. the Alternatives"
        subtitle="How ChaloSchools compares with spreadsheets, WhatsApp groups and generic ERP software."
        features={[{ name: 'Complete Visibility', line: 'One view of the whole school.' }, { name: 'Side-by-Side Comparison', line: 'Feature by feature, option by option.' }, { name: 'Gaps Identified', line: 'What manual tools leave out.' }]}
      />

      {/* Pain Points Section */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              The Problem With Current Approaches
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              Schools across India are stuck with tools that weren&apos;t designed for education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((item) => (
              <Card key={item.title} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-heading mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.problems.map((problem) => (
                      <li key={problem} className="flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-subtle">{problem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20">
              <Shield className="w-4 h-4 mr-2" />
              Feature Comparison
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              A clear, honest comparison of what each approach offers for school management.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-heading">Feature</th>
                  <th className="text-center px-4 py-4">
                    <div className="text-sm font-bold text-primary">ChaloSchools</div>
                    <div className="text-[10px] text-subtle">Purpose-built</div>
                  </th>
                  <th className="text-center px-4 py-4">
                    <div className="text-sm font-semibold text-heading">Excel</div>
                    <div className="text-[10px] text-subtle">Spreadsheets</div>
                  </th>
                  <th className="text-center px-4 py-4">
                    <div className="text-sm font-semibold text-heading">WhatsApp</div>
                    <div className="text-[10px] text-subtle">Groups</div>
                  </th>
                  <th className="text-center px-4 py-4">
                    <div className="text-sm font-semibold text-heading">Generic ERP</div>
                    <div className="text-[10px] text-subtle">Tally, Zoho, etc.</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={row.feature} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-card' : 'bg-surface-2'}`}>
                    <td className="px-6 py-3.5 text-sm text-body font-medium">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <SupportIcon value={row.chalo} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <SupportIcon value={row.excel} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <SupportIcon value={row.whatsapp} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <SupportIcon value={row.genericErp} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {comparisonData.map((row) => (
              <Card key={row.feature} className="border-border">
                <CardContent className="pt-4 pb-4 px-4">
                  <p className="text-sm font-medium text-heading mb-3">{row.feature}</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-primary font-bold mb-1">Chalo</p>
                      <SupportLabel value={row.chalo} />
                    </div>
                    <div>
                      <p className="text-[10px] text-subtle font-medium mb-1">Excel</p>
                      <SupportLabel value={row.excel} />
                    </div>
                    <div>
                      <p className="text-[10px] text-subtle font-medium mb-1">WhatsApp</p>
                      <SupportLabel value={row.whatsapp} />
                    </div>
                    <div>
                      <p className="text-[10px] text-subtle font-medium mb-1">ERP</p>
                      <SupportLabel value={row.genericErp} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-subtle">Full support</span>
            </div>
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-subtle">Partial / manual</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-subtle">Not available</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
            Ready to Upgrade?
          </h2>
          <p className="text-subtle text-lg mb-8 max-w-2xl mx-auto">
            Join schools across India that have moved from spreadsheets and WhatsApp groups to a purpose-built school management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
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
              className="border-[#026dde] text-primary hover:bg-[#026dde] hover:text-white font-semibold px-8 py-6 text-base rounded-lg transition-all"
              asChild
            >
              <Link href="/product">
                Explore All Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
