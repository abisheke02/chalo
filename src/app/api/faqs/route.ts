import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'
import { seedFAQs } from '@/lib/seed-faqs'

export async function GET(request: NextRequest) {
  try {
    // Auto-seed if table is empty
    const count = await db.fAQ.count();
    if (count === 0) {
      await seedFAQs(db);
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const faqs = await db.fAQ.findMany({
      where: {
        published: true,
        ...(category && { category }),
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return safeErrorResponse('Failed to fetch FAQs', 500)
  }
}
