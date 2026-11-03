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

interface ReleaseNote {
  id: string;
  title: string;
  slug: string;
  version: string;
  type: string;
  releaseDate: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ReleaseNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/release-notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch {
      toast.error('Failed to load release notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  async function togglePublished(note: ReleaseNote) {
    const newPublished = !note.published;
    try {
      const res = await fetch(`/api/release-notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished }),
      });
      if (res.ok) {
        toast.success(`Release note ${newPublished ? 'published' : 'unpublished'}`);
        fetchNotes();
      } else {
        toast.error('Failed to update release note');
      }
    } catch {
      toast.error('Failed to update release note');
    }
  }

  async function deleteNote(id: string) {
    try {
      const res = await fetch(`/api/release-notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Release note deleted');
        fetchNotes();
      } else {
        toast.error('Failed to delete release note');
      }
    } catch {
      toast.error('Failed to delete release note');
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
          <h1 className="text-2xl font-bold tracking-tight">Release Notes</h1>
          <p className="text-muted-foreground">Manage your release notes.</p>
        </div>
        <Button onClick={() => router.push('/admin/release-notes/new')}>
          <Plus className="size-4" />
          Add New
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No release notes yet</p>
          <p className="text-sm mt-1">Click &quot;Add New&quot; to create your first release note.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="pl-4 font-medium max-w-[250px] truncate">
                    {note.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{note.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{note.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(note.releaseDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={note.published}
                        onCheckedChange={() => togglePublished(note)}
                      />
                      <Badge variant={note.published ? 'default' : 'outline'}>
                        {note.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/release-notes/edit/${note.id}`)}
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
                            <AlertDialogTitle>Delete Release Note</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{note.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteNote(note.id)}
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