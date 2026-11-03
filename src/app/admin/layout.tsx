import type { Metadata } from 'next';
import { requireAdminPage } from '@/lib/auth';
import AdminLayoutClient from './AdminLayoutClient';

// robots.txt already disallows /admin/, this is defense-in-depth so an
// accidentally-crawled admin URL still can't get indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
