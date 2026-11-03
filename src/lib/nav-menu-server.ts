import { db } from '@/lib/db';
import { DEFAULT_NAV_MENU, NAV_MENU_KEY, resolveNavMenu, type NavMenu } from '@/data/nav-menu';

// The header menu for the site: the one saved in Admin > Menus, or the default if none is saved
// (or the database cannot be reached).
export async function getNavMenu(): Promise<NavMenu> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: NAV_MENU_KEY } });
    return resolveNavMenu(row?.value);
  } catch {
    return DEFAULT_NAV_MENU;
  }
}
