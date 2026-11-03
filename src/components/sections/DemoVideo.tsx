'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PlayCircle } from 'lucide-react';

import { VIDEOS } from '@/data/demo-videos';
import type { LinkedVideo } from '@/lib/video-embed';

// `available` lists the video ids whose files exist in /public/videos (checked
// on the server), so the section never shows a broken player.
// `links` are videos added by link in Admin > Site Content (YouTube or Vimeo). When there are any, they are shown instead of the files.
export default function DemoVideo({ available, links = [] }: { available: string[]; links?: LinkedVideo[] }) {
  const files = VIDEOS.filter((v) => available.includes(v.id));
  const videos: { id: string; title: string; poster: string | null; src: string; kind: 'iframe' | 'file' }[] = links.length
    ? links.map((l) => ({ id: l.id, title: l.title, poster: l.thumb, src: l.src, kind: l.kind }))
    : files.map((f) => ({ id: f.id, title: f.title, poster: f.poster, src: f.src, kind: 'file' as const }));
  const [activeId, setActiveId] = useState(videos[0]?.id);
  if (videos.length === 0) return null;
  const active = videos.find((v) => v.id === activeId) ?? videos[0];

  return (
    <section className="py-12 md:py-16 bg-surface-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">Product Videos</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-heading mb-3">See ChaloSchools in Action</h2>
          <p className="text-lg text-body">
            Short walkthroughs of key features.
          </p>
        </motion.div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card aspect-video mb-6">
          {active.kind === 'iframe' ? (
            <iframe
              key={active.id}
              src={active.src}
              title={active.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={active.id}
              controls
              poster={active.poster ?? undefined}
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={active.src} type="video/mp4" />
            </video>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {videos.map((v) => {
            const isActive = v.id === activeId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveId(v.id)}
                aria-pressed={isActive}
                className={`group relative rounded-xl overflow-hidden border-2 aspect-video transition-all ${
                  isActive ? 'border-primary' : 'border-border hover:border-primary/50'
                }`}
              >
                {v.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.poster} alt={v.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#0f2a4a,#026dde)]" />
                )}
                <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isActive ? 'bg-black/20' : 'bg-black/35 group-hover:bg-black/25'}`}>
                  <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
                </div>
                <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent text-white text-[10px] sm:text-[11px] font-medium p-2 text-left leading-tight">
                  {v.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
