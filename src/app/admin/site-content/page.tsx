'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, ChevronRight, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';

interface SiteContentRecord {
  id: string;
  key: string;
  value: string;
  section: string;
  label: string;
  type: string;
  order: number;
}

const SECTION_ORDER = [
  'Homepage - Hero',
  'Homepage - Ask Your School',
  'Homepage - How It Works',
  'Homepage - Social Proof',
  'Homepage - Problems',
  'Homepage - Features',
  'Homepage - Integrations',
  'Homepage - AI Features',
  'Homepage - More',
  'Homepage - School Year',
  'Homepage - Solutions',
  'Demo Video',
  'Homepage - Final CTA',
  'About',
  'Contact',
  'Careers',
];

export default function SiteContentPage() {
  const [records, setRecords] = useState<SiteContentRecord[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-content');
      if (!res.ok) throw new Error('Failed to fetch');
      const raw: SiteContentRecord[] = await res.json();
      // Section on/off toggles are managed on the dedicated Section Visibility
      // page (with proper switches), and module images on the dedicated
      // Module Images page (with previews/upload) — not as raw text here.
      const data = raw.filter((r) => !r.key.startsWith('visibility_') && !r.key.startsWith('module_image_') && r.key !== 'nav_menu');
      setRecords(data);

      // Auto-select the first section
      if (data.length > 0) {
        const sections = [...new Set(data.map((r) => r.section))];
        const ordered = sections.sort(
          (a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)
        );
        setActiveSection((prev) => prev ?? ordered[0] ?? null);
        setOpenSections((prev) => (prev.size === 0 ? new Set([ordered[0] ?? '']) : prev));
      }
    } catch {
      toast.error('Failed to load site content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Group records by section
  const sections = records.reduce<Record<string, SiteContentRecord[]>>(
    (acc, r) => {
      if (!acc[r.section]) acc[r.section] = [];
      acc[r.section].push(r);
      return acc;
    },
    {}
  );

  const orderedSections = Object.keys(sections).sort(
    (a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)
  );

  const getEditedValue = (key: string, fallback: string) => {
    return editedValues[key] !== undefined ? editedValues[key] : fallback;
  };

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (section: string) => {
    const sectionRecords = sections[section];
    if (!sectionRecords) return;

    const itemsToSave = sectionRecords
      .filter((r) => editedValues[r.key] !== undefined && editedValues[r.key] !== r.value)
      .map((r) => ({ key: r.key, value: editedValues[r.key] ?? r.value }));

    if (itemsToSave.length === 0) {
      toast.info('No changes to save');
      return;
    }

    setSaving(section);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSave }),
      });

      if (!res.ok) throw new Error('Failed to save');

      // Update local records
      setRecords((prev) =>
        prev.map((r) => {
          const updated = itemsToSave.find((i) => i.key === r.key);
          return updated ? { ...r, value: updated.value } : r;
        })
      );

      // Clear edited values for saved section
      setEditedValues((prev) => {
        const next = { ...prev };
        for (const r of sectionRecords) {
          delete next[r.key];
        }
        return next;
      });

      toast.success(`"${section}" saved successfully`);
    } catch {
      toast.error(`Failed to save "${section}"`);
    } finally {
      setSaving(null);
    }
  };

  const hasChangesInSection = (section: string) => {
    const sectionRecords = sections[section];
    if (!sectionRecords) return false;
    return sectionRecords.some(
      (r) => editedValues[r.key] !== undefined && editedValues[r.key] !== r.value
    );
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

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
          <Settings2 className="size-6" />
          Site Content Editor
        </h1>
        <p className="text-muted-foreground">
          Edit any text on the website without touching code. Changes take effect immediately.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Section List */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {orderedSections.map((section) => {
            const sectionRecords = sections[section];
            const isActive = activeSection === section;
            const changed = hasChangesInSection(section);

            return (
              <Collapsible
                key={section}
                open={openSections.has(section)}
                onOpenChange={() => toggleSection(section)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={(e) => {
                      if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-chevron]')) {
                        setActiveSection(section);
                        if (window.innerWidth < 1024) {
                          toggleSection(section);
                        }
                      }
                    }}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {section}
                      {changed && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </span>
                    <ChevronRight
                      data-chevron
                      className={`size-4 shrink-0 transition-transform ${
                        openSections.has(section) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 ml-4 space-y-0.5">
                    {sectionRecords?.map((r) => (
                      <button
                        key={r.key}
                        className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors truncate cursor-pointer"
                        onClick={() => setActiveSection(section)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Right Panel - Editor */}
        <div className="flex-1 min-w-0">
          {activeSection && sections[activeSection] ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{activeSection}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sections[activeSection].length} field{sections[activeSection].length !== 1 ? 's' : ''}
                      {hasChangesInSection(activeSection) && (
                        <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
                          Unsaved changes
                        </Badge>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSave(activeSection)}
                    disabled={saving !== null}
                    size="sm"
                  >
                    {saving === activeSection ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <Save className="size-4 mr-2" />
                    )}
                    Save Section
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-6">
                {sections[activeSection].map((record, idx) => (
                  <div key={record.key} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor={record.key} className="text-sm font-medium min-w-0">
                        {record.label}
                      </Label>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                        {record.type}
                      </Badge>
                    </div>
                    {record.type === 'textarea' ? (
                      <Textarea
                        id={record.key}
                        value={getEditedValue(record.key, record.value)}
                        onChange={(e) => handleChange(record.key, e.target.value)}
                        className="min-h-[100px] resize-y"
                      />
                    ) : (
                      <Input
                        id={record.key}
                        value={getEditedValue(record.key, record.value)}
                        onChange={(e) => handleChange(record.key, e.target.value)}
                      />
                    )}
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Key: {record.key}
                    </p>
                    {idx < sections[activeSection].length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-20 text-center text-muted-foreground">
                Select a section from the sidebar to start editing.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}