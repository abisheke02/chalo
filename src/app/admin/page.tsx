'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Video,
  BookOpen,
  MessageSquareQuote,
  CircleHelp,
  Newspaper,
  LifeBuoy,
  Tag,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Settings2,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Stats {
  totalLeads: number;
  newLeads: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalWebinars: number;
  publishedWebinars: number;
  totalCaseStudies: number;
  publishedCaseStudies: number;
  totalNews: number;
  publishedNews: number;
  totalHelpDocs: number;
  publishedHelpDocs: number;
  totalReleaseNotes: number;
  publishedReleaseNotes: number;
  totalTestimonials: number;
  publishedTestimonials: number;
  totalFAQs: number;
  publishedFAQs: number;
  totalPublished: number;
  totalAll: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [siteContentCount, setSiteContentCount] = useState<number>(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [leadsRes, blogsRes, webinarsRes, caseStudiesRes, newsRes, helpDocsRes, releaseNotesRes, testimonialsRes, faqsRes, siteContentRes] = await Promise.all([
          fetch('/api/admin/contact-submissions'),
          fetch('/api/blogs?list=true'),
          fetch('/api/webinars?list=true'),
          fetch('/api/case-studies?list=true'),
          fetch('/api/admin/news'),
          fetch('/api/admin/help-docs'),
          fetch('/api/admin/release-notes'),
          fetch('/api/admin/testimonials'),
          fetch('/api/admin/faqs'),
          fetch('/api/admin/site-content'),
        ]);
        const leads = await leadsRes.json();
        const blogs = await blogsRes.json();
        const webinars = await webinarsRes.json();
        const caseStudies = await caseStudiesRes.json();
        const news = await newsRes.json();
        const helpDocs = await helpDocsRes.json();
        const releaseNotes = await releaseNotesRes.json();
        const testimonials = await testimonialsRes.json();
        const faqs = await faqsRes.json();
        const siteContent = await siteContentRes.json();
        setSiteContentCount(Array.isArray(siteContent) ? siteContent.length : 0);

        const publishedBlogs = blogs.filter((b: { published: boolean }) => b.published).length;
        const publishedWebinars = webinars.filter((w: { published: boolean }) => w.published).length;
        const publishedCaseStudies = caseStudies.filter((c: { published: boolean }) => c.published).length;
        const publishedNews = news.filter((n: { published: boolean }) => n.published).length;
        const publishedHelpDocs = helpDocs.filter((h: { published: boolean }) => h.published).length;
        const publishedReleaseNotes = releaseNotes.filter((r: { published: boolean }) => r.published).length;
        const publishedTestimonials = testimonials.filter((t: { published: boolean }) => t.published).length;
        const publishedFAQs = faqs.filter((f: { published: boolean }) => f.published).length;

        const totalAll = blogs.length + webinars.length + caseStudies.length + news.length + helpDocs.length + releaseNotes.length + testimonials.length + faqs.length;
        const totalPublished = publishedBlogs + publishedWebinars + publishedCaseStudies + publishedNews + publishedHelpDocs + publishedReleaseNotes + publishedTestimonials + publishedFAQs;

        setStats({
          totalLeads: Array.isArray(leads) ? leads.length : 0,
          newLeads: Array.isArray(leads) ? leads.filter((l: { status: string }) => l.status === 'new').length : 0,
          totalBlogs: blogs.length,
          publishedBlogs,
          totalWebinars: webinars.length,
          publishedWebinars,
          totalCaseStudies: caseStudies.length,
          publishedCaseStudies,
          totalNews: news.length,
          publishedNews,
          totalHelpDocs: helpDocs.length,
          publishedHelpDocs,
          totalReleaseNotes: releaseNotes.length,
          publishedReleaseNotes,
          totalTestimonials: testimonials.length,
          publishedTestimonials,
          totalFAQs: faqs.length,
          publishedFAQs,
          totalPublished,
          totalAll,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Total Leads',
      value: stats?.totalLeads ?? 0,
      sub: `${stats?.newLeads ?? 0} new`,
      icon: Inbox,
      href: '/admin/leads',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Total Blogs',
      value: stats?.totalBlogs ?? 0,
      sub: `${stats?.publishedBlogs ?? 0} published`,
      icon: FileText,
      href: '/admin/blogs',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950',
    },
    {
      label: 'Total Webinars',
      value: stats?.totalWebinars ?? 0,
      sub: `${stats?.publishedWebinars ?? 0} published`,
      icon: Video,
      href: '/admin/webinars',
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950',
    },
    {
      label: 'Total Case Studies',
      value: stats?.totalCaseStudies ?? 0,
      sub: `${stats?.publishedCaseStudies ?? 0} published`,
      icon: BookOpen,
      href: '/admin/case-studies',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950',
    },
    {
      label: 'Total News',
      value: stats?.totalNews ?? 0,
      sub: `${stats?.publishedNews ?? 0} published`,
      icon: Newspaper,
      href: '/admin/news',
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950',
    },
    {
      label: 'Total Help Docs',
      value: stats?.totalHelpDocs ?? 0,
      sub: `${stats?.publishedHelpDocs ?? 0} published`,
      icon: LifeBuoy,
      href: '/admin/help-docs',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950',
    },
    {
      label: 'Total Release Notes',
      value: stats?.totalReleaseNotes ?? 0,
      sub: `${stats?.publishedReleaseNotes ?? 0} published`,
      icon: Tag,
      href: '/admin/release-notes',
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Total Testimonials',
      value: stats?.totalTestimonials ?? 0,
      sub: `${stats?.publishedTestimonials ?? 0} published`,
      icon: MessageSquareQuote,
      href: '/admin/testimonials',
      color: 'text-pink-600 bg-pink-50 dark:bg-pink-950',
    },
    {
      label: 'Total FAQs',
      value: stats?.totalFAQs ?? 0,
      sub: `${stats?.publishedFAQs ?? 0} published`,
      icon: CircleHelp,
      href: '/admin/faqs',
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950',
    },
    {
      label: 'Site Content Keys',
      value: siteContentCount,
      sub: 'editable text strings',
      icon: Settings2,
      href: '/admin/site-content',
      color: 'text-slate-600 bg-slate-50 dark:bg-slate-950',
    },
    {
      label: 'Total Published',
      value: stats?.totalPublished ?? 0,
      sub: `out of ${stats?.totalAll ?? 0} total`,
      icon: CheckCircle2,
      href: '#',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950',
    },
  ];

  const quickLinks = [
    { label: 'View Leads', href: '/admin/leads', icon: Inbox },
    { label: 'Manage Blogs', href: '/admin/blogs', icon: FileText },
    { label: 'Manage Webinars', href: '/admin/webinars', icon: Video },
    { label: 'Manage Case Studies', href: '/admin/case-studies', icon: BookOpen },
    { label: 'Manage News & Events', href: '/admin/news', icon: Newspaper },
    { label: 'Manage Help Docs', href: '/admin/help-docs', icon: LifeBuoy },
    { label: 'Manage Release Notes', href: '/admin/release-notes', icon: Tag },
    { label: 'Manage Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Manage FAQs', href: '/admin/faqs', icon: CircleHelp },
    { label: 'Edit Site Content', href: '/admin/site-content', icon: Settings2 },
  ];

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
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content management system.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => card.href !== '#' && router.push(card.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to content management sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                className="h-auto py-4 flex items-center justify-between px-4"
                onClick={() => router.push(link.href)}
              >
                <span className="flex items-center gap-2">
                  <link.icon className="size-4" />
                  {link.label}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}