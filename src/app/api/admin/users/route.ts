import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { parseAndValidateBody, getStringField, safeErrorResponse } from '@/lib/api-helpers'
import { logAudit } from '@/lib/audit-log'

const VALID_ROLES = ['admin', 'analyst']

export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const users = await db.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, lastLoginAt: true },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return safeErrorResponse('Failed to fetch users', 500)
  }
}

export async function POST(request: NextRequest) {
  const auth = requireRole(request, 'admin');
  if (!auth.authenticated) return auth.response;
  try {
    const parsed = await parseAndValidateBody(request)
    if (!parsed.success) return parsed.response

    const body = parsed.body
    const email = getStringField(body, 'email')?.toLowerCase()
    const password = getStringField(body, 'password')
    const role = getStringField(body, 'role')

    if (!email || !email.includes('@')) {
      return safeErrorResponse('A valid email is required', 400)
    }
    if (!password || password.length < 8) {
      return safeErrorResponse('Password must be at least 8 characters', 400)
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return safeErrorResponse('Role must be one of: admin, analyst', 400)
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return safeErrorResponse('A user with this email already exists', 409)
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true, lastLoginAt: true },
    })

    await logAudit({
      user: auth.user,
      action: 'create',
      section: 'users',
      targetId: user.id,
      summary: `${auth.user.email} created user ${user.email} (${user.role})`,
      request,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return safeErrorResponse('Failed to create user', 500)
  }
}
