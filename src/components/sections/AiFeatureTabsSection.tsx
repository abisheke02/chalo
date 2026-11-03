import { features } from '@/data/site-data';
import { MODULE_CONTENT } from '@/data/module-content';
import AiFeatureTabs, { type AiTab } from './AiFeatureTabs';

// The three modules with intelligence built in. The words come from each module's page content.
const SLUGS = ['ai-secretary', 'timetable', 'performance-insights'];

export default function AiFeatureTabsSection() {
  const tabs: AiTab[] = SLUGS.flatMap((slug) => {
    const f = features.find((x) => x.slug === slug);
    const c = MODULE_CONTENT[slug];
    if (!f || !c) return [];
    return [{ slug, title: f.title, blurb: c.purpose, points: c.seeInside.slice(0, 4) }];
  });
  return <AiFeatureTabs tabs={tabs} />;
}
