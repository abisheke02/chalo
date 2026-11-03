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

    const helpDoc = await db.helpDoc.findUnique({ where: { id } })

    if (!helpDoc) {
      return safeErrorResponse('Help doc not found', 404)
    }

    return NextResponse.json(helpDoc)
  } catch (error) {
    console.error('Error fetching help doc:', error)
    return safeErrorResponse('Failed to fetch help doc', 500)
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
    const content = getStringField(body, 'content')
    const category = getStringField(body, 'category')
    const order = getNumberField(body, 'order')
    const published = getBooleanField(body, 'published')

    const existing = await db.helpDoc.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Help doc not found', 404)
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await db.helpDoc.findFirst({ where: { slug, NOT: { id } } })
      if (slugExists) {
        return safeErrorResponse('A help doc with this slug already exists', 409)
      }
    }

    const helpDoc = await db.helpDoc.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug !== existing.slug && { slug }),
        ...(content && { content }),
        ...(category && { category }),
        ...(order !== null && { order }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'help-docs',
      targetId: id,
      summary: `${auth.user.email} updated help doc "${helpDoc.title}"`,
      request,
    })

    return NextResponse.json(helpDoc)
  } catch (error) {
    console.error('Error updating help doc:', error)
    return safeErrorResponse('Failed to update help doc', 500)
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

    const existing = await db.helpDoc.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Help doc not found', 404)
    }

    await db.helpDoc.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'help-docs',
      targetId: id,
      summary: `${auth.user.email} deleted help doc "${existing.title}"`,
      request,
    })

    return NextResponse.json({ message: 'Help doc deleted successfully' })
  } catch (error) {
    console.error('Error deleting help doc:', error)
    return safeErrorResponse('Failed to delete help doc', 500)
  }
}
