/**
 * Server-side authentication utilities for admin routes.
 * Works in both API routes and Server Components.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionStore, SessionUser } from '@/lib/session-store';

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Validate admin session from request cookies (for API routes).
 * Returns the session token if valid, or null if invalid.
 */
export function getAdminSession(request: NextRequest): string | null {
  const sessionToken = request.cookies.get(sessionStore.cookieName)?.value;
  if (!sessionToken) return null;
  if (!sessionStore.validateSession(sessionToken)) return null;
  return sessionToken;
}

/**
 * Require admin authentication (any role) for API routes.
 * Call this at the beginning of any admin API handler.
 * Returns the session token + user if authenticated, or a 401 response.
 */
export function requireAdminAuth(
  request: NextRequest
): { authenticated: true; token: string; user: SessionUser } | { authenticated: false; response: NextResponse } {
  const sessionToken = getAdminSession(request);

  if (!sessionToken) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  const user = sessionStore.getSessionUser(sessionToken);
  if (!user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, token: sessionToken, user };
}

/**
 * Require a specific role (e.g. 'admin') for API routes.
 * Call this instead of requireAdminAuth when a route must be restricted
 * beyond plain authentication (e.g. Leads, Audit Log, Users).
 */
export function requireRole(
  request: NextRequest,
  role: string
): { authenticated: true; token: string; user: SessionUser } | { authenticated: false; response: NextResponse } {
  const result = requireAdminAuth(request);
  if (!result.authenticated) return result;

  if (result.user.role !== role) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to access this resource' },
        { status: 403 }
      ),
    };
  }

  return result;
}

/**
 * Require admin authentication (any role) for Server Components.
 * Redirects to login if not authenticated. Returns the session user.
 * Call this at the beginning of any admin page/layout server component.
 */
export async function requireAdminPage(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(sessionStore.cookieName)?.value;

  if (!sessionToken || !sessionStore.validateSession(sessionToken)) {
    redirect('/auth/login');
  }

  const user = sessionStore.getSessionUser(sessionToken);
  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

/**
 * Require a specific role for Server Components (pages).
 * Redirects non-admins back to the dashboard.
 */
export async function requireRolePage(role: string): Promise<SessionUser> {
  const user = await requireAdminPage();
  if (user.role !== role) {
    redirect('/admin');
  }
  return user;
}
