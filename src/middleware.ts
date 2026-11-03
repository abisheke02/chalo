import { NextRequest, NextResponse } from 'next/server';
import { isSqlInjection } from '@/lib/sanitize';
import { rateLimiter } from '@/lib/rate-limiter';

/**
 * SQL Injection patterns to block in query parameters and URLs.
 */
const URL_SQLI_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|EXEC|EXECUTE|UNION)\b)/i,
  /(--|;)\s*$/m,
  /(\bOR\s+\d+\s*=\s*\d+)/i,
  /(\bAND\s+\d+\s*=\s*\d+)/i,
  /('\s*(OR|AND)\s+)/i,
  /(\bWAITFOR\s+DELAY\b)/i,
  /(\bSLEEP\s*\()/i,
  /(\bBENCHMARK\s*\()/i,
  /(\bxp_cmdshell\b)/i,
  /(\bsp_executesql\b)/i,
];

/**
 * Common attack paths to block.
 */
const BLOCKED_PATHS = [
  '/.env',
  '/wp-admin',
  '/wp-login',
  '/wp-content',
  '/phpmyadmin',
  '/phpmyadm',
  '/adminer',
  '/.git',
  '/.svn',
  '/.htaccess',
  '/.htpasswd',
  '/config.php',
  '/wp-config',
  '/shell',
  '/cmd',
  '/cgi-bin',
  '/_profiler',
  '/console',
];

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
 * Check if a URL contains SQL injection patterns.
 */
function hasSqlInjectionInUrl(url: string): boolean {
  const decoded = decodeURIComponent(url);
  return URL_SQLI_PATTERNS.some((pattern) => pattern.test(decoded));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ip = getClientIp(request);

  // ─── 0. Canonicalize case: redirect uppercase/mixed-case paths to lowercase ───
  // All real routes on this site are lowercase, so /PRODUCT, /Pricing, etc. would 404.
  // Redirect them (308 permanent) to the lowercase form. Skips /api (may be case-sensitive).
  if (pathname !== pathname.toLowerCase() && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  // ─── 1. Security Headers ────────────────────────────────────────────────

  response.headers.set('X-Content-Type-Options', 'nosniff');
  // HSTS: force HTTPS for 2 years, include subdomains, allow preload list.
  // Safe here because the site is HTTPS-only (Cloudflare/Render terminate TLS).
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self' https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // Remove X-Powered-By
  response.headers.delete('x-powered-by');

  // ─── 2. Block Common Attack Paths ───────────────────────────────────────

  for (const blockedPath of BLOCKED_PATHS) {
    if (pathname.toLowerCase().includes(blockedPath)) {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 }
      );
    }
  }

  // ─── 3. Block SQL Injection in URL ────────────────────────────────────

  if (hasSqlInjectionInUrl(pathname + search)) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    );
  }

  // ─── 4. Rate Limit API Routes (skip admin auth - handled separately) ──────────

  if (pathname.startsWith('/api/')) {
    // Skip rate limiting for admin auth (login attempts are handled separately in the auth route)
    if (pathname.startsWith('/api/admin/auth')) {
      return response;
    }

    const rateLimit = rateLimiter.checkApiRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  }

  // Note: Admin panel session protection is handled server-side in:
  //   - Admin layout (Server Component) for page routes
  //   - Individual API route handlers for API routes
  // This is because middleware runs in a separate context and cannot access
  // the in-memory session store shared with API routes and Server Components.

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|logo.svg).*)',
  ],
};
