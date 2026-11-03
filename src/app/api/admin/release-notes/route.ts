import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
import { requireRole } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const releaseNotes = await db.releaseNote.findMany({
      orderBy: { releaseDate: 'desc' },
    })

    return NextResponse.json(releaseNotes)
  } catch (error) {
    console.error('Error fetching all release notes:', error)
    return safeErrorResponse('Failed to fetch release notes', 500)
  }
}

export async function POST(request: NextRequest) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const parsed = await parseAndValidateBody(request)
    if (!parsed.success) return parsed.response

    const body = parsed.body
    const title = getStringField(body, 'title')
    const version = getStringField(body, 'version')
    const content = getStringField(body, 'content')
    const releaseDate = getStringField(body, 'releaseDate')
    const type = getStringField(body, 'type')
    const published = getBooleanField(body, 'published')

    if (!title || !version || !content) {
      return safeErrorResponse('Title, version, and content are required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.releaseNote.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A release note with this slug already exists', 409)
    }

    const releaseNote = await db.releaseNote.create({
      data: {
        title,
        slug,
        version,
        content,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        type: type || 'Feature',
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'release-notes',
      targetId: releaseNote.id,
      summary: `${auth.user.email} created release note "${releaseNote.title}" (${releaseNote.version})`,
      request,
    })

    return NextResponse.json(releaseNote, { status: 201 })
  } catch (error) {
    console.error('Error creating release note:', error)
    return safeErrorResponse('Failed to create release note', 500)
  }
}
