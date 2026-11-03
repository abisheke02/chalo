import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export type AuditAction = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'status_change';

interface LogAuditParams {
  user: { id: string; email: string; role: string };
  action: AuditAction;
  section: string;
  targetId?: string;
  summary: string;
  request?: NextRequest;
}

function getClientIp(request?: NextRequest): string | undefined {
  if (!request) return undefined;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return undefined;
}

/**
 * Records an audit log entry. Never throws — a logging failure must not
 * block the underlying admin action from succeeding.
 */
export async function logAudit({ user, action, section, targetId, summary, request }: LogAuditParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action,
        section,
        targetId: targetId ?? null,
        summary,
        ipAddress: getClientIp(request) ?? null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
