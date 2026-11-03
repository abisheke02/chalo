import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, getNumberField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'
import { seedTestimonials } from '@/lib/seed-testimonials'

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    // Auto-seed if table is empty
    const count = await db.testimonial.count();
    if (count === 0) {
      await seedTestimonials(db);
    }

    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching all testimonials:', error)
    return safeErrorResponse('Failed to fetch testimonials', 500)
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const parsed = await parseAndValidateBody(request)
    if (!parsed.success) return parsed.response

    const body = parsed.body
    const name = getStringField(body, 'name')
    const role = getStringField(body, 'role')
    const school = getStringField(body, 'school')
    const content = getStringField(body, 'content')
    const rating = getNumberField(body, 'rating')
    const order = getNumberField(body, 'order')
    const published = getBooleanField(body, 'published')

    if (!name || !content) {
      return safeErrorResponse('Name and content are required', 400)
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        role: role || null,
        school: school || null,
        content,
        rating: rating ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
        order: order ?? 0,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'testimonials',
      targetId: testimonial.id,
      summary: `${auth.user.email} created testimonial from "${testimonial.name}"`,
      request,
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return safeErrorResponse('Failed to create testimonial', 500)
  }
}