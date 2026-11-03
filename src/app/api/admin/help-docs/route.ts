import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, getNumberField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const helpDocs = await db.helpDoc.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(helpDocs)
  } catch (error) {
    console.error('Error fetching all help docs:', error)
    return safeErrorResponse('Failed to fetch help docs', 500)
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
    const content = getStringField(body, 'content')
    const category = getStringField(body, 'category')
    const order = getNumberField(body, 'order')
    const published = getBooleanField(body, 'published')

    if (!title || !content) {
      return safeErrorResponse('Title and content are required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.helpDoc.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A help doc with this slug already exists', 409)
    }

    const helpDoc = await db.helpDoc.create({
      data: {
        title,
        slug,
        content,
        category: category || 'Getting Started',
        order: order ?? 0,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'help-docs',
      targetId: helpDoc.id,
      summary: `${auth.user.email} created help doc "${helpDoc.title}"`,
      request,
    })

    return NextResponse.json(helpDoc, { status: 201 })
  } catch (error) {
    console.error('Error creating help doc:', error)
    return safeErrorResponse('Failed to create help doc', 500)
  }
}
