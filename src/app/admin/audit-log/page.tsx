import { requireRolePage } from '@/lib/auth';
import AuditLogPageClient from './AuditLogPageClient';

export default async function AuditLogPage() {
  await requireRolePage('admin');
  return <AuditLogPageClient />;
}
