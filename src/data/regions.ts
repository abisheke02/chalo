import { site } from '@/config/site';

// Regional landing pages for search ("school erp tamil nadu", "school erp
// chennai"). Copy sticks to what the site already states elsewhere; claims about
// Tamil Nadu specific features come from `site.flags` and only appear once the
// company confirms them.

export interface RegionData {
  slug: string;
  name: string; // "Tamil Nadu"
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  // One-sentence answers that search and AI tools can quote directly.
  facts: string[];
  why: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  other: { href: string; label: string };
}

const COMMON_FAQS = [
  { q: 'What does a school ERP do?', a: 'A school ERP puts admissions, fees, attendance, timetables, exams, staff payroll, transport and parent communication in one system, so each piece of data is entered once and every team sees the same record.' },
  { q: 'How is ChaloSchools priced?', a: 'ChaloSchools is priced per student, per year, with no hidden costs and no lock-in. Onboarding, data migration and staff training are included free with every plan.' },
  { q: 'Is our student data secure?', a: 'ChaloSchools is built by an ISO 27001:2022 certified company and in line with India\'s DPDP Act, 2023. Personal data is masked by default, access is role-based, and data is encrypted (AES-256) and backed up daily.' },
];

const FACTS_BASE = [
  `ChaloSchools is a school ERP built by Inspace Edu Solutions in Chennai, used by ${site.schoolsCount} schools and ${site.studentsCount} students.`,
  'It supports State Board, Matriculation, CBSE, IB, Cambridge, Montessori and Pre-School schools.',
  'ChaloSchools is ISO 27001:2022 certified and built in line with India\'s DPDP Act, 2023.',
  'Its AI Secretary answers questions about attendance, fees and admissions in plain language.',
];

export const regions: RegionData[] = [
  {
    slug: 'school-erp-tamil-nadu',
    name: 'Tamil Nadu',
    metaTitle: 'School ERP Software for Tamil Nadu Schools',
    metaDescription: 'School ERP built in Chennai for Tamil Nadu schools: fees, attendance, exams, timetable, payroll, transport and a parent app. 200+ schools. Free demo.',
    eyebrow: 'School ERP · Tamil Nadu',
    h1: 'School ERP software for Tamil Nadu schools',
    intro: `ChaloSchools runs admissions, fees, attendance, timetables, exams, payroll, transport and parent communication from one system. It is built in Chennai by Inspace Edu Solutions and used by ${site.schoolsCount} schools serving ${site.studentsCount} students.`,
    facts: FACTS_BASE,
    why: [
      { title: 'Built in Chennai', text: 'Our team and office are in Chennai, so schools across Tamil Nadu get support from people in the same time zone and state.' },
      { title: 'Every board you run', text: 'State Board, Matriculation and CBSE schools use the same platform, with report card formats for each board.' },
      { title: 'AI timetable', text: 'Build a conflict-free timetable around every teacher and room, and cover absences with one-click substitutions.' },
      { title: 'Parents on WhatsApp and one app', text: 'Notices go by WhatsApp, SMS and voice with read receipts, while the parent app shows attendance, results, fees and bus location.' },
      { title: 'Fees and accounts', text: 'Collect fees online or at the counter, send reminders automatically, and connect with Tally.' },
      { title: 'Free onboarding', text: 'Data migration, setup and staff training are included with every plan.' },
    ],
    faqs: [
      { q: 'Does ChaloSchools support Matriculation and State Board schools?', a: 'Yes. ChaloSchools supports State Board, Matriculation, CBSE, IB, Cambridge, Montessori and Pre-School schools on the same platform.' },
      { q: 'Where is ChaloSchools based?', a: 'ChaloSchools is built by Inspace Edu Solutions Private Limited, with its office in Shenoy Nagar, Chennai, Tamil Nadu.' },
      ...COMMON_FAQS,
    ],
    other: { href: '/school-erp-chennai', label: 'School ERP in Chennai' },
  },
  {
    slug: 'school-erp-chennai',
    name: 'Chennai',
    metaTitle: 'School ERP Software in Chennai',
    metaDescription: 'ChaloSchools is a school ERP built and supported from Chennai: fees, attendance, exams, timetable, payroll, transport and a parent app. Free demo.',
    eyebrow: 'School ERP · Chennai',
    h1: 'School ERP software in Chennai',
    intro: `ChaloSchools is a school ERP built and supported from Chennai. Schools use it to manage admissions, fees, attendance, exams, payroll, transport and parent communication in one place, with a free demo, data migration and staff training from our local team.`,
    facts: [
      'ChaloSchools is a school ERP built by Inspace Edu Solutions Private Limited, headquartered in Chennai (Shenoy Nagar).',
      `It is used by ${site.schoolsCount} schools and ${site.studentsCount} students.`,
      ...FACTS_BASE.slice(1),
    ],
    why: [
      { title: 'A Chennai team', text: 'Book a demo and onboarding with the team that builds the product, based in Chennai.' },
      { title: 'One system, fewer WhatsApp groups', text: 'Replace dozens of parent groups with one official channel, while still reaching parents on WhatsApp, SMS and voice.' },
      { title: 'Live bus tracking', text: 'Track every school bus in real time and notify parents at each stop, which suits Chennai\'s long commutes.' },
      { title: 'Fees with fewer follow-ups', text: 'Automatic reminders and a reconciled ledger, with online payment and Tally integration.' },
      { title: 'AI Secretary', text: 'Ask plain-language questions about attendance, fees and admissions and get answers from your own school data.' },
      { title: 'Free onboarding', text: 'Data migration, setup and staff training are included with every plan.' },
    ],
    faqs: [
      { q: 'Can I see a demo of ChaloSchools in Chennai?', a: 'Yes. Book a demo with our Chennai team and we will walk through ChaloSchools using your school\'s own set-up.' },
      { q: 'Which boards does ChaloSchools support in Chennai?', a: 'State Board, Matriculation, CBSE, IB, Cambridge, Montessori and Pre-School schools are all supported.' },
      ...COMMON_FAQS,
    ],
    other: { href: '/school-erp-tamil-nadu', label: 'School ERP across Tamil Nadu' },
  },
];

export function getRegion(slug: string): RegionData | undefined {
  return regions.find((r) => r.slug === slug);
}

// Tamil Nadu specific features, shown only once the company confirms each one.
export const tamilNaduFeatures = [
  { on: site.flags.emisSupported, text: 'EMIS export and ID matching' },
  { on: site.flags.samacheerFormats, text: 'Samacheer Kalvi report cards and exam patterns' },
  { on: site.flags.tamilMessaging, text: 'Tamil in the parent app, SMS, WhatsApp and circulars' },
  { on: site.flags.rteAdmissions, text: 'RTE admission and seat tracking' },
  { on: site.flags.tamilTcFormats, text: 'Tamil transfer certificate formats' },
].filter((f) => f.on).map((f) => f.text);
