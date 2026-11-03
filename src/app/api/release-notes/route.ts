import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const releaseNotes = await db.releaseNote.findMany({
      where: { published: true },
      orderBy: { releaseDate: 'desc' },
    })

    return NextResponse.json(releaseNotes)
  } catch (error) {
    console.error('Error fetching release notes:', error)
    return safeErrorResponse('Failed to fetch release notes', 500)
  }
}
