import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/config/site';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/terms');
}

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        scene="security"
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The terms that govern use of our website and services."
        features={[{ name: 'Clear Terms', line: 'Plain-language service conditions.' }, { name: 'Your Rights', line: 'How your data and account are handled.' }, { name: 'Accountability', line: 'Our obligations to your school.' }]}
      />

      {/* Content */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none space-y-8">
            <p className="text-sm text-subtle">
              <strong>Last updated:</strong> July 2026
            </p>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">1. Agreement to Terms</h2>
              <p className="text-subtle leading-relaxed">
                By accessing and using the ChaloSchools website (chaloschools.com) and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our website or use our services. ChaloSchools is a product of Inspace Edu Solutions Private Limited.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">2. Description of Services</h2>
              <p className="text-subtle leading-relaxed">
                ChaloSchools provides a complete school management software platform (&ldquo;School ERP&rdquo;) that handles administrative and academic operations for schools. Our marketing website allows you to learn about our products, request demonstrations, and contact our team.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">3. User Responsibilities</h2>
              <p className="text-subtle leading-relaxed">When using our website and services, you agree to:</p>
              <ul className="list-disc pl-6 text-subtle space-y-2">
                <li>Provide accurate and truthful information in any forms you submit</li>
                <li>Not use the website for any unlawful purpose or in violation of applicable laws</li>
                <li>Not attempt to gain unauthorized access to any part of the website or its systems</li>
                <li>Not interfere with or disrupt the website&apos;s infrastructure or other users&apos; access</li>
                <li>Not submit false, misleading, or spam enquiries through the contact form</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">4. Intellectual Property</h2>
              <p className="text-subtle leading-relaxed">
                All content on this website — including text, graphics, logos, images, software, and the &ldquo;ChaloSchools&rdquo; and &ldquo;CHALO – Schools Automated&rdquo; brand names — is the property of Inspace Edu Solutions Private Limited and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">5. Contact Form & Enquiries</h2>
              <p className="text-subtle leading-relaxed">
                When you submit an enquiry through our contact form, you consent to being contacted by our sales and support team regarding ChaloSchools products and services. You may opt out of future communications at any time by contacting us directly.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">6. Service Availability</h2>
              <p className="text-subtle leading-relaxed">
                We strive to keep our website accessible at all times. However, we do not guarantee uninterrupted access and may temporarily suspend the website for maintenance, updates, or unforeseen technical issues. We shall not be liable for any loss arising from website unavailability.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">7. Limitation of Liability</h2>
              <p className="text-subtle leading-relaxed">
                To the maximum extent permitted by law, ChaloSchools and Inspace Edu Solutions Private Limited shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or reliance on any information provided herein.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">8. Third-Party Links</h2>
              <p className="text-subtle leading-relaxed">
                Our website may contain links to third-party websites or services that are not owned or controlled by ChaloSchools. We are not responsible for the content, privacy policies, or practices of any third-party websites. We encourage you to review the terms and privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">9. Governing Law</h2>
              <p className="text-subtle leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">10. Changes to Terms</h2>
              <p className="text-subtle leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page with a revised &ldquo;Last updated&rdquo; date. Your continued use of the website after changes are posted constitutes your acceptance of the revised terms.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-heading">11. Contact</h2>
              <p className="text-subtle leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
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
            Ready to Get Started?
          </h2>
          <p className="text-subtle text-lg mb-8 max-w-2xl mx-auto">
            Experience how ChaloSchools can simplify your school administration.
          </p>
          <Button
            size="lg"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/contact">
              Request a Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
