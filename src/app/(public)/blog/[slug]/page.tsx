import { safeJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site-url'
import PageHero from '@/components/PageHero';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await db.blogPost.findUnique({ where: { slug } })
  if (!blog) return { title: 'Blog Post Not Found' }

  return buildMetadata({
    title: `${blog.title}`,
    description: blog.excerpt || blog.content.substring(0, 160),
    path: `/blog/${slug}`,
    ...(blog.coverImage ? { image: blog.coverImage } : {}),
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const blog = await db.blogPost.findUnique({ where: { slug } })

  if (!blog || !blog.published) {
    notFound()
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
    image: blog.coverImage || undefined,
    author: { '@type': 'Organization', name: blog.author || 'ChaloSchools' },
    publisher: {
      '@type': 'Organization',
      name: 'ChaloSchools',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    datePublished: (blog.publishedAt || blog.createdAt).toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${blog.slug}` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `${SITE_URL}/blog/${blog.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-card">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {/* Breadcrumb */}
      <div className="bg-surface-2 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{blog.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <PageHero
        eyebrow={blog.category}
        title={blog.title}
        subtitle={blog.excerpt ?? undefined}
        scene="reports"
        features={[{ name: 'Practical Guides', line: 'Step-by-step advice for administrators.' }, { name: 'Resources', line: 'Templates and checklists to download.' }, { name: 'Data-Led Insights', line: 'Trends from schools across India.' }]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 gap-2 text-subtle hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-3">
            {blog.category}
          </Badge>
          <div className="flex items-center gap-4 text-sm text-subtle">
            {blog.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {blog.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />{' '}
              {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
        </header>

        {/* Cover image */}
        {blog.coverImage && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-sm">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <Separator className="mb-10" />

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-a:text-primary prose-strong:text-heading">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        {/* About the author */}
        <Separator className="my-10" />
        <div className="flex items-start gap-4 rounded-xl border border-border bg-surface-2 p-6">
          <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-heading">{blog.author || 'ChaloSchools Team'}</p>
            <p className="text-sm text-subtle mt-1 leading-relaxed">
              Published by the people building and supporting ChaloSchools — a school management ERP from{' '}
              <Link href="/about" className="text-primary hover:underline">Inspace Edu Solutions Private Limited</Link>, serving 200+ schools across India.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Separator className="my-10" />
        <div className="bg-brand-gradient rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to transform your school?</h3>
          <p className="text-white/70 mb-6">
            See how ChaloSchools can streamline your operations.
          </p>
          <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full px-8 shadow-lg">
            Book a Demo
          </Button>
        </div>
      </article>
    </div>
  )
}
