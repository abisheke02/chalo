'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewTestimonialPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    school: '',
    content: '',
    rating: '5',
    order: '0',
    published: false,
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: parseInt(form.rating, 10),
          order: parseInt(form.order, 10),
        }),
      });
      if (res.ok) {
        toast.success('Testimonial created successfully');
        router.push('/admin/testimonials');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create testimonial');
      }
    } catch {
      toast.error('Failed to create testimonial');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/testimonials')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Testimonial</h1>
          <p className="text-muted-foreground">Add a new customer testimonial.</p>
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
                Create Testimonial
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