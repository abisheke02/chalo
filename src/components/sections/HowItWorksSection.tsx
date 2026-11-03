import fs from 'fs';
import path from 'path';
import { features } from '@/data/site-data';
import { MODULE_CONTENT } from '@/data/module-content';
import HowItWorks, { type HowItem } from './HowItWorks';

// Videos that match a module. A module only plays a video when its file is in /public/videos;
// otherwise the walkthrough of its steps is shown.
const VIDEO_FOR: Record<string, { id: string; poster?: string }> = {
  timetable: { id: 'ai-timetable-generation', poster: '/images/videos/ai-timetable-generation.webp' },
  'performance-insights': { id: 'performance-insights', poster: '/images/videos/performance-insights.jpg' },
};

export default function HowItWorksSection() {
  const items: HowItem[] = features
    .filter((f) => MODULE_CONTENT[f.slug])
    .map((f) => {
      const c = MODULE_CONTENT[f.slug];
      const stage = c.howTo[0];
      const v = VIDEO_FOR[f.slug];
      const hasFile = v && fs.existsSync(path.join(process.cwd(), 'public', 'videos', `${v.id}.mp4`));
      return {
        slug: f.slug,
        title: f.shortTitle,
        stage: stage.stage,
        steps: stage.steps.slice(0, 4),
        video: hasFile ? { src: `/videos/${v.id}.mp4`, poster: v.poster } : undefined,
      };
    });
  return <HowItWorks items={items} />;
}
