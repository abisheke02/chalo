import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import Header from '@/components/sections/Header';

import HeroSection from '@/components/sections/HeroSection';
import AskYourSchool from '@/components/preview/AskYourSchool';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import AiFeatureTabsSection from '@/components/sections/AiFeatureTabsSection';
import IntegrationTabs from '@/components/sections/IntegrationTabs';

import TrustStats from '@/components/sections/TrustStats';

import SocialProofBar from '@/components/sections/SocialProofBar';

import ProblemsSection from '@/components/sections/ProblemsSection';

import ModuleCarouselSection from '@/components/sections/ModuleCarouselSection';
import ScrollProgress from '@/components/sections/ScrollProgress';
import ScrollSection from '@/components/sections/ScrollSection';
import SectionRail from '@/components/sections/SectionRail';
import ClickMenuSection, { type MoreItem } from '@/components/sections/ClickMenuSection';

import OurApps from '@/components/sections/OurApps';


import WhyChooseUs from '@/components/sections/WhyChooseUs';

import SecurityCompliance from '@/components/sections/SecurityCompliance';

import BoardTabs from '@/components/sections/BoardTabs';

import ProcessSteps from '@/components/sections/ProcessSteps';

import TestimonialsSection from '@/components/sections/TestimonialsSection';

import HomepageFAQ from '@/components/sections/HomepageFAQ';

import DemoVideo from '@/components/sections/DemoVideo';

import { DEMO_VIDEO_IDS } from '@/data/demo-videos';

import fs from 'node:fs';

import path from 'node:path';

import CaseStudySnapshot from '@/components/sections/CaseStudySnapshot';

import PricingTeaser from '@/components/sections/PricingTeaser';

import BlogStrip from '@/components/sections/BlogStrip';

import FinalCTA from '@/components/sections/FinalCTA';

import Footer from '@/components/sections/Footer';

import SiteContentProvider from '@/components/sections/SiteContentProvider';

import FAQStructuredData from '@/components/FAQStructuredData';

import SoftwareApplicationStructuredData from '@/components/SoftwareApplicationStructuredData';

import FloatingWhatsApp from '@/components/FloatingWhatsApp';

import ChatBot from '@/components/ChatBot';

import { db } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/');
}

// Safely parse the CaseStudy.stats JSON string into [{label, value}].

function parseCaseStudyStats(raw: string | null): { label: string; value: string }[] {

  if (!raw) return [];

  try {

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {

      return parsed

        .filter((s) => s && typeof s.label === 'string' && typeof s.value === 'string')

        .map((s) => ({ label: s.label, value: s.value }));

    }

  } catch {

    // ignore malformed stats — section will render without stat callouts

  }

  return [];

}

