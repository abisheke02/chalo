'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

/**
 * Fire a conversion event. Call this on successful contact form submission.
 * Usage: trackConversion('generate_lead', { value: 1, currency: 'INR' });
 */
export function trackConversion(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  };
  if (GA_ID && w.gtag) w.gtag('event', eventName, params);
  // Tag Manager picks the event up from the data layer (Google Ads conversions go here).
  w.dataLayer?.push({ event: eventName, ...params });
  // Meta Pixel, when installed.
  if (eventName === 'generate_lead' && w.fbq) w.fbq('track', 'Lead');
}
