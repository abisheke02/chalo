// Extra text for each "By board" page: what that kind of school needs, how the modules meet it, and common questions.
// Only things the product does are described (see the feature lists in site-data.ts). No numbers or customer claims.

export interface BoardContent {
  intro: string;
  needs: { title: string; text: string; moduleId: string }[];
  faqs: { q: string; a: string }[];
}

export const BOARD_CONTENT: Record<string, BoardContent> = {
  'pre-school': {
    intro:
      'A pre-school day is about play, routine and trust. ChaloSchools keeps the paperwork light: check children in and out, record daily activities and milestones, and share photos and updates with parents, with fees billed by term and no exam or grading software to learn.',
    needs: [],
    faqs: [
      { q: 'Do parents see photos and videos?', a: 'Yes. Teachers can share photo and video updates, and parents see them in the Parent App.' },
      { q: 'Is there exam or grading software we do not need?', a: 'No. Pre-school pages keep things simple, with no complex exam or grading, only activities, milestones and progress reports.' },
      { q: 'Can we bill by term?', a: 'Yes. Fees can be billed by term, with receipts for each payment.' },
    ],
  },
  ib: {
    intro:
      'IB schools assess learners in ways a marks-only system cannot hold: narrative comments, criteria-based grades, units of inquiry, the Extended Essay and CAS. ChaloSchools lets you set up your own report formats and track programmes from PYP to DP in one place.',
    needs: [
      { title: 'Report cards that fit your programme', text: 'Set up narrative and criteria-based formats for PYP, MYP and DP, so report cards look the way your school issues them.', moduleId: 'exams' },
      { title: 'Timetables with blocks and electives', text: 'Build timetables around subject groups, electives and higher and standard level choices without clashes.', moduleId: 'timetable' },
      { title: 'Parent communication', text: 'Keep families informed through the school\'s own channels, in the language they use.', moduleId: 'communication' },
      { title: 'One record for each learner', text: 'Keep assessment, attendance and documents together, from admission to graduation.', moduleId: 'student' },
    ],
    faqs: [
      { q: 'Can we use our own report card format?', a: 'Yes. Report card formats are set up for your school, including narrative and criteria-based layouts.' },
      { q: 'Does it cover PYP, MYP and DP?', a: 'Yes. Tracking and report formats can be set up for each programme your school runs.' },
      { q: 'Can parents get communication in more than one language?', a: 'Multi-language parent communication is supported. Tell us which languages you need during the demo.' },
    ],
  },
  cambridge: {
    intro:
      'Cambridge schools work in stages and checkpoints, issue reports on Cambridge grading scales, and often serve families who pay in more than one currency. ChaloSchools follows the stage structure and gives the finance team the billing flexibility they need.',
    needs: [
      { title: 'Stage-wise tracking', text: 'Follow each learner through Primary, Lower Secondary and Upper Secondary, with progress and predicted grades.', moduleId: 'exams' },
      { title: 'Subject-wise timetables', text: 'Plan teachers and periods around subject choices for IGCSE, O-Level and A-Level.', moduleId: 'timetable' },
      { title: 'International billing', text: 'Support fee currencies and billing that match international families.', moduleId: 'fees' },
      { title: 'Management view', text: 'Compare performance across stages and years in one dashboard.', moduleId: 'performance-insights' },
    ],
    faqs: [
      { q: 'Does it support Cambridge grading scales?', a: 'Yes. Report cards and grading scales can follow the Cambridge format your school uses.' },
      { q: 'Can we bill in a currency other than rupees?', a: 'Fee currency and billing for international families is supported.' },
      { q: 'Can we track checkpoint results?', a: 'Yes. Checkpoint assessments are recorded and reported with the rest of a learner\'s results.' },
    ],
  },
  montessori: {
    intro:
      'A Montessori classroom is built on observation and individual progress, not on marks and ranks. ChaloSchools records activities and materials, keeps an individual learning plan for each child, and shares developmental milestones with parents.',
    needs: [
      { title: 'Observation, not only marks', text: 'Record activities, materials and observations as the way progress is shown.', moduleId: 'student' },
      { title: 'Individual learning plans', text: 'Document each child\'s plan and review it as they develop.', moduleId: 'student' },
      { title: 'Flexible days', text: 'Plan work cycles and mixed-age groups without forcing a fixed period structure.', moduleId: 'timetable' },
      { title: 'Milestone updates for parents', text: 'Share what a child has achieved, in the Parent App, instead of a grade.', moduleId: 'parent-app' },
    ],
    faqs: [
      { q: 'Can we manage mixed-age groups?', a: 'Yes. Mixed-age groups can be set up and managed as a class.' },
      { q: 'Do we have to use marks?', a: 'No. Progress can be recorded through activities and observations, and shared as milestones.' },
      { q: 'Can parents see their child\'s progress?', a: 'Yes. Parents see the updates your teachers choose to share in the Parent App.' },
    ],
  },
  'state-cbse': {
    intro:
      'State board and CBSE schools handle the heaviest administration: large admissions, many classes, board-format report cards and government reporting. ChaloSchools keeps all of it in one system so staff spend their time on students, not on registers.',
    needs: [
      { title: 'Admissions at scale', text: 'Run enquiries, applications and enrolment for large intakes without paper.', moduleId: 'admissions' },
      { title: 'Board-format results', text: 'Prepare report cards and results in the format your board expects.', moduleId: 'exams' },
      { title: 'Fees and dues', text: 'Collect fees, follow up on dues and issue receipts through one ledger.', moduleId: 'fees' },
      { title: 'Parent communication', text: 'Send circulars and alerts to every parent by WhatsApp, SMS or voice.', moduleId: 'communication' },
    ],
    faqs: [
      { q: 'Does it support our board\'s report card format?', a: 'Report cards can be set up in the format your board requires. Tell us your board and we will confirm during the demo.' },
      { q: 'Can it handle a large school?', a: 'ChaloSchools is built for schools of different sizes, and for groups with several branches.' },
      { q: 'Can we move our existing records in?', a: 'Yes. Migration and training are part of onboarding.' },
    ],
  },
  matric: {
    intro:
      'Matriculation and higher-secondary schools divide students into streams, prepare them for board examinations and follow them on to higher education. ChaloSchools manages the streams, the electives and the exam preparation in one place.',
    needs: [
      { title: 'Streams and sections', text: 'Manage Science, Commerce and Arts classes and sections with their own subjects.', moduleId: 'student' },
      { title: 'Electives in the timetable', text: 'Build timetables that handle higher-secondary subjects and electives.', moduleId: 'timetable' },
      { title: 'Board exam readiness', text: 'Track internal assessments and results as students prepare for board examinations.', moduleId: 'exams' },
      { title: 'Compliance reports', text: 'Produce the reports your school has to submit without rebuilding them by hand.', moduleId: 'reports' },
    ],
    faqs: [
      { q: 'Can we manage Science, Commerce and Arts streams?', a: 'Yes. Streams, sections and their subjects can be set up separately.' },
      { q: 'Does it track internal assessments?', a: 'Yes. Internal assessments and results are recorded and reported with the rest of the academic record.' },
      { q: 'Can alumni be tracked?', a: 'The solution includes alumni and higher-education transition tracking. Ask us in the demo how your school would use it.' },
    ],
  },
};
