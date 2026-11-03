import { db } from '@/lib/db';

const siteContentCache = new Map<string, string>();
let cacheLoaded = false;

export async function getSiteContent(): Promise<Map<string, string>> {
  if (cacheLoaded && siteContentCache.size > 0) return siteContentCache;

  const records = await db.siteContent.findMany();
  const map = new Map<string, string>();
  for (const r of records) {
    map.set(r.key, r.value);
  }

  // Update cache
  siteContentCache.clear();
  for (const [k, v] of map) {
    siteContentCache.set(k, v);
  }
  cacheLoaded = true;

  return map;
}

export function getContent(map: Map<string, string>, key: string, fallback: string): string {
  return map.get(key) ?? fallback;
}