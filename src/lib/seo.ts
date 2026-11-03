import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { buildMetadata } from '@/lib/metadata';
import { decodeEntities, getSeoDefaults, seoKey } from '@/data/seo-pages';

// Meta title and description for a page: the default from the registry, or the
// text saved in Admin > SEO & Meta Tags when there is one. A database problem
// never breaks a page; it just falls back to the default.
export async function pageMetadata(path: string): Promise<Metadata> {
  const base = getSeoDefaults(path);
  if (!base) return {};
  let { title, description } = base;
  try {
    const titleKey = seoKey(path, 'title');
    const descKey = seoKey(path, 'desc');
    const rows = await db.siteContent.findMany({ where: { key: { in: [titleKey, descKey] } } });
    const t = rows.find((r) => r.key === titleKey)?.value.trim();
    const d = rows.find((r) => r.key === descKey)?.value.trim();
    if (t) title = decodeEntities(t);
    if (d) description = decodeEntities(d);
  } catch {
    // keep the defaults
  }
  return buildMetadata({ title, description, path });
}
