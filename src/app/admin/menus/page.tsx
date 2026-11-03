'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MENU_ICON_NAMES, type MenuDropdown, type MenuLink, type MenuSection, type NavMenu } from '@/data/nav-menu';

// Admin > Menus: the header menu. Each heading opens a panel of groups, each group holds links.
// Home and Pricing are fixed links. Nothing changes on the site until Save.

const move = <T,>(list: T[], i: number, d: number): T[] => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function MenusPage() {
  const [menu, setMenu] = useState<NavMenu | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/nav-menu');
      if (!res.ok) throw new Error('load');
      const data = await res.json();
      setMenu(data.menu);
      setSaved(!!data.saved);
      setDirty(false);
    } catch {
      toast.error('Failed to load the menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const edit = (fn: (m: NavMenu) => NavMenu) => {
    setMenu((m) => (m ? fn(m) : m));
    setDirty(true);
  };
  const editDropdown = (di: number, fn: (d: MenuDropdown) => MenuDropdown) =>
    edit((m) => ({ ...m, dropdowns: m.dropdowns.map((d, i) => (i === di ? fn(d) : d)) }));
  const editSection = (di: number, si: number, fn: (s: MenuSection) => MenuSection) =>
    editDropdown(di, (d) => ({ ...d, sections: d.sections.map((s, i) => (i === si ? fn(s) : s)) }));
  const editLink = (di: number, si: number, li: number, patch: Partial<MenuLink>) =>
    editSection(di, si, (s) => ({ ...s, items: s.items.map((l, i) => (i === li ? { ...l, ...patch } : l)) }));

  const save = async () => {
    if (!menu) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/nav-menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menu }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setMenu(data.menu);
      setSaved(true);
      setDirty(false);
      toast.success('Menu saved. It is live on the site.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save the menu');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm('Go back to the original menu? Your saved menu will be removed.')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/nav-menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reset: true }) });
      if (!res.ok) throw new Error('reset');
      await load();
      toast.success('The original menu is back.');
    } catch {
      toast.error('Failed to reset the menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !menu) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-heading">Menus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The menu at the top of every page. Home and Pricing are fixed. {saved ? 'A saved menu is in use.' : 'The original menu is in use.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset} disabled={saving || !saved}>
            <RotateCcw className="mr-2 h-4 w-4" /> Use the original
          </Button>
          <Button onClick={save} disabled={saving || !dirty}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save menu
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Demo button</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Button text</Label>
            <Input value={menu.cta.label} onChange={(e) => edit((m) => ({ ...m, cta: { ...m.cta, label: e.target.value } }))} />
          </div>
          <div>
            <Label>Goes to</Label>
            <Input value={menu.cta.href} onChange={(e) => edit((m) => ({ ...m, cta: { ...m.cta, href: e.target.value } }))} />
          </div>
        </CardContent>
      </Card>

      {menu.dropdowns.map((d, di) => (
        <Card key={di}>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Menu heading {di + 1}</Label>
              <Input value={d.label} onChange={(e) => editDropdown(di, (x) => ({ ...x, label: e.target.value }))} className="font-semibold" />
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" aria-label="Move heading left" disabled={di === 0} onClick={() => edit((m) => ({ ...m, dropdowns: move(m.dropdowns, di, -1) }))}><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" aria-label="Move heading right" disabled={di === menu.dropdowns.length - 1} onClick={() => edit((m) => ({ ...m, dropdowns: move(m.dropdowns, di, 1) }))}><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" aria-label="Remove heading" disabled={menu.dropdowns.length <= 1} onClick={() => edit((m) => ({ ...m, dropdowns: m.dropdowns.filter((_, i) => i !== di) }))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {d.sections.map((s, si) => (
              <div key={si} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[10rem] flex-1">
                    <Label className="text-xs text-muted-foreground">Group title (optional)</Label>
                    <Input value={s.title ?? ''} onChange={(e) => editSection(di, si, (x) => ({ ...x, title: e.target.value }))} />
                  </div>
                  <Button variant="outline" size="icon" aria-label="Move group up" disabled={si === 0} onClick={() => editDropdown(di, (x) => ({ ...x, sections: move(x.sections, si, -1) }))}><ArrowUp className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" aria-label="Move group down" disabled={si === d.sections.length - 1} onClick={() => editDropdown(di, (x) => ({ ...x, sections: move(x.sections, si, 1) }))}><ArrowDown className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" aria-label="Remove group" disabled={d.sections.length <= 1} onClick={() => editDropdown(di, (x) => ({ ...x, sections: x.sections.filter((_, i) => i !== si) }))}><Trash2 className="h-4 w-4" /></Button>
                </div>

                <div className="mt-3 space-y-2">
                  {s.items.map((l, li) => (
                    <div key={li} className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_8.5rem_auto]">
                      <Input aria-label="Link name" placeholder="Link name" value={l.label} onChange={(e) => editLink(di, si, li, { label: e.target.value })} />
                      <Input aria-label="Link address" placeholder="/page or https://..." value={l.href} onChange={(e) => editLink(di, si, li, { href: e.target.value })} />
                      <select
                        aria-label="Icon"
                        value={l.icon ?? ''}
                        onChange={(e) => editLink(di, si, li, { icon: (e.target.value || undefined) as MenuLink['icon'] })}
                        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                      >
                        <option value="">No icon</option>
                        {MENU_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" aria-label="Move link up" disabled={li === 0} onClick={() => editSection(di, si, (x) => ({ ...x, items: move(x.items, li, -1) }))}><ArrowUp className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" aria-label="Move link down" disabled={li === s.items.length - 1} onClick={() => editSection(di, si, (x) => ({ ...x, items: move(x.items, li, 1) }))}><ArrowDown className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" aria-label="Remove link" disabled={s.items.length <= 1} onClick={() => editSection(di, si, (x) => ({ ...x, items: x.items.filter((_, i) => i !== li) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <Input aria-label="Short line under the name" placeholder="Short line under the name (optional)" value={l.desc ?? ''} onChange={(e) => editLink(di, si, li, { desc: e.target.value || undefined })} className="sm:col-span-4" />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-2" disabled={s.items.length >= 30} onClick={() => editSection(di, si, (x) => ({ ...x, items: [...x.items, { label: 'New link', href: '/' }] }))}>
                  <Plus className="mr-1 h-4 w-4" /> Add a link
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" disabled={d.sections.length >= 6} onClick={() => editDropdown(di, (x) => ({ ...x, sections: [...x.sections, { title: '', items: [{ label: 'New link', href: '/' }] }] }))}>
              <Plus className="mr-1 h-4 w-4" /> Add a group
            </Button>

            <div className="grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Banner title at the top of the panel (optional, e.g. All modules)</Label>
                <Input value={d.footer?.label ?? ''} onChange={(e) => editDropdown(di, (x) => ({ ...x, footer: { ...x.footer, label: e.target.value, href: x.footer?.href ?? '' } }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Banner goes to</Label>
                <Input value={d.footer?.href ?? ''} onChange={(e) => editDropdown(di, (x) => ({ ...x, footer: { ...x.footer, label: x.footer?.label ?? '', href: e.target.value } }))} />
              </div>
            </div>
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground">Short line under the banner title (optional)</Label>
              <Input value={d.footer?.text ?? ''} onChange={(e) => editDropdown(di, (x) => ({ ...x, footer: { label: x.footer?.label ?? '', href: x.footer?.href ?? '', text: e.target.value } }))} />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-10">
        <Button variant="outline" disabled={menu.dropdowns.length >= 8} onClick={() => edit((m) => ({ ...m, dropdowns: [...m.dropdowns, { label: 'New menu', sections: [{ items: [{ label: 'New link', href: '/' }] }] }] }))}>
          <Plus className="mr-2 h-4 w-4" /> Add a menu heading
        </Button>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save menu
        </Button>
      </div>
    </div>
  );
}
