import { requireRolePage } from '@/lib/auth';
import UsersPageClient from './UsersPageClient';

export default async function UsersPage() {
  await requireRolePage('admin');
  return <UsersPageClient />;
}
