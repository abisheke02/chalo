export interface WalkthroughVideo {
  id: string;
  title: string;
  src: string;
  poster: string;
}

// Real product walkthrough videos, self-hosted in /public/videos rather than
// hotlinked from chaloschools.com — this build is on track to eventually
// replace that domain, so linking to its assets directly would risk breaking
// this section at the moment of cutover.
export const VIDEOS: WalkthroughVideo[] = [
  { id: 'ai-rephrasing', title: 'AI Rephrasing in Chalo School ERP', src: '/videos/ai-rephrasing.mp4', poster: '/images/videos/ai-rephrasing.jpg' },
  { id: 'performance-insights', title: 'Inspace Performance Insights Platform for K12 Schools', src: '/videos/performance-insights.mp4', poster: '/images/videos/performance-insights.jpg' },
  { id: 'data-privacy-security', title: 'Enhancing Trust through Data Privacy and Security', src: '/videos/data-privacy-security.mp4', poster: '/images/videos/data-privacy-security.webp' },
  { id: 'ai-timetable-generation', title: 'AI Powered Timetable Generation', src: '/videos/ai-timetable-generation.mp4', poster: '/images/videos/ai-timetable-generation.webp' },
  { id: 'new-parent-portal', title: 'New Parent Portal', src: '/videos/new-parent-portal.mp4', poster: '/images/videos/new-parent-portal.webp' },
];

export const DEMO_VIDEO_IDS = VIDEOS.map((v) => v.id);
