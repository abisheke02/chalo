/**
 * Input Sanitization Utility
 * Provides functions for sanitizing, validating, and detecting malicious input.
 */

// ─── SQL Injection Detection ────────────────────────────────────────────────

const SQL_INJECTION_PATTERNS = [
  /(\bUNION\s+(ALL\s+)?SELECT\b)/i,
  /(\bSELECT\b[\s\S]*?\bFROM\b)/i,
  /(\bINSERT\s+INTO\b[\s\S]*?\bVALUES\b)/i,
  /(\bUPDATE\b[\s\S]*?\bSET\b)/i,
  /(\bDELETE\s+FROM\b)/i,
  /(\bDROP\s+(TABLE|DATABASE)\b)/i,
  /(\bTRUNCATE\s+TABLE\b)/i,
  /(\bALTER\s+TABLE\b)/i,
  /(\bCREATE\s+(TABLE|DATABASE)\b)/i,
  /('|--|;)\s*(OR|AND)\s+['"\d]/i,
  /(--|;--)\s*$/m,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
  /(\b(OR|AND)\s+['"][^'"]*['"]\s*=\s*['"])/i,
  /('\s*(OR|AND)\s+)/i,
  /(\bWAITFOR\s+DELAY\b)/i,
  /(\bBENCHMARK\s*\()/i,
  /(\bSLEEP\s*\(\s*\d)/i,
  /(\bEXTRACTVALUE\s*\()/i,
  /(\bUPDATEXML\s*\()/i,
  /(\bLOAD_FILE\s*\()/i,
  /(\bINTO\s+(OUT|DUMP)FILE\b)/i,
  /(\bINFORMATION_SCHEMA\b)/i,
  /(\/\*.*?\*\/)/, // Block comments
  /(\bxp_cmdshell\b)/i,
  /(\bsp_executesql\b)/i,
];

// ─── XSS Detection ──────────────────────────────────────────────────────────

const XSS_PATTERNS = [
  /<\s*script\b/i,
  /<\s*\/\s*script\b/i,
  /<\s*img\b[^>]+on\w+\s*=/i,
  /<\s*svg\b[^>]+on\w+\s*=/i,
  /<\s*body\b[^>]+on\w+\s*=/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /<\s*link\b/i,
  /<\s*meta\b[^>]+http-equiv/i,
  /<\s*form\b/i,
  /<\s*input\b/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /on(mouseover|mouseout|click|dblclick|load|unload|focus|blur|submit|change|keydown|keyup|keypress|error)\s*=/i,
  /expression\s*\(/i,
  /url\s*\(\s*(javascript|data|vbscript)\s*:/i,
  /@import\s/i,
  /-\s*moz-binding\s*:/i,
  /data\s*:\s*text\/html/i,
  /base64\s*,/i,
  /document\.\s*(cookie|write|domain|location|URL)/i,
  /eval\s*\(/i,
  /String\.fromCharCode/i,
  /window\.\s*(location|top|parent|frames|open|navigate)/i,
];

// ─── Dangerous Characters for HTML Context ──────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Sanitize a string by escaping dangerous HTML characters.
 * This prevents XSS when the string is rendered in HTML context.
 */
export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return String(str);
  return str.replace(/[&<>"'\/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Recursively sanitize all string values in an object.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => {
        if (typeof item === 'string') return sanitizeInput(item);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return sanitizeObject(item as Record<string, unknown>);
        }
        return item;
      });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Detect common SQL injection patterns in a string.
 */
export function isSqlInjection(str: string): boolean {
  if (typeof str !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(str));
}

/**
 * Detect XSS attack patterns in a string.
 */
export function isXssAttempt(str: string): boolean {
  if (typeof str !== 'string') return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(str));
}

/**
 * Check if any value in an object contains SQL injection patterns.
 */
export function containsSqlInjection(obj: Record<string, unknown>): boolean {
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && isSqlInjection(value)) return true;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (containsSqlInjection(value as Record<string, unknown>)) return true;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && isSqlInjection(item)) return true;
      }
    }
  }
  return false;
}

/**
 * Check if any value in an object contains XSS patterns.
 */
export function containsXssAttempt(obj: Record<string, unknown>): boolean {
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && isXssAttempt(value)) return true;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (containsXssAttempt(value as Record<string, unknown>)) return true;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && isXssAttempt(item)) return true;
      }
    }
  }
  return false;
}

/**
 * Validate email format.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate slug format: only lowercase alphanumeric characters and hyphens.
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Trim and limit string length.
 */
export function trimString(str: string, maxLength: number = 10000): string {
  return str.trim().slice(0, maxLength);
}

/**
 * Validate that a string contains only safe characters for a specific field type.
 */
export function validateFieldType(value: string, fieldType: 'text' | 'url' | 'email' | 'phone' | 'slug'): boolean {
  switch (fieldType) {
    case 'text':
      // Allow most printable characters but not control characters
      return /^[\p{L}\p{N}\s\p{P}\p{S}]+$/u.test(value);
    case 'url':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case 'email':
      return validateEmail(value);
    case 'phone':
      return /^[\d\s\-+().]+$/.test(value);
    case 'slug':
      return validateSlug(value);
    default:
      return true;
  }
}
