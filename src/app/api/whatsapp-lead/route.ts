import { NextRequest, NextResponse } from 'next/server';
import {
  parseAndValidateBody,
  getStringField,
  safeErrorResponse,
} from '@/lib/api-helpers';
import { rateLimiter } from '@/lib/rate-limiter';
import { trimString } from '@/lib/sanitize';
import {
  sendWhatsAppLeadNotification,
  storeWhatsAppLead,
  WhatsAppLeadData,
} from '@/lib/email';

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
    // ─── Rate Limiting ───────────────────────────────────────────────────────
    const ip = getClientIp(request);
    const rateLimit = rateLimiter.checkContactFormRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please wait a moment before trying again.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) },
        }
      );
    }

    // ─── Parse & Validate Body ───────────────────────────────────────────────
    const parsed = await parseAndValidateBody(request);
    if (!parsed.success) return parsed.response;

    const body = parsed.body;
    const name = getStringField(body, 'name');
    const phone = getStringField(body, 'phone');
    const school = getStringField(body, 'school');
    const honeypot = getStringField(body, 'honeypot');

    // ─── Honeypot Check ──────────────────────────────────────────────────────
    if (honeypot) {
      // Silently accept — the bot thinks it succeeded
      return NextResponse.json({ success: true, message: 'Redirecting to WhatsApp...' });
    }

    // ─── Required Fields ─────────────────────────────────────────────────────
    if (!name || !phone) {
      return safeErrorResponse('Name and phone number are required.', 400);
    }

    if (phone.replace(/\D/g, '').length < 8) {
      return safeErrorResponse('Please enter a valid phone number.', 400);
    }

    const leadData: WhatsAppLeadData = {
      name: trimString(name),
      phone: trimString(phone),
      school: school ? trimString(school) : null,
    };

    // ─── Store in Database ───────────────────────────────────────────────────
    try {
      await storeWhatsAppLead(leadData);
    } catch (dbError) {
      console.error('[WhatsApp Lead API] Failed to store lead:', dbError);
      // Continue even if DB storage fails — don't block the user from reaching WhatsApp
    }

    // ─── Send Email Notification ─────────────────────────────────────────────
    const emailResult = await sendWhatsAppLeadNotification(leadData);
    if (!emailResult.success) {
      console.warn(`[WhatsApp Lead API] Email notification failed (${emailResult.method}): ${emailResult.error}`);
    }

    return NextResponse.json({ success: true, message: 'Redirecting to WhatsApp...' });
  } catch (error) {
    console.error('[WhatsApp Lead API] Error processing lead:', error);
    return safeErrorResponse('Something went wrong. Please try again.', 500);
  }
}
