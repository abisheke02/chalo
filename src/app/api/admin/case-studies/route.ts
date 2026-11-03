import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const caseStudies = await db.caseStudy.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(caseStudies)
  } catch (error) {
    console.error('Error fetching all case studies:', error)
    return safeErrorResponse('Failed to fetch case studies', 500)
  }
}
