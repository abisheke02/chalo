import { features, solutions, roles } from '@/data/site-data';
import { regions } from '@/data/regions';

// Every public page that can have its meta title and description edited from
// the admin dashboard (Admin > SEO & Meta Tags). The values here are the
// defaults; an edit made in the admin is stored as a site-content row and
// wins over the default. Safe to import from client and server code.

export interface SeoPage {
  path: string;
  group: string;
  label: string;
  title: string; // the browser-tab and Google title, without the " | ChaloSchools" suffix
  description: string;
}

const MAIN: SeoPage[] = [
  { path: '/', group: 'Main pages', label: 'Home', title: 'ChaloSchools - School ERP Software for Indian Schools', description: 'ChaloSchools is a school ERP for admissions, fees, attendance, exams, payroll and transport. Used by 200+ schools. ISO 27001 certified. Book a free demo.' },
  { path: '/product', group: 'Main pages', label: 'Product tour', title: 'School ERP Modules and Product Tour', description: 'Tour all ChaloSchools modules: admissions, fees, attendance, exams, timetable, payroll, transport, parent app and AI Secretary. Book a free demo.' },
  { path: '/pricing', group: 'Main pages', label: 'Pricing', title: 'School ERP Pricing, Per Student Per Year', description: 'ChaloSchools pricing is per student, per year, with no hidden costs or lock-in. Free onboarding, data migration and staff training. Compare the plans.' },
  { path: '/compare', group: 'Main pages', label: 'Compare', title: 'School ERP vs Spreadsheets and WhatsApp', description: 'Compare ChaloSchools with Excel spreadsheets, WhatsApp groups, and generic ERP systems. See why schools choose a purpose-built school management platform.' },
  { path: '/about', group: 'Main pages', label: 'About', title: 'About ChaloSchools, a Chennai School ERP', description: 'ChaloSchools is built by Inspace Edu Solutions in Chennai and used by 200+ schools and 1.5M+ students. An ISO 27001:2022 certified school ERP.' },
  { path: '/contact', group: 'Main pages', label: 'Contact', title: 'Book a Free School ERP Demo', description: 'Book a free ChaloSchools demo, request a callback or talk to our Chennai team. We help schools set up, migrate data and train staff.' },
  { path: '/security', group: 'Main pages', label: 'Security', title: 'School Data Security, DPDP Act, ISO 27001', description: 'How ChaloSchools protects school data: DPDP Act 2023 aligned, data masking, role-based access, AES-256 encryption, ISO 27001:2022 certified.' },
  { path: '/platform-capabilities', group: 'Main pages', label: 'Platform capabilities', title: 'AI Features for School Management', description: '20+ AI-powered capabilities in ChaloSchools, from AI Rephrase and Voice Broadcast to KYP verification and enterprise cloud infrastructure.' },
  { path: '/managed-it-services', group: 'Main pages', label: 'Managed IT services', title: 'Managed IT Services for Schools', description: 'Managed IT infrastructure, cybersecurity audit, network design, compliance advisory and 24/7 helpdesk for schools, from Inspace Technologies.' },
];

const REGIONAL: SeoPage[] = regions.map((r) => ({ path: `/${r.slug}`, group: 'Search landing pages', label: r.metaTitle, title: r.metaTitle, description: r.metaDescription }));

const OTHER: SeoPage[] = [
  { path: '/blog', group: 'Resources and company', label: 'Blog', title: 'Blog & Insights', description: 'Stay updated with the latest trends in school management, education technology, and best practices from ChaloSchools.' },
  { path: '/case-studies', group: 'Resources and company', label: 'Case studies', title: 'Case Studies', description: 'See how schools across India transform their operations with ChaloSchools. Real stories, real results from CBSE, ICSE, and state board schools.' },
  { path: '/news', group: 'Resources and company', label: 'News and events', title: 'News & Events', description: 'Latest news, events, and updates from ChaloSchools. Stay informed about product launches, school partnerships, and education industry events.' },
  { path: '/webinars', group: 'Resources and company', label: 'Webinars', title: 'Webinars', description: 'Watch on-demand webinars about school management best practices, education technology, and upcoming sessions from ChaloSchools.' },
  { path: '/help', group: 'Resources and company', label: 'Help and documentation', title: 'Help & Documentation', description: 'Find guides, tutorials, and documentation to help you get the most out of ChaloSchools school management system.' },
  { path: '/release-notes', group: 'Resources and company', label: 'Release notes', title: 'Release Notes', description: "See what's new in ChaloSchools. Browse release notes for the latest features, improvements, and bug fixes." },
  { path: '/careers', group: 'Resources and company', label: 'Careers', title: 'Careers', description: 'Join the ChaloSchools team and help transform Indian schools with technology. Explore open positions in engineering, sales, product, and more.' },
  { path: '/privacy', group: 'Resources and company', label: 'Privacy policy', title: 'Privacy Policy', description: 'Learn how ChaloSchools collects, uses, and protects your personal information. We are committed to safeguarding the privacy of our users.' },
  { path: '/terms', group: 'Resources and company', label: 'Terms of service', title: 'Terms of Service', description: 'Read the Terms of Service for ChaloSchools. These terms govern your use of our website and services.' },
];

