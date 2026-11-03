import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateId, parseAndValidateBody, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
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

    const webinar = await db.webinar.findUnique({ where: { id } })

    if (!webinar) {
      return safeErrorResponse('Webinar not found', 404)
    }

    return NextResponse.json(webinar)
  } catch (error) {
    console.error('Error fetching webinar:', error)
    return safeErrorResponse('Failed to fetch webinar', 500)
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
    const title = getStringField(body, 'title')
    const description = getStringField(body, 'description')
    const content = getStringField(body, 'content')
    const speaker = getStringField(body, 'speaker')
    const speakerTitle = getStringField(body, 'speakerTitle')
    const videoUrl = getStringField(body, 'videoUrl')
    const coverImage = getStringField(body, 'coverImage')
    const date = getStringField(body, 'date')
    const duration = getStringField(body, 'duration')
    const published = getBooleanField(body, 'published')

    const existing = await db.webinar.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Webinar not found', 404)
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await db.webinar.findFirst({ where: { slug, NOT: { id } } })
      if (slugExists) {
        return safeErrorResponse('A webinar with this slug already exists', 409)
      }
    }

    const webinar = await db.webinar.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug !== existing.slug && { slug }),
        ...(description !== null && { description: description || null }),
        ...(content !== null && { content: content || null }),
        ...(speaker !== null && { speaker: speaker || null }),
        ...(speakerTitle !== null && { speakerTitle: speakerTitle || null }),
        ...(videoUrl !== null && { videoUrl: videoUrl || null }),
        ...(coverImage !== null && { coverImage: coverImage || null }),
        ...(date !== null && { date: date ? new Date(date) : null }),
        ...(duration !== null && { duration: duration || null }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'webinars',
      targetId: id,
      summary: `${auth.user.email} updated webinar "${webinar.title}"`,
      request,
    })

    return NextResponse.json(webinar)
  } catch (error) {
    console.error('Error updating webinar:', error)
    return safeErrorResponse('Failed to update webinar', 500)
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

    const existing = await db.webinar.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Webinar not found', 404)
    }

    await db.webinar.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'webinars',
      targetId: id,
      summary: `${auth.user.email} deleted webinar "${existing.title}"`,
      request,
    })

    return NextResponse.json({ message: 'Webinar deleted successfully' })
  } catch (error) {
    console.error('Error deleting webinar:', error)
    return safeErrorResponse('Failed to delete webinar', 500)
  }
}
