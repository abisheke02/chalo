import { NextRequest, NextResponse } from 'next/server';
import {
  parseAndValidateBody,
  getStringField,
  safeErrorResponse,
} from '@/lib/api-helpers';
import { rateLimiter } from '@/lib/rate-limiter';
import { validateEmail, trimString } from '@/lib/sanitize';
import {
  sendContactNotification,
  storeContactSubmission,
  ContactFormData,
} from '@/lib/email';

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

export async function POST(request: NextRequest) {
  try {
    // ─── Rate Limiting ───────────────────────────────────────────────────────────
    const ip = getClientIp(request);
    const rateLimit = rateLimiter.checkContactFormRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions. Please wait a moment before trying again.',
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

    // ─── Parse & Validate Body ───────────────────────────────────────────────────
    const parsed = await parseAndValidateBody(request);
    if (!parsed.success) return parsed.response;

    const body = parsed.body;
    const name = getStringField(body, 'name');
    const email = getStringField(body, 'email');
    const phone = getStringField(body, 'phone');
    const institution = getStringField(body, 'institution');
    const numberOfStudents = getStringField(body, 'numberOfStudents');
    const city = getStringField(body, 'city');
    const currentSoftware = getStringField(body, 'currentSoftware');
    const message = getStringField(body, 'message');
    const honeypot = getStringField(body, 'honeypot');

    // ─── Honeypot Check ──────────────────────────────────────────────────────────
    if (honeypot) {
      // Silently accept — the bot thinks it succeeded
      return NextResponse.json({
        success: true,
        message: 'Thank you! We will get back to you within 24 hours.',
      });
    }

    // ─── Required Fields ─────────────────────────────────────────────────────────
    if (!name || !email || !phone || !institution || !city) {
      return safeErrorResponse('Name, email, phone, institution, and city are required.', 400);
    }

    // ─── Email Validation ────────────────────────────────────────────────────────
    if (!validateEmail(email)) {
      return safeErrorResponse('Please enter a valid email address.', 400);
    }

    // ─── Build Contact Data ──────────────────────────────────────────────────────
    const contactData: ContactFormData = {
      name: trimString(name),
      email: trimString(email),
      phone: trimString(phone),
      institution: trimString(institution),
      numberOfStudents: numberOfStudents ? trimString(numberOfStudents) : null,
      city: trimString(city),
      currentSoftware: currentSoftware ? trimString(currentSoftware) : null,
      message: message ? trimString(message) : null,
    };

    // ─── Store in Database ───────────────────────────────────────────────────────
    try {
      await storeContactSubmission(contactData);
    } catch (dbError) {
      console.error('[Contact API] Failed to store submission:', dbError);
      // Continue even if DB storage fails — we still want to try sending the email
    }

    // ─── Send Email Notification ─────────────────────────────────────────────────
    const emailResult = await sendContactNotification(contactData);

    if (!emailResult.success) {
      console.warn(
        `[Contact API] Email notification failed (${emailResult.method}): ${emailResult.error}`
      );
      // Still return success to the user — submission was stored
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('[Contact API] Error processing contact form:', error);
    return safeErrorResponse('Failed to process your message. Please try again.', 500);
  }
}
