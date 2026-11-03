/**
 * Simple in-memory rate limiter.
 * Tracks requests per IP address within a sliding time window.
 * Uses globalThis to survive Next.js hot-reloads in development.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

// Use globalThis to persist stores across Next.js hot-reloads
type GlobalRateLimiterStore = {
  __rateLimiterGlobal?: Map<string, number[]>;
  __rateLimiterContact?: Map<string, number[]>;
  __rateLimiterCleanup?: NodeJS.Timeout | null;
};

const g = globalThis as unknown as GlobalRateLimiterStore;

if (!g.__rateLimiterGlobal) {
  g.__rateLimiterGlobal = new Map();
}
if (!g.__rateLimiterContact) {
  g.__rateLimiterContact = new Map();
}

// Global rate limit store: ip -> timestamps[]
const globalStore = g.__rateLimiterGlobal;

// Contact form rate limit store: ip -> timestamps[]
const contactFormStore = g.__rateLimiterContact;

function cleanupStore(store: Map<string, number[]>) {
  const now = Date.now();
  for (const [ip, timestamps] of store) {
    const validTimestamps = timestamps.filter((t) => now - t < WINDOW_MS * 2);
    if (validTimestamps.length === 0) {
      store.delete(ip);
    } else if (validTimestamps.length !== timestamps.length) {
      store.set(ip, validTimestamps);
    }
  }
}

// Only set up the cleanup interval once
if (!g.__rateLimiterCleanup) {
  g.__rateLimiterCleanup = setInterval(() => {
    cleanupStore(globalStore);
    cleanupStore(contactFormStore);
  }, CLEANUP_INTERVAL_MS);
}

function checkRateLimit(
  store: Map<string, number[]>,
  ip: string,
  maxRequests: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry) {
    entry = [];
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry = entry.filter((t) => now - t < WINDOW_MS);
  store.set(ip, entry);

  const currentCount = entry.length;

  if (currentCount >= maxRequests) {
    // Find when the oldest request in the window will expire
    const oldestInWindow = entry[0];
    const resetAt = oldestInWindow + WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  // Add current request timestamp
  entry.push(now);
  store.set(ip, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.length,
    resetAt: now + WINDOW_MS,
  };
}

export const rateLimiter = {
  /**
   * Check rate limit for API routes.
   * Max 100 requests per minute per IP.
   */
  checkApiRateLimit(ip: string) {
    return checkRateLimit(globalStore, ip, 100);
  },

  /**
   * Check rate limit for contact form submissions.
   * Max 5 submissions per minute per IP.
   */
  checkContactFormRateLimit(ip: string) {
    return checkRateLimit(contactFormStore, ip, 5);
  },
};
