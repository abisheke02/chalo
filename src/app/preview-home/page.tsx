import type { Metadata } from 'next';
import PreviewHome from './PreviewHome';

// Preview of a homepage concept — not linked from the site. Remove when done.
export const metadata: Metadata = { title: 'Homepage preview', robots: { index: false, follow: false } };

export default function Page() {
  return <PreviewHome />;
}
