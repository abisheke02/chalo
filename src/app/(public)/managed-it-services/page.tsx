import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { MANAGED_SERVICES } from '@/data/managed-services';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/managed-it-services');
}

export default function ManagedItServicesPage() {
  return (
    <>
      <PageHero
        scene="security"
        eyebrow="Beyond Software"
        title="Managed IT services for schools"
        subtitle="Infrastructure, security and support for your campus, from Inspace Technologies, the company behind ChaloSchools."
        features={[
          { name: 'Managed Infrastructure', line: 'Servers, smart classrooms and CCTV.' },
          { name: 'Cybersecurity Audit', line: 'Testing, scans and remediation.' },
          { name: '24/7 Support', line: 'SLA-backed on-site and remote help.' },
        ]}
        actions={
          <Button asChild size="lg" className="text-white" style={{ backgroundColor: 'var(--brand)' }}>
            <Link href="/contact#contact-form">Discuss your campus <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        }
      />

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-heading md:text-3xl">What we manage for schools</h2>
          <p className="mt-2 max-w-2xl text-subtle">Six service lines, each available on its own or alongside ChaloSchools.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MANAGED_SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${s.gradient} ${s.shadow}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-heading">{s.title}</h3>
                <p className="mt-2 text-sm text-subtle">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-2 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-heading">Why schools ask us</h2>
          <p className="mt-4 text-body">
            ChaloSchools is built by Inspace, an ISO 27001:2022 certified company, so the same team that runs your school software can look after the network, security and devices it depends on.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="text-white" style={{ backgroundColor: 'var(--brand)' }}>
              <Link href="/contact#contact-form">Talk to our team</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/product">See the school ERP</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
