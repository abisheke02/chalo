'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, Download, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AuditLogEntry {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  section: string;
  targetId: string | null;
  summary: string;
  ipAddress: string | null;
  createdAt: string;
}

const ACTION_STYLES: Record<string, string> = {
  login: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  logout: 'bg-muted text-body border-border',
  create: 'bg-[#026dde]/10 text-primary border-[#026dde]/20',
  update: 'bg-amber-50 text-amber-700 border-amber-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  status_change: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function AuditLogPageClient() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/audit-log');
        if (res.ok) {
          setLogs(await res.json());
        } else {
          toast.error('Failed to load audit log');
        }
      } catch {
        toast.error('Failed to load audit log');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return logs;
    const q = query.toLowerCase();
    return logs.filter(
      (l) =>
        l.userEmail.toLowerCase().includes(q) ||
        l.section.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q)
    );
  }, [logs, query]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter((l) => new Date(l.createdAt).toDateString() === today).length;
  }, [logs]);

  function exportCsv() {
    const header = ['Timestamp', 'User', 'Role', 'Action', 'Section', 'Target ID', 'Summary', 'IP Address'];
    const rows = filtered.map((l) => [l.createdAt, l.userEmail, l.userRole, l.action, l.section, l.targetId ?? '', l.summary, l.ipAddress ?? '']);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground">Every login and content change across the admin panel — who, what, and when.</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <CardContent className="p-0 text-center">
              <p className="text-xl font-bold">{logs.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="px-4 py-2">
            <CardContent className="p-0 text-center">
              <p className="text-xl font-bold text-primary">{todayCount}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
        <ShieldCheck className="size-4 shrink-0" />
        Elevated privileges active — all admin and analyst actions are recorded here for security auditing.
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by user, section, action, or summary..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg font-medium">No matching activity</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Timeline</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-right pr-4">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-4 text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{log.userEmail}</p>
                    <p className="text-xs text-muted-foreground capitalize">{log.userRole}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ACTION_STYLES[log.action] || ''}>
                      {log.action.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{log.section.replace('-', ' ')}</TableCell>
                  <TableCell className="text-sm max-w-[320px] truncate" title={log.summary}>{log.summary}</TableCell>
                  <TableCell className="text-right pr-4 text-xs text-muted-foreground">{log.ipAddress || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
