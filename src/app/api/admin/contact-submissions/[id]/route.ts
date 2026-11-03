import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { logAudit } from '@/lib/audit-log'
import { validateId, parseAndValidateBody, getStringField, safeErrorResponse } from '@/lib/api-helpers'

const VALID_STATUSES = ['new', 'contacted', 'closed']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

    const parsed = await parseAndValidateBody(request)
    if (!parsed.success) return parsed.response

    const status = getStringField(parsed.body, 'status')
    if (!status || !VALID_STATUSES.includes(status)) {
      return safeErrorResponse('Status must be one of: new, contacted, closed', 400)
    }

    const existing = await db.contactSubmission.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Submission not found', 404)
    }

    const submission = await db.contactSubmission.update({
      where: { id },
      data: { status },
    })

    await logAudit({
      user: auth.user,
      action: 'status_change',
      section: 'leads',
      targetId: id,
      summary: `${auth.user.email} changed lead "${existing.name}" (${existing.institution}) status from ${existing.status} to ${status}`,
      request,
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return safeErrorResponse('Failed to update contact submission', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const { id } = await params

    if (!validateId(id)) {
      return safeErrorResponse('Invalid ID format', 400)
    }

    const existing = await db.contactSubmission.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('Submission not found', 404)
    }

    await db.contactSubmission.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'leads',
      targetId: id,
      summary: `${auth.user.email} deleted lead "${existing.name}" (${existing.institution})`,
      request,
    })

    return NextResponse.json({ message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return safeErrorResponse('Failed to delete contact submission', 500)
  }
}
