import { MODULE_CONTENT } from '@/data/module-content';
import SchoolYearJourney, { type JourneyCard } from './SchoolYearJourney';

// Four stages of the school year, each told through one module. Words come from the module content;
// the badges are examples of messages and updates the system produces.
const STAGES: { slug: string; stage: string; title: string; badges: string[] }[] = [
  { slug: 'admissions', stage: 'Admissions', title: 'Enquiries become enrolments', badges: ['Enquiry received', 'Documents verified', 'Seat confirmed'] },
  { slug: 'attendance', stage: 'Every day', title: 'Attendance in seconds', badges: ['Attendance marked: Class 8B', 'Absence alert sent to parent'] },
  { slug: 'fees', stage: 'Every term', title: 'Fees collected on time', badges: ['Fee paid: ₹12,500', 'Receipt sent on WhatsApp', 'Reminder sent to 38 parents'] },
  { slug: 'exams', stage: 'Year end', title: 'Results without the rush', badges: ['Marks entered: Class 10', 'Report cards generated', 'Published to the parent app'] },
];

export default function SchoolYearJourneySection() {
  const cards: JourneyCard[] = STAGES.flatMap((s) => {
    const c = MODULE_CONTENT[s.slug];
    if (!c) return [];
    return [{ slug: s.slug, stage: s.stage, title: s.title, text: c.purpose, points: c.seeInside.slice(0, 3), badges: s.badges }];
  });
  return <SchoolYearJourney cards={cards} />;
}
