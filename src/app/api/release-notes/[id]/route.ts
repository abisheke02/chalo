import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateId, parseAndValidateBody, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
import { requireRole } from '@/lib/auth'
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

    const releaseNote = await db.releaseNote.findUnique({ where: { id } })

    if (!releaseNote) {
      return safeErrorResponse('Release note not found', 404)
    }

    return NextResponse.json(releaseNote)
  } catch (error) {
    console.error('Error fetching release note:', error)
    return safeErrorResponse('Failed to fetch release note', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, 'admin');
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
    const version = getStringField(body, 'version')
    const content = getStringField(body, 'content')
    const releaseDate = getStringField(body, 'releaseDate')
    const type = getStringField(body, 'type')
    const published = getBooleanField(body, 'published')

    const existing = await db.releaseNote.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Release note not found', 404)
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await db.releaseNote.findFirst({ where: { slug, NOT: { id } } })
      if (slugExists) {
        return safeErrorResponse('A release note with this slug already exists', 409)
      }
    }

    const releaseNote = await db.releaseNote.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug !== existing.slug && { slug }),
        ...(version && { version }),
        ...(content && { content }),
        ...(releaseDate !== null && { releaseDate: releaseDate ? new Date(releaseDate) : null }),
        ...(type && { type }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'release-notes',
      targetId: id,
      summary: `${auth.user.email} updated release note "${releaseNote.title}"`,
      request,
    })

    return NextResponse.json(releaseNote)
  } catch (error) {
    console.error('Error updating release note:', error)
    return safeErrorResponse('Failed to update release note', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

    const existing = await db.releaseNote.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Release note not found', 404)
    }

    await db.releaseNote.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'release-notes',
      targetId: id,
      summary: `${auth.user.email} deleted release note "${existing.title}"`,
      request,
    })

    return NextResponse.json({ message: 'Release note deleted successfully' })
  } catch (error) {
    console.error('Error deleting release note:', error)
    return safeErrorResponse('Failed to delete release note', 500)
  }
}
