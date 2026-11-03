import { safeJsonLd } from '@/lib/json-ld';
import { SITE_URL } from '@/lib/site-url';

interface TestimonialForSchema {
  name: string;
  role: string | null;
  content: string;
  rating: number;
}

/**
 * Renders SoftwareApplication + Review/AggregateRating JSON-LD.
 * Ratings are computed only from real, published testimonials passed in —
 * never fabricated. If there are no testimonials yet, the rating fields are
 * simply omitted rather than invented.
 */
export default function SoftwareApplicationStructuredData({ testimonials }: { testimonials: TestimonialForSchema[] }) {
  const ratingCount = testimonials.length;
  const averageRating = ratingCount > 0
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / ratingCount
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ChaloSchools',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'School Management Software',
    operatingSystem: 'Web, iOS, Android',
    description: 'ChaloSchools is a complete school management ERP for K-12 schools in India, handling admissions, fee management, attendance, timetable scheduling, and parent communication in one platform.',
    url: SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'Inspace Edu Solutions Private Limited',
      url: SITE_URL,
    },
    ...(averageRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
      review: testimonials.slice(0, 5).map((t) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: t.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: { '@type': 'Person', name: t.name },
        reviewBody: t.content,
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
