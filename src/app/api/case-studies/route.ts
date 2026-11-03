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

    const caseStudies = await db.caseStudy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(caseStudies)
  } catch (error) {
    console.error('Error fetching case studies:', error)
    return safeErrorResponse('Failed to fetch case studies', 500)
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
    const schoolName = getStringField(body, 'schoolName')
    const location = getStringField(body, 'location')
    const coverImage = getStringField(body, 'coverImage')
    const stats = getStringField(body, 'stats')
    const published = getBooleanField(body, 'published')

    if (!title) {
      return safeErrorResponse('Title is required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.caseStudy.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A case study with this slug already exists', 409)
    }

    const caseStudy = await db.caseStudy.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        schoolName: schoolName || null,
        location: location || null,
        coverImage: coverImage || null,
        stats: stats || null,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'case-studies',
      targetId: caseStudy.id,
      summary: `${auth.user.email} created case study "${caseStudy.title}"`,
      request,
    })

    return NextResponse.json(caseStudy, { status: 201 })
  } catch (error) {
    console.error('Error creating case study:', error)
    return safeErrorResponse('Failed to create case study', 500)
  }
}
