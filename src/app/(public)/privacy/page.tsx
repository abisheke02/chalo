import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/config/site';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/privacy');
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        scene="security"
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use and protect your information."
        features={[{ name: 'Protected Data', line: 'Encrypted at rest and in transit.' }, { name: 'Restricted Access', line: 'Only authorised users can view records.' }, { name: 'Full Transparency', line: 'Every access is logged.' }]}
      />

      {/* Content */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none space-y-8">
            <p className="text-sm text-subtle">
              <strong>Last updated:</strong> July 2026
            </p>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">1. Introduction</h2>
              <p className="text-subtle leading-relaxed">
                ChaloSchools (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is a product of Inspace Edu Solutions Private Limited. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at chaloschools.com and use our services. Please read this privacy policy carefully.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">2. Information We Collect</h2>
              <p className="text-subtle leading-relaxed">
                When you use our contact form or request a demo, we collect the following personal information:
              </p>
              <ul className="list-disc pl-6 text-subtle space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Name of your school or institution</li>
                <li>City</li>
                <li>Number of students (range)</li>
                <li>Current software used for school management</li>
                <li>Any additional message you choose to provide</li>
              </ul>
              <p className="text-subtle leading-relaxed">
                We do not collect sensitive personal data such as financial information, Aadhaar numbers, or biometric data through our marketing website.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">3. How We Use Your Information</h2>
              <p className="text-subtle leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-subtle space-y-2">
                <li>To respond to your enquiry and schedule product demonstrations</li>
                <li>To communicate with you about our products and services</li>
                <li>To improve our website and services based on feedback</li>
                <li>To comply with applicable legal obligations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">4. Data Storage & Security</h2>
              <p className="text-subtle leading-relaxed">
                Your data is stored securely on our servers. As an ISO 27001:2022 certified company, we implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption of data in transit and at rest, access controls, and regular security audits.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">5. Data Sharing</h2>
              <p className="text-subtle leading-relaxed">
                We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-subtle space-y-2">
                <li>With our internal team members who need access to respond to your enquiry</li>
                <li>When required to comply with a legal obligation, regulation, or government request</li>
                <li>To protect and defend the rights or property of ChaloSchools</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">6. Cookies</h2>
              <p className="text-subtle leading-relaxed">
                Currently, our marketing website does not set any tracking cookies. If you log in to the admin panel, a session cookie is used solely to maintain your authenticated session. We do not use third-party advertising cookies on this website.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">7. Data Retention</h2>
              <p className="text-subtle leading-relaxed">
                We retain your contact information for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable laws. If you wish to have your data deleted, please contact us using the details below.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">8. Your Rights</h2>
              <p className="text-subtle leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-subtle space-y-2">
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for future communications at any time</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">9. Changes to This Policy</h2>
              <p className="text-subtle leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will post the updated policy on this page with a revised &ldquo;Last updated&rdquo; date.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">10. Contact Us</h2>
              <p className="text-subtle leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or wish to exercise your data rights, please contact us at:
              </p>
              <div className="bg-surface-2 border border-border rounded-lg p-6 space-y-2">
                <p className="text-heading font-semibold">Inspace Edu Solutions Private Limited</p>
                <p className="text-subtle text-sm">AA Business Centre, 4th Floor, Old Door No.94/1 & 2, New No.27 and 28, East Park Road, Shenoy Nagar, Chennai, Tamil Nadu 600030</p>
                <p className="text-subtle text-sm">Email: <a href={`mailto:${site.email}`} className="text-primary hover:underline">{site.email}</a></p>
                <p className="text-subtle text-sm">Phone: <a href="tel:+919962228160" className="text-primary hover:underline">+91 99622 28160</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Have Questions?
          </h2>
          <p className="text-subtle text-lg mb-8 max-w-2xl mx-auto">
            If you have any privacy-related concerns, feel free to reach out to our team.
          </p>
          <Button
            size="lg"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/contact">
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
