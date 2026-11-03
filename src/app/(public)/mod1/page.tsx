import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ModuleExplorer from '@/components/sections/ModuleExplorer';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Modules page option mod1: words on the left, the campus on the right. Not linked from the site.
export const metadata: Metadata = { title: 'Modules page mod1', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <PageHero
        scene="campus"
        eyebrow="Product"
        title="Everything Your School Needs, in One Platform"
        subtitle="From admissions to analytics. Select a building to explore a module."
      />
      <ModuleExplorer />
      <PreviewSwitcher />
    </>
  );
}
