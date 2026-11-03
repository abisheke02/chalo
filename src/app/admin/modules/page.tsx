'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import {
  Loader2, ImageIcon, Upload, Trash2,
  UserPlus, IndianRupee, ClipboardCheck, CalendarDays, MessageCircle, BarChart3,
  FileText, GraduationCap, Users, Wallet, Package, TrendingUp, Bot, BookOpen, Bus,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ModuleDef {
  id: string;
  title: string;
  icon: LucideIcon;
}

// Same modules as src/components/sections/ModuleExplorer.tsx (id + title
// must match exactly — that's what the SiteContent key `module_image_<id>`
// and the public /product page join on). Keep this list in sync whenever a
// module is added/removed there.
const MODULES: ModuleDef[] = [
  { id: 'admissions', title: 'Admissions Management', icon: UserPlus },
  { id: 'student', title: 'Student Management', icon: GraduationCap },
  { id: 'staff', title: 'Staff Management', icon: Users },
  { id: 'fees', title: 'Fee Management', icon: IndianRupee },
  { id: 'timetable', title: 'AI Powered Timetable & Scheduling', icon: CalendarDays },
  { id: 'attendance', title: 'Attendance Management', icon: ClipboardCheck },
  { id: 'exams', title: 'Academic & Examination', icon: FileText },
  { id: 'communication', title: 'Communication Management', icon: MessageCircle },
  { id: 'reports', title: 'Reports & Analytics', icon: BarChart3 },
  { id: 'inventory', title: 'Academic Inventory Tracking', icon: Package },
  { id: 'payroll', title: 'Payroll Management', icon: Wallet },
  { id: 'library', title: 'Library Management', icon: BookOpen },
  { id: 'transport', title: 'Transport Management', icon: Bus },
  { id: 'performance-insights', title: 'Inspace Performance Insights', icon: TrendingUp },
  { id: 'ai-secretary', title: 'AI Secretary', icon: Bot },
  { id: 'parent-app', title: 'Parent & Student App', icon: MessageCircle },
];

const MAX_DIMENSION = 640;
const JPEG_QUALITY = 0.82;

// Resize/compress in the browser before storing — there's no file-upload
// backend or persistent disk on Render, so the image is stored as a data URL
// directly in SiteContent.value (Turso is the actual persistent store here).
// Keeping it small keeps that row (and the page payload) reasonable.
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ModuleImagesPage() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: { key: string; value: string }[] = await res.json();
      const map: Record<string, string> = {};
      for (const row of data) {
        if (row.key.startsWith('module_image_') && row.value) {
          map[row.key.replace('module_image_', '')] = row.value;
        }
      }
      setImages(map);
    } catch {
      toast.error('Failed to load module images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleFileSelected(moduleId: string, file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setBusyId(moduleId);
    try {
      const dataUrl = await compressImage(file);
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `module_image_${moduleId}`, value: dataUrl }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setImages((prev) => ({ ...prev, [moduleId]: dataUrl }));
      toast.success('Image updated');
    } catch {
      toast.error('Failed to upload image — please try again');
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(moduleId: string) {
    setBusyId(moduleId);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `module_image_${moduleId}`, value: '' }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setImages((prev) => {
        const next = { ...prev };
        delete next[moduleId];
        return next;
      });
      toast.success('Reverted to default icon');
    } catch {
      toast.error('Failed to remove image — please try again');
    } finally {
      setBusyId(null);
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
          <ImageIcon className="size-6" />
          Module Images
        </h1>
        <p className="text-muted-foreground">
          Upload a custom image for any module on the /product page — it replaces the default icon in that module&apos;s card. Leave a module without an image and it keeps showing its default icon.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Modules</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const image = images[mod.id];
              const isBusy = busyId === mod.id;
              return (
                <div key={mod.id} className="flex items-center gap-4 rounded-xl border border-border p-4">
                  <div className="w-16 h-16 shrink-0 rounded-lg border border-border overflow-hidden flex items-center justify-center bg-muted/40">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={mod.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{image ? 'Custom image' : 'Default icon'}</p>
                    <div className="flex items-center gap-2">
                      <input
                        ref={(el) => { fileInputRefs.current[mod.id] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelected(mod.id, file);
                          e.target.value = '';
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => fileInputRefs.current[mod.id]?.click()}
                      >
                        {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                        Upload
                      </Button>
                      {image && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isBusy}
                          onClick={() => handleRemove(mod.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
