'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function EditWebinarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    speaker: '',
    speakerTitle: '',
    videoUrl: '',
    coverImage: '',
    date: '',
    duration: '',
    published: false,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    async function loadWebinar() {
      try {
        const res = await fetch(`/api/webinars/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            content: data.content || '',
            speaker: data.speaker || '',
            speakerTitle: data.speakerTitle || '',
            videoUrl: data.videoUrl || '',
            coverImage: data.coverImage || '',
            date: data.date ? new Date(data.date).toISOString().slice(0, 16) : '',
            duration: data.duration || '',
            published: data.published || false,
          });
        } else {
          toast.error('Failed to load webinar');
          router.push('/admin/webinars');
        }
      } catch {
        toast.error('Failed to load webinar');
        router.push('/admin/webinars');
      } finally {
        setLoading(false);
      }
    }
    loadWebinar();
  }, [id, router]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManuallyEdited) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/webinars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Webinar updated successfully');
        router.push('/admin/webinars');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update webinar');
      }
    } catch {
      toast.error('Failed to update webinar');
    } finally {
      setSubmitting(false);
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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/webinars')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Webinar</h1>
          <p className="text-muted-foreground">Update the webinar details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webinar Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter webinar title"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="webinar-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  updateField('slug', e.target.value);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the webinar"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Detailed webinar content"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={8}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="speaker">Speaker</Label>
                <Input
                  id="speaker"
                  placeholder="Speaker name"
                  value={form.speaker}
                  onChange={(e) => updateField('speaker', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speakerTitle">Speaker Title</Label>
                <Input
                  id="speakerTitle"
                  placeholder="e.g. CEO, Director"
                  value={form.speakerTitle}
                  onChange={(e) => updateField('speakerTitle', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 45 min"
                  value={form.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={(e) => updateField('videoUrl', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                placeholder="https://example.com/image.jpg"
                value={form.coverImage}
                onChange={(e) => updateField('coverImage', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="published" className="cursor-pointer">Published</Label>
                <p className="text-xs text-muted-foreground">
                  Make this webinar visible to the public
                </p>
              </div>
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(checked) => updateField('published', checked)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/webinars')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}