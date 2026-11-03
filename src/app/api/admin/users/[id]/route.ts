import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { validateId, parseAndValidateBody, getStringField, safeErrorResponse } from '@/lib/api-helpers'
import { logAudit } from '@/lib/audit-log'

const VALID_ROLES = ['admin', 'analyst']

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

    const role = getStringField(parsed.body, 'role')
    if (!role || !VALID_ROLES.includes(role)) {
      return safeErrorResponse('Role must be one of: admin, analyst', 400)
    }

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('User not found', 404)
    }

    // Prevent demoting the last remaining admin — would lock everyone out of admin-only areas.
    if (existing.role === 'admin' && role !== 'admin') {
      const adminCount = await db.user.count({ where: { role: 'admin' } })
      if (adminCount <= 1) {
        return safeErrorResponse('Cannot change role: at least one admin must remain', 400)
      }
    }

    const user = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, createdAt: true, lastLoginAt: true },
    })

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'users',
      targetId: id,
      summary: `${auth.user.email} changed ${existing.email}'s role from ${existing.role} to ${role}`,
      request,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return safeErrorResponse('Failed to update user', 500)
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

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return safeErrorResponse('User not found', 404)
    }

    if (existing.id === auth.user.id) {
      return safeErrorResponse('You cannot remove your own account', 400)
    }

    if (existing.role === 'admin') {
      const adminCount = await db.user.count({ where: { role: 'admin' } })
      if (adminCount <= 1) {
        return safeErrorResponse('Cannot remove the last remaining admin', 400)
      }
    }

    await db.user.delete({ where: { id } })

    await logAudit({
      user: auth.user,
      action: 'delete',
      section: 'users',
      targetId: id,
      summary: `${auth.user.email} removed user ${existing.email}`,
      request,
    })

    return NextResponse.json({ message: 'User removed successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return safeErrorResponse('Failed to delete user', 500)
  }
}
