'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Settings2,
  FileText,
  Video,
  BookOpen,
  MessageSquareQuote,
  CircleHelp,
  Newspaper,
  LifeBuoy,
  Tag,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Inbox,
  History,
  Users,
  Eye,
  Search,
  Image as ImageIcon,
  ListTree,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import type { SessionUser } from '@/lib/session-store';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/admin/leads', label: 'Leads', icon: Inbox, adminOnly: true },
  { href: '/admin/audit-log', label: 'Audit Log', icon: History, adminOnly: true },
  { href: '/admin/users', label: 'Users', icon: Users, adminOnly: true },
  { href: '/admin/site-content', label: 'Site Content', icon: Settings2, adminOnly: false },
  { href: '/admin/section-visibility', label: 'Section Visibility', icon: Eye, adminOnly: false },
  { href: '/admin/menus', label: 'Menus', icon: ListTree, adminOnly: false },
  { href: '/admin/seo', label: 'SEO & Meta Tags', icon: Search, adminOnly: false },
  { href: '/admin/modules', label: 'Module Images', icon: ImageIcon, adminOnly: false },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText, adminOnly: false },
  { href: '/admin/webinars', label: 'Webinars', icon: Video, adminOnly: false },
  { href: '/admin/case-studies', label: 'Case Studies', icon: BookOpen, adminOnly: false },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, adminOnly: false },
  { href: '/admin/faqs', label: 'FAQs', icon: CircleHelp, adminOnly: false },
  { href: '/admin/news', label: 'News & Events', icon: Newspaper, adminOnly: false },
  { href: '/admin/help-docs', label: 'Help Docs', icon: LifeBuoy, adminOnly: false },
  { href: '/admin/release-notes', label: 'Release Notes', icon: Tag, adminOnly: true },
];

export default function AdminLayoutClient({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || user.role === 'admin');

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // Ignore errors, still redirect
    }
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b shrink-0">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
            <LayoutDashboard className="size-5" />
            <span>Admin Panel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Current user */}
        <div className="px-3 py-3 border-t shrink-0">
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-medium truncate">{user.email}</p>
            <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="shrink-0 capitalize">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t shrink-0 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="h-14 border-b bg-background flex items-center px-4 lg:px-6 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
