import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import SiteContentProvider from '@/components/sections/SiteContentProvider';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Home hero option (classroom). Not linked from the site. Remove when one is chosen.
export const metadata: Metadata = { title: 'Home hero pre2', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <SiteContentProvider>
        <HeroSection variant="classroom" />
      </SiteContentProvider>
      <PreviewSwitcher />
    </>
  );
}
