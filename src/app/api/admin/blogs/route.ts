import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const blogs = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching all blogs:', error)
    return safeErrorResponse('Failed to fetch blogs', 500)
  }
}
