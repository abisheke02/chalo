import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit log:', error)
    return safeErrorResponse('Failed to fetch audit log', 500)
  }
}
