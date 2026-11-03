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

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  schoolName: string | null;
  location: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CaseStudiesPage() {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseStudies = useCallback(async () => {
    try {
      const res = await fetch('/api/case-studies');
      if (res.ok) {
        const data = await res.json();
        setCaseStudies(data);
      }
    } catch {
      toast.error('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  async function togglePublished(cs: CaseStudy) {
    const newPublished = !cs.published;
    try {
      const res = await fetch(`/api/case-studies/${cs.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublished }),
      });
      if (res.ok) {
        toast.success(`Case study ${newPublished ? 'published' : 'unpublished'}`);
        fetchCaseStudies();
      } else {
        toast.error('Failed to update case study');
      }
    } catch {
      toast.error('Failed to update case study');
    }
  }

  async function deleteCaseStudy(id: string) {
    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Case study deleted');
        fetchCaseStudies();
      } else {
        toast.error('Failed to delete case study');
      }
    } catch {
      toast.error('Failed to delete case study');
    }
  }

  function formatDate(dateStr: string) {
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
          <h1 className="text-2xl font-bold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground">Manage your case studies.</p>
        </div>
        <Button onClick={() => router.push('/admin/case-studies/new')}>
          <Plus className="size-4" />
          Add New Case Study
        </Button>
      </div>

      {caseStudies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No case studies yet</p>
          <p className="text-sm mt-1">Click &quot;Add New Case Study&quot; to create your first one.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseStudies.map((cs) => (
                <TableRow key={cs.id}>
                  <TableCell className="pl-4 font-medium max-w-[250px] truncate">
                    {cs.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cs.schoolName || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cs.location || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cs.published}
                        onCheckedChange={() => togglePublished(cs)}
                      />
                      <Badge variant={cs.published ? 'default' : 'outline'}>
                        {cs.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(cs.createdAt)}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/case-studies/edit/${cs.id}`)}
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
                            <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{cs.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCaseStudy(cs.id)}
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