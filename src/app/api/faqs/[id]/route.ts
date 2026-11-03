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

    const faq = await db.fAQ.findUnique({ where: { id } })

    if (!faq) {
      return safeErrorResponse('FAQ not found', 404)
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return safeErrorResponse('Failed to fetch FAQ', 500)
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
    const question = getStringField(body, 'question')
    const answer = getStringField(body, 'answer')
    const category = getStringField(body, 'category')
    const order = getNumberField(body, 'order')
    const published = getBooleanField(body, 'published')

    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('FAQ not found', 404)
    }

    const faq = await db.fAQ.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(category && { category }),
        ...(order !== null && { order }),
        ...(published !== null && { published }),
      },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'faqs',
      targetId: id,
      summary: `${auth.user.email} updated FAQ "${faq.question}"`,
      request,
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return safeErrorResponse('Failed to update FAQ', 500)
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

    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('FAQ not found', 404)
    }

    await db.fAQ.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'faqs',
      targetId: id,
      summary: `${auth.user.email} deleted FAQ "${existing.question}"`,
      request,
    })

    return NextResponse.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return safeErrorResponse('Failed to delete FAQ', 500)
  }
}