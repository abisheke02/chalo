import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const helpDocs = await db.helpDoc.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(helpDocs)
  } catch (error) {
    console.error('Error fetching help docs:', error)
    return safeErrorResponse('Failed to fetch help docs', 500)
  }
}
