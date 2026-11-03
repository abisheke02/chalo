import type { Metadata } from 'next';
import { requireRolePage } from '@/lib/auth';

// Internal, unlisted theme-preview tool — keep it out of search engines.
export const metadata: Metadata = {
  title: 'Theme Preview (Internal)',
  robots: { index: false, follow: false },
};

export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  // Applying a theme here changes the live public site for every visitor,
  // so this tool requires admin auth like any other admin-only mutation.
  await requireRolePage('admin');
  return <>{children}</>;
}
