// Applies the revised homepage copy to the admin-editable SiteContent rows.
// Those rows override the defaults in the code, so the new wording only shows
// once they're updated. Only existing keys are changed; nothing is created.
//
//   Local DB:      node scripts/apply-homepage-copy.mjs
//   Live (Turso):  TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... node scripts/apply-homepage-copy.mjs

import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const COPY = {
  problems_badge: 'The Challenge',
  problems_headline: 'Manual Processes Hold Schools Back',
  problems_subtitle: 'Four common problems, each solved by a dedicated module.',
  problem_1_title: 'Manual Fee Follow-ups',
  problem_1_desc: 'Reminders are tracked by hand and collections fall behind.',
  problem_2_title: 'Scattered Records',
  problem_2_desc: 'Attendance and marks sit in registers and spreadsheets.',
  problem_3_title: 'Fragmented Communication',
  problem_3_desc: 'Important updates are lost across dozens of WhatsApp groups.',
  problem_4_title: 'No Management Overview',
  problem_4_desc: 'Leadership lacks a real-time view of admissions, finance and academics.',
  features_badge: 'Modules',
  features_headline: '14 Modules. One Platform.',
  features_subtitle: 'Eight core modules and six add-ons, fully integrated from day one.',
  why_choose_badge: 'Why ChaloSchools',
  why_choose_headline: 'Built for Schools That Expect More',
  why_choose_subtitle: 'What sets us apart from generic ERP software.',
  why_choose_1_title: 'All-in-One Platform',
  why_choose_1_desc: 'Every school function managed from a single dashboard.',
  why_choose_2_title: 'Onboarding and Training',
  why_choose_2_desc: 'We handle setup, data migration and staff training.',
  why_choose_3_title: 'Built for Indian Schools',
  why_choose_3_desc: 'Designed around CBSE, State, IB and Cambridge requirements.',
  process_badge: 'Getting Started',
  process_headline: 'Live in Three Steps',
  process_subtitle: 'A structured onboarding, managed by our team.',
  process_step_1_title: 'Book a Demo',
  process_step_1_desc: 'A tailored walkthrough for your school.',
  process_step_2_title: 'Setup and Migration',
  process_step_2_desc: 'We configure the system and migrate your data.',
  process_step_3_title: 'Go Live',
  process_step_3_desc: 'Staff training and ongoing support included.',
  contact_hero_title: 'Speak to Our Team',
  contact_hero_subtitle: 'Questions, demos or support. We respond within one business day.',
};

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const db = tursoUrl
  ? new PrismaClient({ adapter: new PrismaLibSQL({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN?.trim() }) })
  : new PrismaClient();

let changed = 0;
for (const [key, value] of Object.entries(COPY)) {
  const { count } = await db.siteContent.updateMany({ where: { key }, data: { value } });
  changed += count;
}
console.log(`Updated ${changed} of ${Object.keys(COPY).length} keys (missing keys fall back to the code defaults).`);
await db.$disconnect();
