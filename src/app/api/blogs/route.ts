import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateId, parseAndValidateBody, validateRequiredFields, getStringField, getBooleanField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const list = searchParams.get('list') === 'true'
    const category = searchParams.get('category')

    // Sanitize category param
    const safeCategory = category ? category.replace(/[^a-zA-Z0-9\s-_]/g, '').trim() : null

    const where: Record<string, unknown> = {}
    if (!list) {
      where.published = true
    }
    if (safeCategory) {
      where.category = safeCategory
    }

    const blogs = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return safeErrorResponse('Failed to fetch blogs', 500)
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
    const excerpt = getStringField(body, 'excerpt')
    const category = getStringField(body, 'category')
    const author = getStringField(body, 'author')
    const coverImage = getStringField(body, 'coverImage')
    const published = getBooleanField(body, 'published')

    // Validate required fields
    const missingField = validateRequiredFields(body, ['title', 'content'])
    if (missingField) {
      return safeErrorResponse(`${missingField} is required`, 400)
    }

    if (!title || !content) {
      return safeErrorResponse('Title and content are required', 400)
    }

    const slug = generateSlug(title)

    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return safeErrorResponse('A blog post with this slug already exists', 409)
    }

    const blog = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category: category || 'Blog',
        author: author || null,
        coverImage: coverImage || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'blogs',
      targetId: blog.id,
      summary: `${auth.user.email} created blog post "${blog.title}"`,
      request,
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return safeErrorResponse('Failed to create blog post', 500)
  }
}
