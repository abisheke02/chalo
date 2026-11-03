import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseAndValidateBody, getStringField, getBooleanField, getNumberField, safeErrorResponse } from '@/lib/api-helpers'
import { requireAdminAuth } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'
import { seedFAQs } from '@/lib/seed-faqs'

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    // Auto-seed if table is empty
    const count = await db.fAQ.count();
    if (count === 0) {
      await seedFAQs(db);
    }

    const faqs = await db.fAQ.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching all FAQs:', error)
    return safeErrorResponse('Failed to fetch FAQs', 500)
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const parsed = await parseAndValidateBody(request)
    if (!parsed.success) return parsed.response

    const body = parsed.body
    const question = getStringField(body, 'question')
    const answer = getStringField(body, 'answer')
    const category = getStringField(body, 'category')
    const order = getNumberField(body, 'order')
    const published = getBooleanField(body, 'published')

    if (!question || !answer) {
      return safeErrorResponse('Question and answer are required', 400)
    }

    const faq = await db.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'General',
        order: order ?? 0,
        published: published ?? false,
      },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'faqs',
      targetId: faq.id,
      summary: `${auth.user.email} created FAQ "${faq.question}"`,
      request,
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return safeErrorResponse('Failed to create FAQ', 500)
  }
}