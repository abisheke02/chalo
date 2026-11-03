import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ModuleExplorer from '@/components/sections/ModuleExplorer';
import PreviewSwitcher from '@/components/preview/PreviewSwitcher';

// Modules page option mod2: words and buttons centred on top, the campus wide underneath. Not linked from the site.
export const metadata: Metadata = { title: 'Modules page mod2', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <PageHero scene="campus" layout="stacked" title="Everything Your School Needs, in One Platform" />
      <ModuleExplorer />
      <PreviewSwitcher />
    </>
  );
}
