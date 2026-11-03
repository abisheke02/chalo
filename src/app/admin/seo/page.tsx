'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ExternalLink, Loader2, RotateCcw, Save, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { SEO_PAGES, decodeEntities, fullTitle, seoKey, type SeoPage } from '@/data/seo-pages';

interface SiteContentRecord {
  key: string;
  value: string;
}

// Title and description lengths Google shows without cutting. Titles count the
// " | ChaloSchools" suffix, which is added to every page except the home page.
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;

function tone(ok: boolean, warn: boolean) {
  return ok ? 'text-green-600' : warn ? 'text-amber-600' : 'text-red-600';
}

// Admin > SEO & Meta Tags: edit the title and description Google shows for any
// public page. A blank field means "use the default shown underneath".
export default function SeoAdminPage() {
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-content');
      if (!res.ok) throw new Error('fetch failed');
      const rows: SiteContentRecord[] = await res.json();
      const map: Record<string, string> = {};
      for (const r of rows) if (r.key.startsWith('seo_')) map[r.key] = decodeEntities(r.value);
      setSaved(map);
      setDraft(map);
    } catch {
      toast.error('Failed to load meta tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? SEO_PAGES.filter((p) => `${p.path} ${p.label} ${p.title}`.toLowerCase().includes(q)) : SEO_PAGES;
    const out = new Map<string, SeoPage[]>();
    for (const p of list) out.set(p.group, [...(out.get(p.group) ?? []), p]);
    return [...out.entries()];
  }, [query]);

  async function put(key: string, value: string) {
    const res = await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error('save failed');
  }

  async function save(page: SeoPage, reset = false) {
    const tKey = seoKey(page.path, 'title');
    const dKey = seoKey(page.path, 'desc');
    const t = reset ? '' : (draft[tKey] ?? '').trim();
    const d = reset ? '' : (draft[dKey] ?? '').trim();
    setBusy(page.path);
    try {
      await Promise.all([put(tKey, t), put(dKey, d)]);
      setSaved((s) => ({ ...s, [tKey]: t, [dKey]: d }));
      setDraft((s) => ({ ...s, [tKey]: t, [dKey]: d }));
      toast.success(reset ? 'Reset to the default' : 'Saved. The page now uses this text');
    } catch {
      toast.error('Could not save. Please try again');
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Search className="size-6" />
          SEO &amp; Meta Tags
        </h1>
        <p className="text-muted-foreground">
          Edit the title and description Google shows for each page. Leave a field blank to use the default. Changes apply as soon as you save. The brand name (“ChaloSchools”) is added after the title on every page except the home page.
        </p>
        <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
          <li>Title: keep the whole title, including the brand name, to {TITLE_MAX} characters or fewer.</li>
          <li>Description: aim for {DESC_MIN} to {DESC_MAX} characters, and say what the page offers and who it is for.</li>
        </ul>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a page" className="pl-9" />
      </div>

      {groups.length === 0 && <p className="text-sm text-muted-foreground">No pages match.</p>}

      {groups.map(([group, pages]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="text-lg">
              {group} <span className="text-sm font-normal text-muted-foreground">({pages.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {pages.map((page) => {
              const tKey = seoKey(page.path, 'title');
              const dKey = seoKey(page.path, 'desc');
              const tDraft = draft[tKey] ?? '';
              const dDraft = draft[dKey] ?? '';
              const custom = !!(saved[tKey]?.trim() || saved[dKey]?.trim());
              const dirty = tDraft !== (saved[tKey] ?? '') || dDraft !== (saved[dKey] ?? '');
              const shownTitle = fullTitle(page.path, tDraft.trim() || page.title);
              const shownDesc = dDraft.trim() || page.description;
              return (
                <div key={page.path} className="space-y-3 py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{page.label}</span>
                    <a href={page.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline">
                      {page.path} <ExternalLink className="size-3" />
                    </a>
                    <Badge variant={custom ? 'default' : 'secondary'}>{custom ? 'Custom' : 'Default'}</Badge>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={tKey}>Title</Label>
                          <span className={`text-xs ${tone(shownTitle.length <= TITLE_MAX, shownTitle.length <= TITLE_MAX + 5)}`}>
                            {shownTitle.length} / {TITLE_MAX}
                          </span>
                        </div>
                        <Input id={tKey} value={tDraft} placeholder={page.title} onChange={(e) => setDraft((s) => ({ ...s, [tKey]: e.target.value }))} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={dKey}>Description</Label>
                          <span className={`text-xs ${tone(shownDesc.length >= DESC_MIN && shownDesc.length <= DESC_MAX, shownDesc.length < DESC_MIN || shownDesc.length <= DESC_MAX + 10)}`}>
                            {shownDesc.length} / {DESC_MAX}
                          </span>
                        </div>
                        <Textarea id={dKey} rows={3} value={dDraft} placeholder={page.description} onChange={(e) => setDraft((s) => ({ ...s, [dKey]: e.target.value }))} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" disabled={!dirty || busy === page.path} onClick={() => save(page)}>
                          {busy === page.path ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Save className="mr-1.5 size-3.5" />}
                          Save
                        </Button>
                        <Button size="sm" variant="outline" disabled={!custom || busy === page.path} onClick={() => save(page, true)}>
                          <RotateCcw className="mr-1.5 size-3.5" />
                          Reset to default
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">How it can look on Google</p>
                      <p className="truncate text-xs text-muted-foreground">chaloschools.com{page.path === '/' ? '' : page.path}</p>
                      <p className="mt-0.5 text-lg leading-snug text-blue-700 dark:text-blue-400">{shownTitle}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{shownDesc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
