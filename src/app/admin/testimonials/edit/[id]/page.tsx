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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    role: '',
    school: '',
    content: '',
    rating: '5',
    order: '0',
    published: false,
  });

  useEffect(() => {
    async function loadTestimonial() {
      try {
        const res = await fetch(`/api/testimonials/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || '',
            role: data.role || '',
            school: data.school || '',
            content: data.content || '',
            rating: String(data.rating ?? 5),
            order: String(data.order ?? 0),
            published: data.published || false,
          });
        } else {
          toast.error('Failed to load testimonial');
          router.push('/admin/testimonials');
        }
      } catch {
        toast.error('Failed to load testimonial');
        router.push('/admin/testimonials');
      } finally {
        setLoading(false);
      }
    }
    loadTestimonial();
  }, [id, router]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: parseInt(form.rating, 10),
          order: parseInt(form.order, 10),
        }),
      });
      if (res.ok) {
        toast.success('Testimonial updated successfully');
        router.push('/admin/testimonials');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update testimonial');
      }
    } catch {
      toast.error('Failed to update testimonial');
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
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/testimonials')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update the testimonial details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Customer name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="e.g. Principal"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School / Organization</Label>
              <Input
                id="school"
                placeholder="School or organization name"
                value={form.school}
                onChange={(e) => updateField('school', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Testimonial Content</Label>
              <Textarea
                id="content"
                placeholder="What did they say about us?"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rating</Label>
                <Select
                  value={form.rating}
                  onValueChange={(val) => updateField('rating', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => updateField('order', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="published" className="cursor-pointer">Published</Label>
                <p className="text-xs text-muted-foreground">
                  Make this testimonial visible to the public
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
                onClick={() => router.push('/admin/testimonials')}
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