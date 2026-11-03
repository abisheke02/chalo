'use client';

import { safeJsonLd } from '@/lib/json-ld';
import { usePathname } from 'next/navigation';
import { SITE_URL } from '@/lib/site-url';

// BreadcrumbList schema for the main pages (Home > Page). Pages with their own
// breadcrumb (features, boards, roles, posts) are not listed here, so nothing
// is duplicated. It renders in the server HTML, since client components are
// server-rendered on first load.
const NAMES: Record<string, string> = {
  '/product': 'Product Tour',
  '/pricing': 'Pricing',
  '/compare': 'Compare',
  '/about': 'About',
  '/contact': 'Contact',
  '/security': 'Data Protection and Security',
  '/platform-capabilities': 'Platform Capabilities',
  '/managed-it-services': 'Managed IT Services',
};

export default function MainBreadcrumb() {
  const path = usePathname();
  const name = NAMES[path];
  if (!name) return null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />;
}
