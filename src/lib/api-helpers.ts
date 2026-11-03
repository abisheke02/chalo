/**
 * Reusable API route protection utilities.
 * Provides a consistent pattern for input validation, sanitization, and error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeObject,
  containsSqlInjection,
  containsXssAttempt,
  trimString,
} from '@/lib/sanitize';

/**
 * Result type for validated and parsed request body.
 */
interface ParsedBody {
  success: true;
  body: Record<string, unknown>;
}

interface ParseError {
  success: false;
  response: NextResponse;
}

type ParseResult = ParsedBody | ParseError;

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
 * Validate Content-Type header for POST/PUT requests.
 */
export function validateContentType(request: NextRequest): ParseResult | null {
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Content-Type must be application/json',
        },
        { status: 400 }
      ),
    };
  }
  return null;
}

/**
 * Parse and validate JSON body from a request.
 * - Checks Content-Type
 * - Parses JSON
 * - Sanitizes all string inputs
 * - Checks for SQL injection and XSS patterns
 */
export async function parseAndValidateBody(
  request: NextRequest
): Promise<ParseResult> {
  // Check Content-Type
  const ctError = validateContentType(request);
  if (ctError) return ctError;

  // Parse JSON
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Malformed JSON body',
        },
        { status: 400 }
      ),
    };
  }

  // Validate it's an object
  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Request body must be a JSON object',
        },
        { status: 400 }
      ),
    };
  }

  // Check for SQL injection
  if (containsSqlInjection(body)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Malicious input detected',
        },
        { status: 400 }
      ),
    };
  }

  // Check for XSS attempts
  if (containsXssAttempt(body)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Malicious input detected',
        },
        { status: 400 }
      ),
    };
  }

  // Sanitize all inputs
  const sanitizedBody = sanitizeObject(body);

  return { success: true, body: sanitizedBody };
}

/**
 * Validate that required string fields exist in the body.
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      return field;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return field;
    }
  }
  return null;
}

/**
 * Extract and validate a string field from the body.
 */
export function getStringField(
  body: Record<string, unknown>,
  field: string
): string | null {
  const value = body[field];
  if (typeof value === 'string') {
    return trimString(value);
  }
  return null;
}

/**
 * Extract and validate a boolean field from the body.
 */
export function getBooleanField(
  body: Record<string, unknown>,
  field: string
): boolean | null {
  const value = body[field];
  if (typeof value === 'boolean') {
    return value;
  }
  return null;
}

/**
 * Extract and validate a number field from the body.
 */
export function getNumberField(
  body: Record<string, unknown>,
  field: string
): number | null {
  const value = body[field];
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return null;
}

/**
 * Safe error response - never exposes stack traces or internal details.
 */
export function safeErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  const genericMessages: Record<number, string> = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    429: 'Too many requests',
    500: 'Internal server error',
  };

  return NextResponse.json(
    {
      error: genericMessages[status] || 'Error',
      message,
    },
    { status }
  );
}

/**
 * Safe parameter ID validation - ensures ID is a safe string.
 */
export function validateId(id: string): boolean {
  // CUID format: starts with a letter, followed by alphanumeric chars and hyphens
  return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(id) && id.length <= 128;
}
