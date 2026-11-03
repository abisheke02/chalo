import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserPlus, LineChart, Wand2, Mic, CalendarClock, Landmark, Lock, EyeOff, IdCard, Palette, ClipboardList, BadgeCheck, LayoutDashboard, Bot, Fingerprint, Link2, Cloud, Wallet, FolderOpen, Smartphone, ArrowRight, Layers, ShieldCheck, BarChart3, Gauge, UserCog, DatabaseBackup, Clock, Plug, LifeBuoy } from 'lucide-react';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/platform-capabilities');
}

const FEATURES = [
  { icon: UserPlus, title: 'Digital Admissions', desc: '100% paperless. Mobile-first. Enrolments close faster — errors close to zero.' },
  { icon: LineChart, title: 'AI Result Analytics', desc: '360° insights across students, teachers & exams. Spot gaps before they widen.' },
  { icon: Wand2, title: 'AI Rephrase', desc: 'Every message to parents — GPT-polished, consistent, professional. Always.' },
  { icon: Mic, title: 'Voice Broadcast', desc: 'One voice. Thousands of parents. Record or upload a message and broadcast instantly to all parents and staff — in your language, at the right moment.' },
  { icon: CalendarClock, title: 'Smart Timetable', desc: 'Conflict-free schedules. Auto-substitutions. No more spreadsheet marathons.' },
  { icon: Landmark, title: 'Fee Reconciliation', desc: 'Student ID-mapped. Bank-synced. Zero revenue leakage. 100% receipt rate.' },
  { icon: Lock, title: 'Secure Data Vault', desc: 'OTP-verified changes. Role-based access. GoI IT Act 2000 compliant.' },
  { icon: EyeOff, title: 'Data Privacy & Masking', desc: 'Personal data of students and staff is masked by default. Only authorised roles see what they need to — built in line with DPDP Act 2023 data protection principles.' },
  { icon: IdCard, title: 'Profile Management', desc: 'Every student & staff — searchable, lifelong, always a click away.' },
  { icon: Palette, title: 'Multiple Predefined Themes', desc: 'Choose from multiple predefined themes across web, app and admin panels.' },
  { icon: ClipboardList, title: 'Parent Feedback', desc: 'Structured. Actionable. Capture parent sentiment. Close the loop before it becomes a complaint.' },
  { icon: BadgeCheck, title: 'Student & Staff ID Card Generation', desc: 'Instant, print-ready ID cards for every student and staff member. Accurate data, consistent format — generated in seconds, not days.' },
  { icon: LayoutDashboard, title: 'Actionable Dashboard for Every User', desc: 'No more data overload. Every role — from management to admin to teachers — sees exactly what matters to them, with clear next steps built in.' },
  { icon: Bot, title: 'Chatbot for Parents', desc: 'Answers at midnight. No calls, no waiting. Parents get instant responses related to school information — 24/7.' },
  { icon: Fingerprint, title: 'Know Your Parent (KYP)', desc: 'OTP-based profile verification. Verified identities, trusted community — KYP ensures every student profile is authenticated, keeping your school safe and records clean.' },
  { icon: Link2, title: 'Seamless Integrations', desc: 'Biometric · GPS · Tally · WhatsApp · Payment — one unified nerve centre.' },
  { icon: Cloud, title: 'Enterprise Cloud', desc: 'ISO 27001:2022. Multi-tenant isolation. Point-in-time recovery. 99.9% uptime.' },
  { icon: Wallet, title: '24/7 Fee Payments', desc: 'Multi-gateway. Duplicate-proof. Parents pay anytime — you collect always.' },
  { icon: FolderOpen, title: 'Document Hub', desc: 'Instant digital records. No file cabinets. Admin turnaround: days to seconds.' },
  { icon: Smartphone, title: 'Personal Mobile App', desc: 'Exam wishes. Occasion nudges. Community at scale — with a human touch.' },
];

// Same brand gradient palette used site-wide (ProblemsSection, TrustStats, Why Choose Us),
// cycled by index so this page's icon boxes look consistent with the rest of the site.
const GRADIENTS = [
  'from-[#f59e0b] to-[#fbbf24]',
  'from-[#026dde] to-[#00d4ff]',
  'from-[#e11d48] to-[#f87171]',
  'from-[#10b981] to-[#34d399]',
  'from-[#8b5cf6] to-[#a78bfa]',
  'from-[#0891b2] to-[#22d3ee]',
];

const SHADOWS = [
  'shadow-[#f59e0b]/20',
  'shadow-[#026dde]/20',
  'shadow-[#e11d48]/20',
  'shadow-[#10b981]/20',
  'shadow-[#8b5cf6]/20',
  'shadow-[#0891b2]/20',
];

const TECH_CAPABILITIES = [
  { icon: Layers, title: 'Multi-Tenant Architecture', desc: 'Shared infrastructure, fully isolated data per school.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Data encryption in transit and at rest, secure protocols throughout.' },
  { icon: BarChart3, title: 'Data Analytics', desc: 'Real-time reporting with custom dashboards for every role.' },
  { icon: Gauge, title: 'Scalability', desc: 'Elastic scaling and optimized resources as your school grows.' },
  { icon: UserCog, title: 'User Management', desc: 'Role-based access with granular permissions.' },
  { icon: DatabaseBackup, title: 'Backup & Recovery', desc: 'Automated backups with point-in-time recovery.' },
  { icon: Clock, title: 'Access & Availability', desc: '24/7 uptime across web, app, and admin platforms.' },
  { icon: Plug, title: 'Integration', desc: 'API-first design with third-party connectors built in.' },
  { icon: LifeBuoy, title: 'Support', desc: 'Regular platform updates and round-the-clock support.' },
];

export default function PlatformCapabilitiesPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        scene="campus"
        eyebrow="Platform Capabilities"
        title="AI-Powered Feature Suite"
        subtitle="Every capability is included as standard, with no add-on pricing."
        actions={
          <>
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7">
              <Link href="/contact#contact-form">Book a Demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Link href="/product" className="inline-flex items-center gap-1.5 font-semibold text-heading hover:text-primary">
              Explore Modules <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        }
      />

      {/* Feature grid */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => {
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const shadow = SHADOWS[i % SHADOWS.length];
              return (
                <div
                  key={f.title}
                  className="group flex items-start gap-5 bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-[#026dde]/20 transition-all"
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 scale-125 blur-md transition-all duration-300`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-heading mb-1">{f.title}</h3>
                    <p className="text-sm text-subtle leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              Enterprise-Grade Under the Hood
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              The technical foundation every capability above runs on.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {TECH_CAPABILITIES.map((c, i) => {
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const shadow = SHADOWS[i % SHADOWS.length];
              return (
              <div
                key={c.title}
                className="flex items-start gap-4 bg-card rounded-xl border border-border p-5"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg ${shadow} text-white`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-heading mb-1">{c.title}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <p className="text-sm text-subtle font-medium">Uptime</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <p className="text-sm text-subtle font-medium">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-brand-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            See Every Capability in Action
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Book a personalized demo and we&apos;ll walk through exactly which capabilities matter most for your school.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/contact">
                Book a Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-card/10 font-semibold px-8 py-6 text-base rounded-lg transition-all" asChild>
              <Link href="/product">
                Explore the Modules
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
