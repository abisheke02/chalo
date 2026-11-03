'use client';

/**
 * /theme — Internal theme review page (UNLISTED, admin-only).
 *
 * Not linked anywhere in the site nav and marked noindex. Lets the team preview
 * all 25 themes live. Selecting a theme here only affects THIS page's preview.
 * Click "Apply to live site" to persist the choice to the database — the public
 * site picks it up immediately on next page load, no redeploy needed.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES, type ThemeId } from '@/components/ThemeProvider';
import { ACTIVE_THEME } from '@/lib/theme-config';
import {
  Sun, Moon, Check, Copy, GraduationCap, ArrowRight, Phone,
  UserPlus, IndianRupee, ClipboardCheck, Star, BadgeCheck, Loader2, CloudUpload,
} from 'lucide-react';

export default function ThemePreviewPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ThemeId>(ACTIVE_THEME);
  const [liveTheme, setLiveTheme] = useState<ThemeId>(ACTIVE_THEME);
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [justApplied, setJustApplied] = useState(false);

  // Load the theme currently live on the public site.
  useEffect(() => {
    fetch('/api/admin/theme')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.activeTheme) {
          setLiveTheme(data.activeTheme);
          setSelected(data.activeTheme);
        }
      })
      .catch(() => {});
  }, []);

  // Apply the selected theme to <html> for a true live preview on this page.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selected);
  }, [selected]);

  // Restore the real live theme when leaving the page. Tracked via a ref
  // (not a dependency) so the unmount cleanup always sees the latest
  // liveTheme — including one just set by Apply — instead of the value
  // captured back when this effect first mounted.
  const liveThemeRef = useRef(liveTheme);
  useEffect(() => { liveThemeRef.current = liveTheme; }, [liveTheme]);
  useEffect(() => {
    return () => { document.documentElement.setAttribute('data-theme', liveThemeRef.current); };
  }, []);

  const light = THEMES.filter((t) => t.mode === 'light');
  const dark = THEMES.filter((t) => t.mode === 'dark');
  const current = THEMES.find((t) => t.id === selected)!;
  const snippet = `export const ACTIVE_THEME: ThemeId = '${selected}';`;

  function copySnippet() {
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  async function applyToLiveSite() {
    if (selected === liveTheme) return;
    if (!window.confirm(`Apply "${current.name}" to the live public site now? This changes what every visitor sees.`)) {
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to apply theme');
      }
      setLiveTheme(selected);
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 2500);
      // Root layout resolves the theme server-side and doesn't re-run on
      // soft (client-side) navigation — refresh so the rest of this tab's
      // session picks up the new theme without needing a hard reload.
      router.refresh();
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Failed to apply theme');
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* ─── Sidebar: theme picker ─── */}
      <aside className="lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card max-h-[40vh] lg:max-h-screen lg:sticky lg:top-0 overflow-y-auto">
        <div className="p-5 border-b border-border">
          <h1 className="text-lg font-bold text-heading">Theme Preview</h1>
          <p className="text-xs text-subtle mt-1">Internal tool — pick a theme to preview it, then Apply to make it live.</p>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <Sun className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Light Themes</span>
          </div>
          {light.map((t) => <ThemeRow key={t.id} t={t} selected={selected} onSelect={setSelected} liveId={liveTheme} />)}

          <div className="my-2 h-px bg-border" />

          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dark Themes</span>
          </div>
          {dark.map((t) => <ThemeRow key={t.id} t={t} selected={selected} onSelect={setSelected} liveId={liveTheme} />)}
        </div>
      </aside>

      {/* ─── Main: live preview canvas ─── */}
      <main className="flex-1 min-w-0">
        {/* Apply-instructions bar */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-subtle">
                Previewing: <span className="font-bold text-heading">{current.name}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">id: {current.id}</span>
                {current.id === liveTheme && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">● Live now</span>
                )}
              </p>
              <p className="text-xs text-subtle mt-1">
                {justApplied
                  ? 'Applied — this is now live on the public site.'
                  : selected === liveTheme
                  ? 'This theme is already live.'
                  : 'Not saved yet — click Apply to make this live, or copy the config line for a manual/offline change.'}
              </p>
              {applyError && <p className="text-xs text-red-600 mt-1">{applyError}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-muted text-foreground px-3 py-2 rounded-lg hover:bg-muted/70 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy config line'}
              </button>
              <button
                onClick={applyToLiveSite}
                disabled={applying || selected === liveTheme}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : justApplied ? <Check className="w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
                {applying ? 'Applying…' : justApplied ? 'Applied!' : selected === liveTheme ? 'Already live' : 'Apply to live site'}
              </button>
            </div>
          </div>
          <pre className="mt-3 text-[11px] bg-muted text-body rounded-lg px-3 py-2 overflow-x-auto"><code>{snippet}</code></pre>
        </div>

        {/* Mock site preview */}
        <div className="p-6 space-y-6">
          {/* Mock header */}
          <div className="rounded-xl border border-border bg-card px-5 py-3 flex items-center justify-between">
            <span className="font-extrabold text-primary text-lg">Chalo</span>
            <div className="hidden md:flex items-center gap-4 text-sm text-heading/80">
              <span>Home</span><span>Product</span><span>Features</span><span>Company</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs border border-primary text-primary rounded-full px-3 py-1.5 font-semibold">Talk to Sales</button>
              <button className="text-xs bg-primary text-primary-foreground rounded-full px-3 py-1.5 font-semibold">Book a Demo</button>
            </div>
          </div>

          {/* Mock hero band */}
          <div className="rounded-2xl bg-brand-gradient p-8 md:p-12 text-white relative overflow-hidden">
            <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Trusted by 200+ Schools
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">India&apos;s #1 School Management Software</h2>
            <p className="text-white/70 max-w-lg mb-6">Automate Admissions, Fees, Attendance &amp; Communication — all in one elegant platform.</p>
            <div className="flex gap-3">
              <button className="bg-primary text-primary-foreground font-semibold rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2">Book a Demo <ArrowRight className="w-4 h-4" /></button>
              <button className="border border-white/30 text-white font-semibold rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Talk to Sales</button>
            </div>
          </div>

          {/* Mock section on surface-2 with module cards */}
          <div className="rounded-2xl bg-surface-2 p-6">
            <div className="text-center mb-6">
              <span className="inline-block text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 mb-3">Everything You Need</span>
              <h3 className="text-2xl font-bold text-heading">Powerful Modules, One Dashboard</h3>
              <p className="text-body mt-2">Every tool your school needs, seamlessly integrated.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: UserPlus, label: 'Admissions', desc: 'Online admissions & enquiry' },
                { icon: IndianRupee, label: 'Fees & Finance', desc: 'Online fee collection' },
                { icon: ClipboardCheck, label: 'Attendance', desc: 'RFID & mobile tracking' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-xl bg-card border border-border p-5">
                  <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mb-3"><Icon className="w-5 h-5" /></div>
                  <h4 className="font-bold text-heading">{label}</h4>
                  <p className="text-sm text-subtle mt-1">{desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock testimonial card */}
          <div className="rounded-2xl bg-card border border-border p-6 max-w-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-accent fill-accent" />)}</div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full"><BadgeCheck className="w-3.5 h-3.5" /> Verified</span>
            </div>
            <p className="text-body text-sm leading-relaxed">&ldquo;Chalo reduced our admission time by <span className="font-semibold text-primary">70%</span> and automated fee collection.&rdquo;</p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">GS</div>
              <div><p className="font-bold text-sm text-heading">Group Captain Senthil</p><p className="text-xs text-subtle">Air Force School, Chennai</p></div>
            </div>
          </div>

          {/* Mock footer */}
          <div className="footer-surface rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5" /> <span className="font-bold">ChaloSchools</span></div>
            <p className="footer-muted text-sm max-w-sm">CHALO — Schools Automated. Complete School Management Software. ISO 27001:2022 Certified.</p>
            <p className="footer-muted text-xs mt-4">© 2026 ChaloSchools. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ThemeRow({
  t, selected, onSelect, liveId,
}: {
  t: typeof THEMES[number];
  selected: ThemeId;
  onSelect: (id: ThemeId) => void;
  liveId: ThemeId;
}) {
  const isSelected = t.id === selected;
  return (
    <button
      onClick={() => onSelect(t.id)}
      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}`}
    >
      <span className="flex shrink-0 rounded-md overflow-hidden border border-border">
        {t.swatch.map((c, i) => <span key={i} className="w-2.5 h-5 block" style={{ backgroundColor: c }} />)}
      </span>
      <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">{t.name}</span>
      {t.id === liveId && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold shrink-0">LIVE</span>}
      {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
    </button>
  );
}
