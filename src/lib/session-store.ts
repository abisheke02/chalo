/**
 * In-memory session store for admin authentication.
 * Suitable for single-instance deployments.
 * Uses globalThis to survive Next.js hot-reloads in development.
 */

export interface SessionUser {
  id: string;
  email: string;
  role: string; // "admin" | "analyst"
}

interface SessionEntry {
  token: string;
  user: SessionUser;
  createdAt: number;
  expiresAt: number;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const CSRF_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// Use globalThis to persist stores across Next.js hot-reloads
type GlobalStore = {
  __sessionStoreSessions?: Map<string, SessionEntry>;
  __sessionStoreCsrf?: Map<string, number>;
  __sessionStoreCleanup?: NodeJS.Timeout | null;
};

const g = globalThis as unknown as GlobalStore;

if (!g.__sessionStoreSessions) {
  g.__sessionStoreSessions = new Map();
}
if (!g.__sessionStoreCsrf) {
  g.__sessionStoreCsrf = new Map();
}

const sessions = g.__sessionStoreSessions;
const csrfTokens = g.__sessionStoreCsrf;

// Periodically clean up expired sessions and CSRF tokens
function cleanup() {
  const now = Date.now();

  for (const [token, entry] of sessions) {
    if (entry.expiresAt < now) {
      sessions.delete(token);
    }
  }

  for (const [token, expiry] of csrfTokens) {
    if (expiry < now) {
      csrfTokens.delete(token);
    }
  }
}

// Only set up the cleanup interval once
if (!g.__sessionStoreCleanup) {
  g.__sessionStoreCleanup = setInterval(cleanup, CLEANUP_INTERVAL_MS);
}

export const sessionStore = {
  /**
   * Create a new session for a given user and return the token.
   */
  createSession(user: SessionUser): string {
    const token = crypto.randomUUID();
    const now = Date.now();

    sessions.set(token, {
      token,
      user,
      createdAt: now,
      expiresAt: now + SESSION_DURATION_MS,
    });

    return token;
  },

  /**
   * Validate if a session token is valid and not expired.
   */
  validateSession(token: string): boolean {
    const entry = sessions.get(token);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      sessions.delete(token);
      return false;
    }
    return true;
  },

  /**
   * Get the user attached to a valid session, or null if invalid/expired.
   */
  getSessionUser(token: string): SessionUser | null {
    const entry = sessions.get(token);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      sessions.delete(token);
      return null;
    }
    return entry.user;
  },

  /**
   * Delete a session.
   */
  deleteSession(token: string): boolean {
    return sessions.delete(token);
  },

  /**
   * Generate a CSRF token.
   */
  generateCsrfToken(): string {
    const token = crypto.randomUUID();
    csrfTokens.set(token, Date.now() + CSRF_DURATION_MS);
    return token;
  },

  /**
   * Validate a CSRF token.
   */
  validateCsrfToken(token: string): boolean {
    const expiry = csrfTokens.get(token);
    if (!expiry) return false;
    if (expiry < Date.now()) {
      csrfTokens.delete(token);
      return false;
    }
    // One-time use: delete after validation
    csrfTokens.delete(token);
    return true;
  },

  /**
   * Get the session cookie name.
   */
  get cookieName(): string {
    return 'admin_session';
  },

  /**
   * Get the CSRF cookie name.
   */
  get csrfCookieName(): string {
    return 'csrf_token';
  },
};
