import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const webinars = await db.webinar.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(webinars)
  } catch (error) {
    console.error('Error fetching all webinars:', error)
    return safeErrorResponse('Failed to fetch webinars', 500)
  }
}
