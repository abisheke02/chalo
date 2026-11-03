'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  coverImage: string | null;
  publishedAt: Date | null;
}

export default function BlogStrip({ posts = [] }: { posts?: BlogCard[] }) {
  // Gracefully hide the whole section if there are no published posts —
  // never render an empty "Latest News" block.
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <Badge className="mb-3 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">Resources</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-heading">Resources for Modern School Administrators</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:gap-2.5 transition-all shrink-0">
            Visit Resource Center <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#026dde]/10 to-[#026dde]/20" />
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px] bg-[#026dde]/10 text-primary border-0">{post.category}</Badge>
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-heading leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-subtle mt-2 line-clamp-2 flex-1">{post.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4">
                    Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
