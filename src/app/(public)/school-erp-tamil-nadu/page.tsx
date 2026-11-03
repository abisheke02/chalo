import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRegion } from '@/data/regions';
import { pageMetadata } from '@/lib/seo';
import RegionPage from '@/components/regions/RegionPage';

const region = getRegion('school-erp-tamil-nadu');

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/school-erp-tamil-nadu');
}

export default function Page() {
  if (!region) notFound();
  return <RegionPage region={region} />;
}
