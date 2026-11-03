import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const newsEvents = await db.newsEvent.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(newsEvents)
  } catch (error) {
    console.error('Error fetching news:', error)
    return safeErrorResponse('Failed to fetch news', 500)
  }
}
