import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const list = searchParams.get('list') === 'true'

    const where: Record<string, unknown> = {}
    if (!list) {
      where.published = true
    }

    const webinars = await db.webinar.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(webinars)
  } catch (error) {
    console.error('Error fetching webinars:', error)
    return safeErrorResponse('Failed to fetch webinars', 500)
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
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

    if (!title) {
      return safeErrorResponse('Title is required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.webinar.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A webinar with this slug already exists', 409)
    }

    const webinar = await db.webinar.create({
      data: {
        title,
        slug,
        description: description || null,
        content: content || null,
        speaker: speaker || null,
        speakerTitle: speakerTitle || null,
        videoUrl: videoUrl || null,
        coverImage: coverImage || null,
        date: date ? new Date(date) : null,
        duration: duration || null,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'webinars',
      targetId: webinar.id,
      summary: `${auth.user.email} created webinar "${webinar.title}"`,
      request,
    })

    return NextResponse.json(webinar, { status: 201 })
  } catch (error) {
    console.error('Error creating webinar:', error)
    return safeErrorResponse('Failed to create webinar', 500)
  }
}
