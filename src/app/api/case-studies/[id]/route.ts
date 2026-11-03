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

    const caseStudy = await db.caseStudy.findUnique({ where: { id } })

    if (!caseStudy) {
      return safeErrorResponse('Case study not found', 404)
    }

    return NextResponse.json(caseStudy)
  } catch (error) {
    console.error('Error fetching case study:', error)
    return safeErrorResponse('Failed to fetch case study', 500)
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
    const schoolName = getStringField(body, 'schoolName')
    const location = getStringField(body, 'location')
    const coverImage = getStringField(body, 'coverImage')
    const stats = getStringField(body, 'stats')
    const published = getBooleanField(body, 'published')

    const existing = await db.caseStudy.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Case study not found', 404)
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const slugExists = await db.caseStudy.findFirst({ where: { slug, NOT: { id } } })
      if (slugExists) {
        return safeErrorResponse('A case study with this slug already exists', 409)
      }
    }

    const caseStudy = await db.caseStudy.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug !== existing.slug && { slug }),
        ...(excerpt !== null && { excerpt: excerpt || null }),
        ...(content !== null && { content: content || null }),
        ...(schoolName !== null && { schoolName: schoolName || null }),
        ...(location !== null && { location: location || null }),
        ...(coverImage !== null && { coverImage: coverImage || null }),
        ...(stats !== null && { stats: stats || null }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'case-studies',
      targetId: id,
      summary: `${auth.user.email} updated case study "${caseStudy.title}"`,
      request,
    })

    return NextResponse.json(caseStudy)
  } catch (error) {
    console.error('Error updating case study:', error)
    return safeErrorResponse('Failed to update case study', 500)
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

    const existing = await db.caseStudy.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Case study not found', 404)
    }

    await db.caseStudy.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'case-studies',
      targetId: id,
      summary: `${auth.user.email} deleted case study "${existing.title}"`,
      request,
    })

    return NextResponse.json({ message: 'Case study deleted successfully' })
  } catch (error) {
    console.error('Error deleting case study:', error)
    return safeErrorResponse('Failed to delete case study', 500)
  }
}