export default async function Home() {

  const [testimonials, faqs, latestPosts, featuredCaseStudy, visibilityRows] = await Promise.all([

    db.testimonial.findMany({

      where: { published: true },

      orderBy: { order: 'asc' },

      select: { id: true, name: true, role: true, school: true, content: true, rating: true },

    }),

    db.fAQ.findMany({

      where: { published: true },

      orderBy: { order: 'asc' },

      select: { id: true, question: true, answer: true, category: true },

    }),

    db.blogPost.findMany({

      where: { published: true },

      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],

      take: 3,

      select: { id: true, title: true, slug: true, excerpt: true, category: true, coverImage: true, publishedAt: true },

    }),

    db.caseStudy.findFirst({

      where: { published: true },

      orderBy: { createdAt: 'desc' },

      select: { slug: true, title: true, excerpt: true, schoolName: true, location: true, board: true, stats: true },

    }),

    db.siteContent.findMany({

      where: { key: { startsWith: 'visibility_' } },

      select: { key: true, value: true },

    }),

  ]);

  const caseStudy = featuredCaseStudy

    ? { ...featuredCaseStudy, stats: parseCaseStudyStats(featuredCaseStudy.stats) }

    : null;

  // Missing row = never toggled off = visible by default.

  // Only offer walkthrough videos whose files have actually been uploaded.

  const availableVideos = DEMO_VIDEO_IDS.filter((id) => fs.existsSync(path.join(process.cwd(), 'public', 'videos', `${id}.mp4`)));

  const isVisible = (key: string) => visibilityRows.find((r) => r.key === `visibility_${key}`)?.value !== 'false';

  // Ten smaller sections live together in one click menu (Data Protection, Why ChaloSchools, Mobile Apps, Our numbers, and so on). Each still
  // follows its switch in Admin > Section Visibility, and the case study and news only appear when there is something to show.
  const moreItems = [
    isVisible('security_compliance') && { id: 'data-protection', label: 'Data Protection', content: <SecurityCompliance /> },
    isVisible('why_choose_us') && { id: 'why-chalo', label: 'Why ChaloSchools', content: <WhyChooseUs /> },
    isVisible('our_apps') && { id: 'mobile-apps', label: 'Mobile Apps', content: <OurApps /> },
    isVisible('trust_stats') && { id: 'numbers', label: 'Our numbers', content: <TrustStats /> },
    isVisible('social_proof') && { id: 'schools', label: 'Schools using us', content: <SocialProofBar /> },
    isVisible('problems') && { id: 'problems', label: 'Problems we fix', content: <ProblemsSection /> },
    isVisible('demo_video') && { id: 'demo', label: 'Product demo', content: <DemoVideo available={availableVideos} /> },
    isVisible('case_study') && caseStudy && { id: 'case-study', label: 'Case study', content: <CaseStudySnapshot caseStudy={caseStudy} /> },
    isVisible('pricing_teaser') && { id: 'pricing', label: 'Pricing', content: <PricingTeaser /> },
    isVisible('blog_strip') && latestPosts.length > 0 && { id: 'news', label: 'Latest news', content: <BlogStrip posts={latestPosts} /> },
  ].filter(Boolean) as MoreItem[];

  return (

    <div className="min-h-screen flex flex-col">

      <ScrollProgress />

      <Header />

      <FAQStructuredData faqs={faqs} />

      <SoftwareApplicationStructuredData testimonials={testimonials} />

      <SiteContentProvider>

        <main className="flex-1">
          <SectionRail />
          {/* 1. Hero */}
          <div data-section="Home">
            <HeroSection />
          </div>
          {/* The sections come in this order. Each one fades up as it scrolls into view (ScrollSection), and the dots at the
              edge of the page follow them. The smaller sections are in the click menu (moreItems above). */}
          {isVisible('ask_school') && <ScrollSection label="Ask your school"><AskYourSchool /></ScrollSection>}
          {isVisible('how_it_works') && <ScrollSection label="How it works" fit><HowItWorksSection /></ScrollSection>}
          {isVisible('features') && <ScrollSection label="Modules" fit><ModuleCarouselSection showIntegrations={false} /></ScrollSection>}
          {isVisible('integrations') && <ScrollSection label="Integrations"><IntegrationTabs /></ScrollSection>}
          {isVisible('ai_tabs') && <ScrollSection label="Built-in intelligence"><AiFeatureTabsSection /></ScrollSection>}
          {isVisible('board_tabs') && <ScrollSection label="Curricula" fit><BoardTabs /></ScrollSection>}
          {moreItems.length > 0 && <ScrollSection label="More" fit><ClickMenuSection items={moreItems} /></ScrollSection>}
          {isVisible('testimonials') && <ScrollSection label="Testimonials"><TestimonialsSection testimonials={testimonials} /></ScrollSection>}
          {isVisible('faq') && <ScrollSection label="FAQ"><HomepageFAQ faqs={faqs} /></ScrollSection>}
          {isVisible('process_steps') && <ScrollSection label="Getting started" fit><ProcessSteps /></ScrollSection>}
          {isVisible('final_cta') && <ScrollSection label="Get started"><FinalCTA /></ScrollSection>}
        </main>

      </SiteContentProvider>

      {/* Footer */}

      <Footer />

      <FloatingWhatsApp />

      <ChatBot />

    </div>

  );

}