// Shorter meta descriptions for pages whose built-in description is over 160 characters.
// Only the Google text changes; the description shown on the page itself is untouched.
const META_DESCRIPTIONS: Record<string, string> = {
  '/features/parent-app': 'One app for parents and students: attendance, marks, fees, homework, bus tracking and teacher chat. Replace dozens of WhatsApp groups with one channel.',
  '/features/reports': 'Ready-made and custom reports across academics, finance, HR and operations, with live dashboards that help school leaders decide faster.',
  '/solutions/pre-school': 'A simple, parent-friendly ERP for play schools and pre-primary: daily activity and milestone tracking, photo and video updates, and term-based billing.',
  '/solutions/state-cbse': 'ERP for State Board and CBSE schools: compliant report card formats, term and unit-test exams, and board compliance, built for large enrolments.',
  '/solutions/ib': 'ERP for IB PYP, MYP and DP schools: custom assessment and narrative reports, unit planning, and flexible timetabling for subject blocks and electives.',
  '/solutions/cambridge': 'ERP for Cambridge IGCSE, O-Level and A-Level schools: stage-wise tracking, Cambridge report cards and grading scales, and international fee support.',
  '/solutions/montessori': 'A Montessori-aligned ERP: track activity and material-based progress, record individual learning plans and share developmental milestones with parents.',
  '/solutions/matric': 'ERP for Matriculation and higher-secondary schools: stream-wise classes, board exam readiness tracking, and higher-secondary timetabling and electives.',
  '/solutions/role/school-owners': 'See every school operation from one dashboard, so you can grow with confidence and rely less on manual reporting.',
  '/solutions/role/administrators': 'Handle admissions, front-office enquiries and daily school administration from one dashboard, without digging through registers and spreadsheets.',
  '/solutions/role/coordinator': 'Coordinate timetables, exams and academic schedules across departments without conflicts, with AI scheduling that adjusts when something changes.',
};

const FEATURES: SeoPage[] = features.map((f) => ({ path: `/features/${f.slug}`, group: 'Module and feature pages', label: f.title, title: f.seoTitle ?? f.title, description: f.seoTitle ? f.description : (META_DESCRIPTIONS[`/features/${f.slug}`] ?? f.description) }));
const BOARDS: SeoPage[] = solutions.map((s) => ({ path: `/solutions/${s.slug}`, group: 'Board pages', label: s.boardName, title: `${s.boardName} Solution`, description: META_DESCRIPTIONS[`/solutions/${s.slug}`] ?? s.description }));
const ROLES: SeoPage[] = roles.map((r) => ({ path: `/solutions/role/${r.slug}`, group: 'Role pages', label: r.roleName, title: `ChaloSchools for ${r.roleName}`, description: META_DESCRIPTIONS[`/solutions/role/${r.slug}`] ?? r.description }));

export const SEO_PAGES: SeoPage[] = [...MAIN, ...REGIONAL, ...FEATURES, ...BOARDS, ...ROLES, ...OTHER];

export function getSeoDefaults(path: string): SeoPage | undefined {
  return SEO_PAGES.find((p) => p.path === path);
}

export { decodeEntities } from '@/lib/text';

// The key under which an edit is stored in the site-content table.
export function seoKey(path: string, kind: 'title' | 'desc'): string {
  const slug = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-');
  return `seo_${kind}_${slug}`;
}

// Pages other than the home page get " | ChaloSchools" added after the title.
export const BRAND_SUFFIX = ' | ChaloSchools';
export function fullTitle(path: string, title: string): string {
  return path === '/' ? title : `${title}${BRAND_SUFFIX}`;
}
