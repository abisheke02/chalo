import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sanitizeInput, isSqlInjection, isXssAttempt } from '@/lib/sanitize';
import { sessionStore } from '@/lib/session-store';
import { rateLimiter } from '@/lib/rate-limiter';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit-log';

/**
 * Get client IP from request headers.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Bootstraps the very first admin account from ADMIN_EMAIL / ADMIN_PASSWORD
 * env vars, the first time anyone logs in against an empty User table.
 * This lets the existing single-password deployment flow keep working
 * while migrating to real per-user accounts.
 */
async function bootstrapFirstAdminIfNeeded() {
  const existingCount = await db.user.count();
  if (existingCount > 0) return;

  const bootstrapEmail = (process.env.ADMIN_EMAIL || 'admin@chaloschools.com').toLowerCase();
  const bootstrapPassword = process.env.ADMIN_PASSWORD;

  if (!bootstrapPassword) return;

  const passwordHash = await bcrypt.hash(bootstrapPassword, 12);
  await db.user.create({
    data: {
      email: bootstrapEmail,
      role: 'admin',
      passwordHash,
    },
  });
}

/**
 * POST /api/admin/auth
 * Verifies email + password and creates a session.
 * Requires CSRF token for protection.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // ─── Rate Limiting (5 login attempts per minute) ────────────────────────

  const rateLimit = rateLimiter.checkContactFormRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many login attempts',
        message: 'Please wait before trying again.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  // ─── Content-Type Validation ────────────────────────────────────────────

  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Content-Type must be application/json' },
      { status: 400 }
    );
  }

  // ─── Parse Body ────────────────────────────────────────────────────────

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Malformed JSON body' },
      { status: 400 }
    );
  }

  const { email, password, csrfToken } = body as { email?: string; password?: string; csrfToken?: string };

  // ─── CSRF Token Validation ──────────────────────────────────────────────

  if (!csrfToken || typeof csrfToken !== 'string') {
    return NextResponse.json(
      { error: 'Invalid request', message: 'CSRF token is required' },
      { status: 400 }
    );
  }

  if (!sessionStore.validateCsrfToken(csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Invalid or expired CSRF token' },
      { status: 403 }
    );
  }

  // ─── Input Validation ───────────────────────────────────────────────────

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Email and password are required' },
      { status: 400 }
    );
  }

  const sanitizedEmail = sanitizeInput(email).trim().toLowerCase();
  const sanitizedPassword = sanitizeInput(password);

  if (isSqlInjection(sanitizedEmail) || isXssAttempt(sanitizedEmail) || isSqlInjection(sanitizedPassword) || isXssAttempt(sanitizedPassword)) {
    return NextResponse.json(
      { error: 'Invalid request', message: 'Malicious input detected' },
      { status: 400 }
    );
  }

  // ─── Bootstrap first admin (only runs once, when User table is empty) ──

  try {
    await bootstrapFirstAdminIfNeeded();
  } catch (error) {
    console.error('Failed to bootstrap first admin:', error);
  }

  // ─── Credential Verification ────────────────────────────────────────────

  const user = await db.user.findUnique({ where: { email: sanitizedEmail } });

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials', message: 'Incorrect email or password' },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(sanitizedPassword, user.passwordHash);

  if (!isMatch) {
    return NextResponse.json(
      { error: 'Invalid credentials', message: 'Incorrect email or password' },
      { status: 401 }
    );
  }

  // ─── Create Session ─────────────────────────────────────────────────────

  const sessionToken = sessionStore.createSession({ id: user.id, email: user.email, role: user.role });

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  await logAudit({
    user: { id: user.id, email: user.email, role: user.role },
    action: 'login',
    section: 'auth',
    summary: `${user.email} logged in`,
    request,
  });

  // ─── Set Cookie & Response ──────────────────────────────────────────────

  const response = NextResponse.json(
    { success: true, message: 'Authenticated successfully', role: user.role },
    { status: 200 }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set(sessionStore.cookieName, sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

/**
 * DELETE /api/admin/auth
 * Logs out the current admin session.
 */
export async function DELETE(request: NextRequest) {
  const sessionToken = request.cookies.get(sessionStore.cookieName)?.value;

  if (sessionToken) {
    const user = sessionStore.getSessionUser(sessionToken);
    if (user) {
      await logAudit({
        user,
        action: 'logout',
        section: 'auth',
        summary: `${user.email} logged out`,
        request,
      });
    }
    sessionStore.deleteSession(sessionToken);
  }

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' }
  );

  response.cookies.set(sessionStore.cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}

/**
 * GET /api/admin/auth
 * Generate a CSRF token for the login form.
 */
export async function GET() {
  const csrfToken = sessionStore.generateCsrfToken();

  const response = NextResponse.json({
    authenticated: false,
    csrfToken,
  });

  // Set CSRF token as a non-httpOnly cookie so the frontend can read it
  response.cookies.set(sessionStore.csrfCookieName, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 30 * 60, // 30 minutes
  });

  return response;
}
