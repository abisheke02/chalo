import type { Metadata } from 'next';
import CampusExplorerHero from '@/components/sections/CampusExplorerHero';
import ModuleExplorer from '@/components/sections/ModuleExplorer';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Modules page option mod4: the whole campus on the left, one module's details on the right that change by themselves.
// This is also what /product shows now. Not linked from the site.
export const metadata: Metadata = { title: 'Modules page mod4', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <CampusExplorerHero title="Everything Your School Needs, in One Platform" />
      <ModuleExplorer />
      <PreviewSwitcher />
    </>
  );
}
