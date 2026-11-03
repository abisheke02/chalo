import type { Metadata } from 'next';
import CampusGameHero from '@/components/preview/CampusGameHero';
import ModuleExplorer from '@/components/sections/ModuleExplorer';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Modules page option mod3: the campus as a guided tour, then the module cards. Not linked from the site.
export const metadata: Metadata = { title: 'Modules page mod3', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <CampusGameHero />
      <ModuleExplorer />
      <PreviewSwitcher />
    </>
  );
}
