'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Webinar {
  id: string;
  title: string;
  slug: string;
  speaker: string | null;
  speakerTitle: string | null;
  published: boolean;
  date: string | null;
  duration: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WebinarsPage() {
  const router = useRouter();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebinars = useCallback(async () => {
    try {
      const res = await fetch('/api/webinars');
      if (res.ok) {
        const data = await res.json();
        setWebinars(data);
      }
    } catch {
      toast.error('Failed to load webinars');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebinars();
  }, [fetchWebinars]);

  async function togglePublished(webinar: Webinar) {
    const newPublished = !webinar.published;
    try {
      const res = await fetch(`/api/webinars/${webinar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished }),
      });
      if (res.ok) {
        toast.success(`Webinar ${newPublished ? 'published' : 'unpublished'}`);
        fetchWebinars();
      } else {
        toast.error('Failed to update webinar');
      }
    } catch {
      toast.error('Failed to update webinar');
    }
  }

  async function deleteWebinar(id: string) {
    try {
      const res = await fetch(`/api/webinars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Webinar deleted');
        fetchWebinars();
      } else {
        toast.error('Failed to delete webinar');
      }
    } catch {
      toast.error('Failed to delete webinar');
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webinars</h1>
          <p className="text-muted-foreground">Manage your webinar sessions.</p>
        </div>
        <Button onClick={() => router.push('/admin/webinars/new')}>
          <Plus className="size-4" />
          Add New Webinar
        </Button>
      </div>

      {webinars.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No webinars yet</p>
          <p className="text-sm mt-1">Click &quot;Add New Webinar&quot; to create your first session.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>Speaker</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webinars.map((webinar) => (
                <TableRow key={webinar.id}>
                  <TableCell className="pl-4 font-medium max-w-[250px] truncate">
                    {webinar.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {webinar.speaker || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(webinar.date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {webinar.duration || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webinar.published}
                        onCheckedChange={() => togglePublished(webinar)}
                      />
                      <Badge variant={webinar.published ? 'default' : 'outline'}>
                        {webinar.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/webinars/edit/${webinar.id}`)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Webinar</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{webinar.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteWebinar(webinar.id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}