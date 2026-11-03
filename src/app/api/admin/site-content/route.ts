import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getStringField, safeErrorResponse } from '@/lib/api-helpers';
import { requireAdminAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { seedSiteContent, SEED_KEYS } from '@/lib/seed-site-content';
import { containsSqlInjection, containsXssAttempt, sanitizeObject } from '@/lib/sanitize';

// Module image values are base64 data URLs produced client-side by
// canvas.toDataURL() (never raw attacker input) and are only ever consumed
// as an <img src>, which can't execute script content regardless of what
// the string contains — so this is a safe, narrow allowlist. The generic
// sanitize/XSS pipeline below is deliberately NOT applied to these: its
// base64 pattern flags any base64 string as a possible XSS payload (a false
// positive for real image data), and its HTML-escaping mangles the '/'
// characters that are part of the base64 alphabet, corrupting the image.
// Still strictly validated against the expected shape before being stored.
const MODULE_IMAGE_KEY = /^module_image_[a-z-]+$/;
const IMAGE_DATA_URL = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/]+=*$/;

function isModuleImageUpdate(body: Record<string, unknown>): body is { key: string; value: string } {
  return (
    typeof body.key === 'string' &&
    MODULE_IMAGE_KEY.test(body.key) &&
    typeof body.value === 'string' &&
    (body.value === '' || IMAGE_DATA_URL.test(body.value))
  );
}

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    // Auto-seed if the table is empty, or is missing rows added since (the seed only adds, never overwrites)
    const have = new Set((await db.siteContent.findMany({ select: { key: true } })).map((r) => r.key));
    if (SEED_KEYS.some((k) => !have.has(k))) {
      await seedSiteContent(db);
    }

    const records = await db.siteContent.findMany({
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching site content:', error);
    return safeErrorResponse('Failed to fetch site content', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    // Module image updates take a separate path — see the comment on
    // isModuleImageUpdate for why they must skip the generic sanitize/XSS
    // pipeline. Everything else goes through parseAndValidateBody as before.
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return safeErrorResponse('Content-Type must be application/json', 400);
    }
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return safeErrorResponse('Malformed JSON body', 400);
    }
    if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
      return safeErrorResponse('Request body must be a JSON object', 400);
    }

    if (isModuleImageUpdate(rawBody as Record<string, unknown>)) {
      const { key, value } = rawBody as { key: string; value: string };
      const result = await db.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value, section: 'Uncategorized', label: key },
      });
      await logAudit({
        user: auth.user,
        action: 'update',
        section: 'site-content',
        summary: `${auth.user.email} ${value ? 'updated' : 'removed'} module image: ${key}`,
        request,
      });
      return NextResponse.json([result]);
    }

    // Same checks parseAndValidateBody would run — inlined here because the
    // request body stream was already consumed above (it can only be read
    // once) to check for the module-image case.
    const rawBodyObj = rawBody as Record<string, unknown>;
    if (containsSqlInjection(rawBodyObj) || containsXssAttempt(rawBodyObj)) {
      return safeErrorResponse('Malicious input detected', 400);
    }
    const body = sanitizeObject(rawBodyObj);

    // Support both single update { key, value } and batch update [{ key, value }, ...]
    const updates: { key: string; value: string }[] = [];

    if (Array.isArray(body.items) && Array.isArray(body.items[0])) {
      // Batch: { items: [{ key, value }, ...] }
      for (const item of body.items) {
        const k = getStringField(item as Record<string, unknown>, 'key');
        const v = getStringField(item as Record<string, unknown>, 'value');
        if (k && v !== null) {
          updates.push({ key: k, value: v });
        }
      }
    } else {
      // Single: { key, value }
      const k = getStringField(body, 'key');
      const v = getStringField(body, 'value');
      if (!k) {
        return safeErrorResponse('Key is required', 400);
      }
      if (v === null) {
        return safeErrorResponse('Value is required', 400);
      }
      updates.push({ key: k, value: v });
    }

    const results = await Promise.all(
      updates.map(({ key, value }) =>
        db.siteContent.upsert({
          where: { key },
          update: { value },
          create: { key, value, section: 'Uncategorized', label: key },
        })
      )
    );

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'site-content',
      summary: `${auth.user.email} updated ${updates.length} site content field${updates.length === 1 ? '' : 's'}: ${updates.map((u) => u.key).join(', ')}`,
      request,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating site content:', error);
    return safeErrorResponse('Failed to update site content', 500);
  }
}