'use client';

import { StickySteps } from '@/components/preview/ServicesSticky';
import { INTEGRATION_ITEMS } from '@/data/integrations';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// The five integrations in the sticky-scroll story layout. Only facts the company has confirmed;
// supported device brands, GPS hardware, the Tally sync direction and gateways beyond Razorpay are
// not claimed. See docs/content/02-integration-pages.md.

export default function IntegrationSticky() {
  const { content } = useSiteContent();
  const text = (key: string, fallback: string) => getContentValue(content, key, fallback);
  // Names, descriptions and bullet points can be edited in Admin > Site Content (bullets: one per line).
  const items = INTEGRATION_ITEMS.map((it) => {
    const bullets = text(`integration_${it.id}_points`, '').split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      ...it,
      title: text(`integration_${it.id}_title`, it.title),
      paras: [text(`integration_${it.id}_lead`, it.paras[0])],
      points: bullets.length ? bullets : it.points,
    };
  });
  return (
    <StickySteps
      items={items}
      compact
      slide
      headingId="integrations-heading"
      srHeading="Integrations"
      heading={{
        eyebrow: text('integrations_eyebrow', 'Integrates with your existing systems'),
        title: text('integrations_heading', 'Works with what your school already uses.'),
        intro: text('integrations_intro', 'Biometric and RFID devices, GPS bus tracking, Tally, online payments and WhatsApp, all feeding one record.'),
      }}
    />
  );
}
