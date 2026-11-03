import { getNavMenu } from '@/lib/nav-menu-server';
import HeaderClient from './HeaderClient';

// The site header. The menu is read on the server (Admin > Menus, or the default), so it is already
// in the page when it loads. Saving a menu refreshes the pages.
export default async function Header() {
  const menu = await getNavMenu();
  return <HeaderClient menu={menu} />;
}
