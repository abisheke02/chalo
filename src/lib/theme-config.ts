/**
 * ─────────────────────────────────────────────────────────────
 *  ACTIVE SITE THEME — BACKEND CONTROL POINT
 * ─────────────────────────────────────────────────────────────
 *
 *  This is the ONLY place to change the live theme of the public website.
 *  Visitors cannot change the theme — they always see ACTIVE_THEME.
 *
 *  To preview all available themes, open  /theme  in the browser.
 *  When you decide on one, set ACTIVE_THEME below to its id and redeploy.
 *
 *  Valid ids (see /theme for a live preview of each):
 *   Light: 'light' | 'slate' | 'pastel' | 'arctic' | 'mint' | 'lavender'
 *          | 'rose' | 'sandstone' | 'sky' | 'sage' | 'cloud' | 'ivory' | 'blush'
 *   Dark:  'midnight' | 'dark' | 'obsidian' | 'forest' | 'purple' | 'crimson'
 *          | 'ocean' | 'carbon' | 'dracula' | 'nord' | 'emeraldnight' | 'sunsetdark'
 */

import type { ThemeId } from '@/lib/themes';

export const ACTIVE_THEME: ThemeId = 'slate';

/**
 * Inline script injected into <head> before paint to apply the resolved
 * theme immediately — prevents any flash on load. Lives here (not in
 * ThemeProvider.tsx) because that file is 'use client', and a server
 * component (the root layout) can't call a function exported from a
 * client module.
 */
export function getThemeInitScript(theme: ThemeId): string {
  return `(function(){try{document.documentElement.setAttribute('data-theme','${theme}');}catch(e){}})();`;
}
