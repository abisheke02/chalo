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

    const newsEvent = await db.newsEvent.findUnique({ where: { id } })

    if (!newsEvent) {
      return safeErrorResponse('News not found', 404)
    }

    return NextResponse.json(newsEvent)
  } catch (error) {
    console.error('Error fetching news:', error)
    return safeErrorResponse('Failed to fetch news', 500)
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
    const excerpt = getStringField(body, 'excerpt')
    const content = getStringField(body, 'content')
    const category = getStringField(body, 'category')
    const eventDate = getStringField(body, 'eventDate')
    const location = getStringField(body, 'location')
    const coverImage = getStringField(body, 'coverImage')
    const published = getBooleanField(body, 'published')

    const existing = await db.newsEvent.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('News not found', 404)
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await db.newsEvent.findFirst({ where: { slug, NOT: { id } } })
      if (slugExists) {
        return safeErrorResponse('A news item with this slug already exists', 409)
      }
    }

    const newsEvent = await db.newsEvent.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug !== existing.slug && { slug }),
        ...(excerpt !== null && { excerpt: excerpt || null }),
        ...(content !== null && { content: content || null }),
        ...(category && { category }),
        ...(eventDate !== null && { eventDate: eventDate ? new Date(eventDate) : null }),
        ...(location !== null && { location: location || null }),
        ...(coverImage !== null && { coverImage: coverImage || null }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'news',
      targetId: id,
      summary: `${auth.user.email} updated news item "${newsEvent.title}"`,
      request,
    })

    return NextResponse.json(newsEvent)
  } catch (error) {
    console.error('Error updating news:', error)
    return safeErrorResponse('Failed to update news', 500)
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

    const existing = await db.newsEvent.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('News not found', 404)
    }

    await db.newsEvent.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'news',
      targetId: id,
      summary: `${auth.user.email} deleted news item "${existing.title}"`,
      request,
    })

    return NextResponse.json({ message: 'News deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return safeErrorResponse('Failed to delete news', 500)
  }
}
