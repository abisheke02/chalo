import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const newsEvents = await db.newsEvent.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(newsEvents)
  } catch (error) {
    console.error('Error fetching all news:', error)
    return safeErrorResponse('Failed to fetch news', 500)
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
    const excerpt = getStringField(body, 'excerpt')
    const content = getStringField(body, 'content')
    const category = getStringField(body, 'category')
    const eventDate = getStringField(body, 'eventDate')
    const location = getStringField(body, 'location')
    const coverImage = getStringField(body, 'coverImage')
    const published = getBooleanField(body, 'published')

    if (!title) {
      return safeErrorResponse('Title is required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.newsEvent.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A news item with this slug already exists', 409)
    }

    const newsEvent = await db.newsEvent.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        category: category || 'News',
        eventDate: eventDate ? new Date(eventDate) : null,
        location: location || null,
        coverImage: coverImage || null,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'news',
      targetId: newsEvent.id,
      summary: `${auth.user.email} created news item "${newsEvent.title}"`,
      request,
    })

    return NextResponse.json(newsEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return safeErrorResponse('Failed to create news', 500)
  }
}
