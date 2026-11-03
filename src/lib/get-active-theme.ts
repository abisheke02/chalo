import { db } from '@/lib/db';
import { ACTIVE_THEME } from '@/lib/theme-config';
import type { ThemeId } from '@/lib/themes';

export const ACTIVE_THEME_KEY = 'active_theme';

/**
 * Resolves the live public-site theme: the DB override set via the
 * /theme Apply button, falling back to the hardcoded ACTIVE_THEME in
 * theme-config.ts when no override has been saved yet (fresh installs).
 */
export async function getActiveTheme(): Promise<ThemeId> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: ACTIVE_THEME_KEY } });
    if (row?.value) return row.value as ThemeId;
  } catch {
    // DB unavailable (e.g. during build) — use the hardcoded default.
  }
  return ACTIVE_THEME;
}
