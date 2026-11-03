'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { locales, LOCALE_COOKIE, type Locale } from './config';

// Server action invoked by the LanguageSwitcher. Persists the chosen locale in
// a cookie and revalidates so server-rendered messages update immediately.
export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
