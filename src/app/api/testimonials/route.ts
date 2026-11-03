import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { safeErrorResponse } from '@/lib/api-helpers'
import { seedTestimonials } from '@/lib/seed-testimonials'

export async function GET() {
  try {
    // Auto-seed if table is empty
    const count = await db.testimonial.count();
    if (count === 0) {
      await seedTestimonials(db);
    }

    const testimonials = await db.testimonial.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return safeErrorResponse('Failed to fetch testimonials', 500)
  }
}
