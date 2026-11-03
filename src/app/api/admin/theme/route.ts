import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseAndValidateBody, getStringField, safeErrorResponse } from '@/lib/api-helpers';
import { requireAdminAuth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { getActiveTheme, ACTIVE_THEME_KEY } from '@/lib/get-active-theme';
import { THEMES } from '@/lib/themes';

export async function GET(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const activeTheme = await getActiveTheme();
    return NextResponse.json({ activeTheme });
  } catch (error) {
    console.error('Error fetching active theme:', error);
    return safeErrorResponse('Failed to fetch active theme', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) return auth.response;
  try {
    const parsed = await parseAndValidateBody(request);
    if (!parsed.success) return parsed.response;

    const theme = getStringField(parsed.body, 'theme');
    if (!theme) {
      return safeErrorResponse('theme is required', 400);
    }

    const valid = THEMES.some((t) => t.id === theme);
    if (!valid) {
      return safeErrorResponse('Unknown theme id', 400);
    }

    const themeOption = THEMES.find((t) => t.id === theme)!;

    await db.siteContent.upsert({
      where: { key: ACTIVE_THEME_KEY },
      update: { value: theme },
      create: {
        key: ACTIVE_THEME_KEY,
        value: theme,
        section: 'theme',
        label: 'Active Theme',
        type: 'text',
      },
    });

    await logAudit({
      user: auth.user,
      action: 'update',
      section: 'theme',
      summary: `${auth.user.email} applied the "${themeOption.name}" theme to the live site`,
      request,
    });

    return NextResponse.json({ activeTheme: theme });
  } catch (error) {
    console.error('Error updating active theme:', error);
    return safeErrorResponse('Failed to update active theme', 500);
  }
}
