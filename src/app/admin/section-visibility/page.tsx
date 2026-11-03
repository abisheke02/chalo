'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Eye, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SiteContentRecord {
  key: string;
  value: string;
}

// One entry per toggleable homepage section, in the same top-to-bottom order
// they render in src/app/page.tsx. Hero and Footer are structural and always
// on — everything else can be switched off independently without affecting
// that same content anywhere else it's used (e.g. the actual /blog page).
const HOMEPAGE_SECTIONS = [
  { key: 'trust_stats', label: 'Trust Stats', description: '"200+ Schools, 1.5+ Million Students" stat bar' },
  { key: 'social_proof', label: 'Social Proof Bar', description: 'Scrolling strip of school names, shown under Trust Stats' },
  { key: 'problems', label: 'Problems / Challenges', description: '"Running a School Shouldn\'t Mean..." cards' },
  { key: 'features', label: 'Feature Highlights', description: '14-module grid with category tabs' },
  { key: 'our_apps', label: 'Our Apps', description: 'Parent / Teacher / Management app showcase' },
  { key: 'integrations', label: 'Integrations Strip', description: 'Biometric, GPS, Tally, WhatsApp, Payment — shown at the foot of Feature Highlights' },
  { key: 'demo_video', label: 'Demo Video', description: 'Product walkthrough video' },
  { key: 'why_choose_us', label: 'Why Choose Us', description: 'Benefits and why schools choose ChaloSchools' },
  { key: 'security_compliance', label: 'Security & Compliance', description: 'DPDP Act 2023 section' },
  { key: 'board_tabs', label: 'Board-Specific Tabs', description: 'CBSE / ICSE / IB tabs' },
  { key: 'process_steps', label: 'Process Steps', description: '"Get Started in 3 Steps" section' },
  { key: 'testimonials', label: 'Testimonials', description: 'Customer testimonial carousel' },
  { key: 'case_study', label: 'Case Study Snapshot', description: 'Featured case study callout' },
  { key: 'pricing_teaser', label: 'Pricing Teaser', description: 'Pricing plans preview' },
  { key: 'faq', label: 'Homepage FAQ', description: 'FAQ accordion' },
  { key: 'blog_strip', label: 'Blog / Latest News', description: 'Latest blog posts strip (the /blog page itself is unaffected)' },
  { key: 'final_cta', label: 'Final CTA', description: 'Bottom "Book a Demo" banner' },
];

export default function SectionVisibilityPage() {
  const [values, setValues] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: SiteContentRecord[] = await res.json();
      const map: Record<string, boolean> = {};
      for (const s of HOMEPAGE_SECTIONS) {
        const row = data.find((r) => r.key === `visibility_${s.key}`);
        // Missing row = never toggled = visible by default.
        map[s.key] = row ? row.value !== 'false' : true;
      }
      setValues(map);
    } catch {
      toast.error('Failed to load section visibility');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  async function handleToggle(key: string, next: boolean) {
    setValues((prev) => ({ ...prev, [key]: next }));
    setSaving(key);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `visibility_${key}`, value: next ? 'true' : 'false' }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(`${next ? 'Shown' : 'Hidden'} on the homepage`);
    } catch {
      // Revert on failure
      setValues((prev) => ({ ...prev, [key]: !next }));
      toast.error('Failed to update — please try again');
    } finally {
      setSaving(null);
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
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Eye className="size-6" />
          Section Visibility
        </h1>
        <p className="text-muted-foreground">
          Turn any homepage section on or off. Changes apply immediately — no other page is affected (e.g. hiding the Blog strip here keeps the full /blog page untouched).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="size-4" />
            Homepage Sections
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="divide-y">
            {HOMEPAGE_SECTIONS.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <Label htmlFor={`vis-${s.key}`} className="text-sm font-medium">
                    {s.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {saving === s.key && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
                  <Switch
                    id={`vis-${s.key}`}
                    checked={values[s.key] ?? true}
                    onCheckedChange={(checked) => handleToggle(s.key, checked)}
                    disabled={saving === s.key}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
