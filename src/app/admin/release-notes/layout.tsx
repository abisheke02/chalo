import { requireRolePage } from '@/lib/auth';

export default async function ReleaseNotesLayout({ children }: { children: React.ReactNode }) {
  await requireRolePage('admin');
  return <>{children}</>;
}
