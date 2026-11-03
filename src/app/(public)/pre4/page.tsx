import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import SiteContentProvider from '@/components/sections/SiteContentProvider';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Home hero option (classroom on a real photo). The picture goes at public/images/hero-classroom.jpg; until it is there the
// background is a plain soft blue. Not linked from the site. Remove when one is chosen.
export const metadata: Metadata = { title: 'Home hero pre4', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <SiteContentProvider>
        <HeroSection variant="photo" />
      </SiteContentProvider>
      <PreviewSwitcher />
    </>
  );
}
