import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRegion } from '@/data/regions';
import { pageMetadata } from '@/lib/seo';
import RegionPage from '@/components/regions/RegionPage';

const region = getRegion('school-erp-chennai');

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/school-erp-chennai');
}

export default function Page() {
  if (!region) notFound();
  return <RegionPage region={region} />;
}
