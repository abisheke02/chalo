import type { Metadata } from 'next';
import CampusGameHero from '@/components/preview/CampusGameHero';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Home hero option (campus game). Not linked from the site. Remove when one is chosen.
export const metadata: Metadata = { title: 'Home hero pre3', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <CampusGameHero />
      <PreviewSwitcher />
    </>
  );
}
