'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, Trash2, Loader2, Mail, Phone, MessageCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  institution: string | null;
  numberOfStudents: string | null;
  city: string | null;
  currentSoftware: string | null;
  message: string | null;
  status: string;
  source: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#026dde]/10 text-primary border-[#026dde]/20',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const SOURCE_CONFIG: Record<string, { label: string; icon: typeof Mail; className: string }> = {
  contact_form: { label: 'Contact Form', icon: FileText, className: 'bg-gray-100 text-gray-700 border-gray-200' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, className: 'bg-[#25D366]/10 text-[#1da851] border-[#25D366]/20' },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contact-submissions');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else {
        toast.error('Failed to load leads');
      }
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function updateStatus(id: string, status: string) {
    const prev = leads;
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setLeads(prev);
        toast.error('Failed to update status');
      }
    } catch {
      setLeads(prev);
      toast.error('Failed to update status');
    }
  }

  async function deleteLead(id: string) {
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Lead deleted');
        setLeads((cur) => cur.filter((l) => l.id !== id));
      } else {
        toast.error('Failed to delete lead');
      }
    } catch {
      toast.error('Failed to delete lead');
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
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">Contact form submissions from prospective schools.</p>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No leads yet</p>
          <p className="text-sm mt-1">Submissions from the contact form will show up here.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">School / Contact</TableHead>
                <TableHead>Email / Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="pl-4 max-w-[200px]">
                    <p className="font-medium truncate">{lead.institution || lead.name}</p>
                    {lead.institution && <p className="text-xs text-muted-foreground truncate">{lead.name}</p>}
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px]">
                    {lead.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                        {lead.email}
                      </p>
                    )}
                    {lead.phone && (
                      <p className="flex items-center gap-1.5 text-muted-foreground truncate">
                        <Phone className="size-3.5 shrink-0" />
                        {lead.phone}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const src = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.contact_form;
                      const SrcIcon = src.icon;
                      return (
                        <Badge variant="outline" className={`gap-1 ${src.className}`}>
                          <SrcIcon className="size-3" />
                          {src.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.numberOfStudents || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.city || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status} onValueChange={(value) => updateStatus(lead.id, value)}>
                      <SelectTrigger size="sm" className={`h-7 text-xs font-medium ${STATUS_STYLES[lead.status] || ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewing(lead)}>
                        <Eye className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the submission from &quot;{lead.institution || lead.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLead(lead.id)}
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

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.institution || viewing.name}</DialogTitle>
                <DialogDescription>
                  Submitted {new Date(viewing.createdAt).toLocaleString('en-IN')} via {(SOURCE_CONFIG[viewing.source] || SOURCE_CONFIG.contact_form).label}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Name</p>
                    <p className="font-medium">{viewing.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className={STATUS_STYLES[viewing.status] || ''}>
                      {viewing.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{viewing.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{viewing.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Number of Students</p>
                    <p className="font-medium">{viewing.numberOfStudents || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="font-medium">{viewing.city || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Current Software</p>
                    <p className="font-medium">{viewing.currentSoftware || '—'}</p>
                  </div>
                </div>
                {viewing.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3">{viewing.message}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
