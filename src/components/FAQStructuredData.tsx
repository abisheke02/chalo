import { safeJsonLd } from '@/lib/json-ld';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * Renders FAQPage JSON-LD structured data for Google rich snippet eligibility.
 * Takes FAQ data as a prop (fetched server-side by the parent) so the schema
 * is present in the initial server-rendered HTML, not added after client hydration.
 */
export default function FAQStructuredData({ faqs }: { faqs: FAQItem[] }) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
