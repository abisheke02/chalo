// Central i18n config. Cookie-driven locale (no URL prefix) so it does NOT
// collide with the existing security middleware in src/middleware.ts.
export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

// Name of the cookie that stores the user's chosen locale.
export const LOCALE_COOKIE = 'NEXT_LOCALE';
