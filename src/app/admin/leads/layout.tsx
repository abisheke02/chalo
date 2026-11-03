import { requireRolePage } from '@/lib/auth';

export default async function LeadsLayout({ children }: { children: React.ReactNode }) {
  await requireRolePage('admin');
  return <>{children}</>;
}
