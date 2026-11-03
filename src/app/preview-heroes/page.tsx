import type { Metadata } from 'next';
import PreviewClient from './PreviewClient';

// Temporary preview — remove once a hero is chosen.
export const metadata: Metadata = { title: 'Hero previews', robots: { index: false, follow: false } };

export default function Page() {
  return <PreviewClient />;
}
