import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateId, parseAndValidateBody, getStringField, getBooleanField, getNumberField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

    const testimonial = await db.testimonial.findUnique({ where: { id } })

    if (!testimonial) {
      return safeErrorResponse('Testimonial not found', 404)
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return safeErrorResponse('Failed to fetch testimonial', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

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

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Testimonial not found', 404)
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role !== null && { role: role || null }),
        ...(school !== null && { school: school || null }),
        ...(content && { content }),
        ...(rating !== null && { rating: Math.min(5, Math.max(1, Math.round(rating))) }),
        ...(order !== null && { order }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'testimonials',
      targetId: id,
      summary: `${auth.user.email} updated testimonial from "${testimonial.name}"`,
      request,
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return safeErrorResponse('Failed to update testimonial', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Testimonial not found', 404)
    }

    await db.testimonial.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'testimonials',
      targetId: id,
      summary: `${auth.user.email} deleted testimonial from "${existing.name}"`,
      request,
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return safeErrorResponse('Failed to delete testimonial', 500)
  }
}