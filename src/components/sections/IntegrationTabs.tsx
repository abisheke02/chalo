'use client';

import { Calculator, CreditCard, Fingerprint, MessageCircle, Navigation, type LucideIcon } from 'lucide-react';
import { INTEGRATION_ITEMS } from '@/data/integrations';
import AiFeatureTabs, { type AiTab } from './AiFeatureTabs';
import { useSiteContent, getContentValue } from './SiteContentProvider';

// The five integrations as rotating tabs (the same style as the built-in intelligence section): the
// active one has a line that fills, then the next opens and the screen on the left changes. The words
// come from data/integrations.ts and can be edited in Admin > Site Content (Homepage - Integrations).
// Only facts the company has confirmed; supported device brands, GPS hardware, the Tally sync direction
// and gateways beyond Razorpay are not claimed. See docs/content/02-integration-pages.md.
const ICONS: Record<string, LucideIcon> = {
  biometric: Fingerprint,
  gps: Navigation,
  tally: Calculator,
  payments: CreditCard,
  whatsapp: MessageCircle,
};

export default function IntegrationTabs() {
  const { content } = useSiteContent();
  const text = (key: string, fallback: string) => getContentValue(content, key, fallback);

  const tabs: AiTab[] = INTEGRATION_ITEMS.map((it) => {
    const bullets = text(`integration_${it.id}_points`, '').split('\n').map((l) => l.trim()).filter(Boolean);
    return {
      slug: it.id,
      title: text(`integration_${it.id}_title`, it.title),
      icon: ICONS[it.id],
      href: it.href,
      blurb: text(`integration_${it.id}_lead`, it.paras[0]),
      points: bullets.length ? bullets : it.points ?? [],
    };
  });

  return (
    <AiFeatureTabs
      tabs={tabs}
      copy={{
        id: 'integrations',
        eyebrow: text('integrations_eyebrow', 'Integrates with your existing systems'),
        heading: text('integrations_heading', 'Works with what your school already uses.'),
        intro: text('integrations_intro', 'Biometric and RFID devices, GPS bus tracking, Tally, online payments and WhatsApp, all feeding one record.'),
        screenLabel: 'What changes for the school',
        linkLabel: 'See the module',
        tone: 'blue',
        ariaLabel: 'Integrations',
      }}
    />
  );
}
