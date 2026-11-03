import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { safeErrorResponse } from '@/lib/api-helpers';
import { requireAdminAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { checkNavMenu, DEFAULT_NAV_MENU, NAV_MENU_KEY, resolveNavMenu } from '@/data/nav-menu';

// GET: the menu in use, and the default. PUT: save a menu ({ menu }) or go back to the default ({ reset: true }).
// The menu is checked here (names, link addresses, sizes) and stored as JSON; it is not put through the
// general text cleaner, which would mangle quotes in the JSON.

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const row = await db.siteContent.findUnique({ where: { key: NAV_MENU_KEY } });
    return NextResponse.json({ menu: resolveNavMenu(row?.value), defaultMenu: DEFAULT_NAV_MENU, saved: !!row?.value });
  } catch (error) {
    console.error('Error reading the menu:', error);
    return safeErrorResponse('Failed to read the menu', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return safeErrorResponse('Content-Type must be application/json', 400);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return safeErrorResponse('Malformed JSON body', 400);
    }
    const b = body as { menu?: unknown; reset?: unknown } | null;
    if (!b || typeof b !== 'object') return safeErrorResponse('Request body must be a JSON object', 400);

    if (b.reset === true) {
      await db.siteContent.deleteMany({ where: { key: NAV_MENU_KEY } });
      await logAudit({ user: auth.user, action: 'update', section: 'menus', summary: `${auth.user.email} reset the header menu to the default`, request });
      revalidatePath('/', 'layout');
      return NextResponse.json({ menu: DEFAULT_NAV_MENU, saved: false });
    }

    const checked = checkNavMenu(b.menu);
    if (!checked.ok) return safeErrorResponse(checked.error, 400);

    await db.siteContent.upsert({
      where: { key: NAV_MENU_KEY },
      update: { value: JSON.stringify(checked.menu) },
      create: { key: NAV_MENU_KEY, value: JSON.stringify(checked.menu), section: 'Navigation', label: 'Header menu (edit in Admin > Menus)', type: 'json', order: 0 },
    });
    await logAudit({ user: auth.user, action: 'update', section: 'menus', summary: `${auth.user.email} saved the header menu`, request });
    revalidatePath('/', 'layout');
    return NextResponse.json({ menu: checked.menu, saved: true });
  } catch (error) {
    console.error('Error saving the menu:', error);
    return safeErrorResponse('Failed to save the menu', 500);
  }
}
