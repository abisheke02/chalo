import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { site } from '@/config/site';
import ContactForm from '@/components/sections/ContactForm';
import FAQSection from '@/components/sections/FAQSection';
import FAQStructuredData from '@/components/FAQStructuredData';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/db';
import { getContent } from '@/lib/get-site-content';
import { pageMetadata } from '@/lib/seo';

import PageHero from '@/components/PageHero';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/contact');
}

// Fallback values
const FALLBACK_HERO_TITLE = 'Contact Us';
const FALLBACK_HERO_SUBTITLE = "Have questions about ChaloSchools? Want a free demo? Our team is ready to help you find the perfect solution for your school.";
const FALLBACK_FORM_TITLE = 'Send Us a Message';
const FALLBACK_FORM_SUBTITLE = "Fill out the form below and we'll get back to you within 24 hours.";
const FALLBACK_OFFICE_TITLE = 'Visit Our Office';
const FALLBACK_ADDRESS = 'AA Business Centre, 4th Floor, Old Door No.94/1 & 2, New No.27 and 28, East Park Road, Shenoy Nagar, Chennai 600030, Tamil Nadu, India';
const FALLBACK_PHONE_HELPLINE = '+91 96777 32728';
const FALLBACK_PHONE_SALES = '+91 99622 28160';
const FALLBACK_PHONE_LANDLINE = '+91 44 4353 1781';
const FALLBACK_EMAIL = site.email;

export default async function ContactPage() {
  const [faqs, siteContentRecords] = await Promise.all([
    db.fAQ.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    db.siteContent.findMany(),
  ]);

  const sc = new Map(siteContentRecords.map((r) => [r.key, r.value]));

  const heroTitle = getContent(sc, 'contact_hero_title', FALLBACK_HERO_TITLE);
  const heroSubtitle = getContent(sc, 'contact_hero_subtitle', FALLBACK_HERO_SUBTITLE);
  const formTitle = getContent(sc, 'contact_form_title', FALLBACK_FORM_TITLE);
  const formSubtitle = getContent(sc, 'contact_form_subtitle', FALLBACK_FORM_SUBTITLE);
  const officeTitle = getContent(sc, 'contact_office_title', FALLBACK_OFFICE_TITLE);
  const address = getContent(sc, 'contact_address', FALLBACK_ADDRESS);
  const phoneHelpline = getContent(sc, 'contact_phone_helpline', FALLBACK_PHONE_HELPLINE);
  const phoneSales = getContent(sc, 'contact_phone_sales', FALLBACK_PHONE_SALES);
  const phoneLandline = getContent(sc, 'contact_phone_landline', FALLBACK_PHONE_LANDLINE);
  const contactEmail = getContent(sc, 'contact_email', FALLBACK_EMAIL);
  const mapUrl = getContent(sc, 'contact_map_url', 'https://www.google.com/maps?q=AA+Business+Centre+4th+Floor+East+Park+Road+Shenoy+Nagar+Chennai+600030&output=embed');

  const contactInfo = [
    { icon: Phone, label: 'Helpline', value: phoneHelpline, href: `tel:${phoneHelpline.replace(/\s/g, '')}`, color: '#026dde', gradient: 'from-[#026dde] to-[#00d4ff]', shadow: 'shadow-[#026dde]/20' },
    { icon: Mail, label: 'Email', value: contactEmail, href: `mailto:${contactEmail}`, color: '#f59e0b', gradient: 'from-[#f59e0b] to-[#fbbf24]', shadow: 'shadow-[#f59e0b]/20' },
    { icon: MapPin, label: 'Office', value: 'Chennai 600030, Tamil Nadu', href: null, color: '#10b981', gradient: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/20' },
    { icon: Clock, label: 'Business Hours', value: 'Mon – Fri.\n9:30 AM – 6:30 PM IST', href: null, color: '#8b5cf6', gradient: 'from-[#8b5cf6] to-[#a78bfa]', shadow: 'shadow-[#8b5cf6]/20' },
  ];

  return (
    <>
      <FAQStructuredData faqs={faqs} />
      {/* Hero Section */}
      <PageHero
        scene="communication"
        eyebrow="Contact Us"
        title={heroTitle}
        subtitle={heroSubtitle}
        features={[{ name: 'Talk to Our Team', line: 'Sales and support across India.' }, { name: 'Quick Response', line: 'Replies within one business day.' }, { name: 'Every Channel', line: 'Phone, email and WhatsApp.' }]}
      />

      {/* Contact Info Cards */}
      <section className="pt-12 pb-6 md:pt-16 md:pb-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {contactInfo.map((item) => {
              const IconComp = item.icon;
              return (
                <Card
                  key={item.label}
                  className="shadow-lg border-0 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="pt-6 text-center">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${item.shadow} text-white`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-subtle mb-1">{item.label}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-heading font-semibold hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-heading font-semibold whitespace-pre-line">{item.value}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Map Section */}
      <section id="contact-form" className="pt-6 pb-12 md:pt-8 md:pb-16 bg-card scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Form */}
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                {formTitle}
              </h2>
              <p className="text-subtle mb-6">
                {formSubtitle}
              </p>
              <div className="flex-1">
                <ContactForm />
              </div>
            </div>

            {/* Map & Address */}
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">
                {officeTitle}
              </h2>
              <p className="text-subtle mb-6">
                Come meet us in person or schedule a visit.
              </p>

              <Card className="border-0 shadow-lg flex-1 flex flex-col">
                <CardContent className="pt-5 pb-5 flex flex-col flex-1">
                  {/* Google Maps Embed */}
                  <div className="w-full flex-1 min-h-[200px] rounded-xl bg-surface-2 border border-border overflow-hidden">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.75rem' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="ChaloSchools Office Location"
                      className="w-full h-full rounded-xl border border-border"
                    />
                  </div>

                  {/* Address */}
                  <div className="mt-3 p-2.5 rounded-lg bg-surface-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                      <p className="text-xs text-body leading-relaxed">{address}</p>
                    </div>
                  </div>

                  {/* Contact details strip */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a href={`tel:${phoneSales.replace(/\s/g, '')}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2 hover:bg-[#026dde]/5 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-heading">{phoneSales}</span>
                    </a>
                    <a href={`tel:${phoneLandline.replace(/\s/g, '')}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2 hover:bg-[#026dde]/5 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-heading">{phoneLandline}</span>
                    </a>
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2 hover:bg-[#f59e0b]/5 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                      <span className="text-xs font-medium text-heading">{contactEmail}</span>
                    </a>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-2">
                      <Clock className="w-3.5 h-3.5 text-[#8b5cf6] shrink-0" />
                      <span className="text-xs font-medium text-heading">Mon – Fri, 9:30 – 6:30 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - dynamically loaded from admin panel */}
      <FAQSection faqs={faqs} />
    </>
  );
}