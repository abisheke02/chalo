import type { Metadata } from 'next';
import CampusExplorerHero from '@/components/sections/CampusExplorerHero';
import ModuleStack from '@/components/sections/ModuleStack';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Modules page option mod5: the campus hero seen like street view (walk from the gate to each building, drag to look around), then every module as a stacking card (each pins a little lower than the one before,
// and is pushed back as the next slides over it). Not linked from the site.
export const metadata: Metadata = { title: 'Modules page mod5', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <CampusExplorerHero title="Everything Your School Needs, in One Platform" streetView />
      <ModuleStack />
      <PreviewSwitcher />
    </>
  );
}
