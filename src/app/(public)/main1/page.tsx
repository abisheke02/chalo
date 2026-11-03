import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import SiteContentProvider from '@/components/sections/SiteContentProvider';
import ScrollSection from '@/components/sections/ScrollSection';
import AskYourSchool from '@/components/preview/AskYourSchool';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ModuleCarouselSection from '@/components/sections/ModuleCarouselSection';
import IntegrationTabs from '@/components/sections/IntegrationTabs';
import AiFeatureTabsSection from '@/components/sections/AiFeatureTabsSection';
import BoardTabs from '@/components/sections/BoardTabs';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import SecurityCompliance from '@/components/sections/SecurityCompliance';
import OurApps from '@/components/sections/OurApps';
import ProcessSteps from '@/components/sections/ProcessSteps';
import FinalCTA from '@/components/sections/FinalCTA';
import ClickMenuSection from '@/components/sections/ClickMenuSection';
import CampusGameHero from '@/components/preview/CampusGameHero';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Whole home page option main1: the classroom hero, then the sections in order, with the smaller ones in a click menu.
// Only sections that need no data from the database are here (no testimonials, FAQ or news). Not linked from the site.
export const metadata: Metadata = { title: 'Home page main1', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <SiteContentProvider>
        <HeroSection variant="classroom" />
        <ScrollSection label="Ask your school"><AskYourSchool /></ScrollSection>
        <ScrollSection label="How it works" fit><HowItWorksSection /></ScrollSection>
        <ScrollSection label="Modules" fit><ModuleCarouselSection showIntegrations={false} /></ScrollSection>
        <ScrollSection label="Integrations"><IntegrationTabs /></ScrollSection>
        <ScrollSection label="Built-in intelligence"><AiFeatureTabsSection /></ScrollSection>
        <ScrollSection label="Curricula" fit><BoardTabs /></ScrollSection>
        <ScrollSection label="More" fit>
          <ClickMenuSection
            items={[
              { id: 'data-protection', label: 'Data Protection', content: <SecurityCompliance /> },
              { id: 'why-chalo', label: 'Why ChaloSchools', content: <WhyChooseUs /> },
              { id: 'mobile-apps', label: 'Mobile Apps', content: <OurApps /> },
            ]}
          />
        </ScrollSection>
        <ScrollSection label="Getting started" fit><ProcessSteps /></ScrollSection>
        <ScrollSection label="Get started"><FinalCTA /></ScrollSection>
      </SiteContentProvider>
      <PreviewSwitcher />
    </>
  );
}
