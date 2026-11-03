'use client';

import type { ReactNode } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { trackConversion } from '@/components/GoogleAnalytics';
import { site } from '@/config/site';

// WhatsApp and call buttons that report a click event, so ads can count them
// as conversions. Each renders nothing until its number is confirmed in config.
const MESSAGE = 'Hi, I would like a demo of ChaloSchools for my school.';

export function WhatsAppLink({ className, children }: { className?: string; children?: ReactNode }) {
  if (!site.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackConversion('whatsapp_click', { event_category: 'ads_landing' })}
      className={className}
    >
      <MessageCircle className="h-4 w-4" /> {children ?? 'WhatsApp us'}
    </a>
  );
}

export function CallLink({ className, children }: { className?: string; children?: ReactNode }) {
  if (!site.phone) return null;
  return (
    <a
      href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
      onClick={() => trackConversion('call_click', { event_category: 'ads_landing' })}
      className={className}
    >
      <Phone className="h-4 w-4" /> {children ?? 'Call us'}
    </a>
  );
}
