import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-url';

const DEFAULT_OG_IMAGE = { url: '/images/hero-bg.png', width: 1344, height: 768 };

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Relative to metadataBase, e.g. '/images/blog/my-post.png'. Falls back to the site default. */
  image?: string;
}

// Every page gets its own Open Graph + Twitter Card tags matching its real
// title/description, instead of every shared link (blog posts, features,
// solutions, etc.) showing the generic homepage card. Next.js does not
// deep-merge openGraph/twitter across nested metadata, so each page must
// set the full block itself rather than relying on the root layout's.
export function buildMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? { url: image, width: 1344, height: 768, alt: title } : { ...DEFAULT_OG_IMAGE, alt: title };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      siteName: 'ChaloSchools',
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
