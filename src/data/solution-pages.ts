// The text for the Solutions pages (By board and By role). They share one layout (components/SolutionTemplate.tsx):
// a headline, the page's own feature list (from site-data.ts), a panel of the modules it uses and a three-step workflow.
// Only things the product does are described (see module-features.ts and site-data.ts). No numbers or customer claims.

export type SolutionIcon =
  | 'BookOpen' | 'FileText' | 'ClipboardCheck' | 'CalendarDays' | 'TrendingUp' | 'MessageCircle' | 'Layers' | 'Globe' | 'Wallet'
  | 'Users' | 'Bus' | 'ShieldCheck' | 'GraduationCap' | 'Building2' | 'BarChart3' | 'Bot' | 'Smartphone' | 'Landmark' | 'Shapes'
  | 'School' | 'Award' | 'Heart' | 'Calculator' | 'UserCog' | 'Presentation' | 'Network' | 'ClipboardList' | 'Sprout' | 'UserPlus'
  | 'IndianRupee' | 'Map' | 'Bell' | 'Eye' | 'Smile' | 'Target';

export interface SolutionRow {
  icon: SolutionIcon;
  title: string;
  text: string;
  moduleId?: string; // links to that module on the product page
}
export interface SolutionStep {
  icon: SolutionIcon;
  title: string;
  text: string;
}
export interface SolutionPage {
  listTitle: string;
  rows: SolutionRow[];
  glance: { icon: SolutionIcon; title: string; text: string }[];
  workflowTitle: string;
  workflowSub: string;
  steps: SolutionStep[];
}

export const SOLUTION_PAGES: Record<string, SolutionPage> = {
  // ---------- By board: the rows are each page's own feature list ----------
  'pre-school': {
    listTitle: 'Everything a pre-school needs',
    rows: [
      { icon: 'Sprout', title: 'Simplified daily activity and milestone tracking', text: 'Record the day\'s activities and each child\'s milestones in a few taps.', moduleId: 'student' },
      { icon: 'Smartphone', title: 'Parent app with photo and video updates', text: 'Parents see what their child did today, with photos and videos from the teacher.', moduleId: 'parent-app' },
      { icon: 'IndianRupee', title: 'Easy fee collection for term-based billing', text: 'Bill by term and collect fees with receipts, online or at the counter.', moduleId: 'fees' },
      { icon: 'Smile', title: 'Kept simple for early learning', text: 'No complex exam or grading, only what early years need.', moduleId: 'exams' },
      { icon: 'ClipboardCheck', title: 'Attendance with check-in and check-out', text: 'Know who arrived, and who left with whom.', moduleId: 'attendance' },
      { icon: 'TrendingUp', title: 'Progress and development reports', text: 'Share a clear picture of each child\'s development with parents.', moduleId: 'reports' },
    ],
    glance: [
      { icon: 'Smartphone', title: 'Parent and Student App', text: 'Daily updates, photos and fees in one place.' },
      { icon: 'ClipboardCheck', title: 'Attendance', text: 'Check-in and check-out for every child.' },
      { icon: 'IndianRupee', title: 'Fee Management', text: 'Term-based billing and receipts.' },
    ],
    workflowTitle: 'How a pre-school runs on ChaloSchools',
    workflowSub: 'From arrival to the evening update.',
    steps: [
      { icon: 'ClipboardCheck', title: 'Check children in', text: 'Record arrival and, later, pickup.' },
      { icon: 'Sprout', title: 'Record the day', text: 'Activities and milestones as they happen.' },
      { icon: 'Smartphone', title: 'Update parents', text: 'Share photos, videos and progress.' },
    ],
  },
  'state-cbse': {
    listTitle: 'Everything a CBSE or State Board school needs',
    rows: [
      { icon: 'FileText', title: 'CBSE and State Board report card formats', text: 'Report cards in the format your board requires.', moduleId: 'exams' },
      { icon: 'ClipboardCheck', title: 'Term and unit-test exam management', text: 'Plan term exams and unit tests, enter marks and publish results.', moduleId: 'exams' },
      { icon: 'ShieldCheck', title: 'Board-mandated compliance and documents', text: 'Keep the records and documents your board requires in one place.', moduleId: 'reports' },
      { icon: 'UserPlus', title: 'Bulk admission handling', text: 'Run large intakes for high-enrolment schools without paper.', moduleId: 'admissions' },
      { icon: 'Award', title: 'TC and transfer certificate generation', text: 'Generate transfer certificates from the student record.', moduleId: 'student' },
      { icon: 'BarChart3', title: 'Scholastic and co-scholastic tracking', text: 'Record academic and co-curricular progress side by side.', moduleId: 'exams' },
    ],
    glance: [
      { icon: 'FileText', title: 'Academic and Examination', text: 'Board-format results and report cards.' },
      { icon: 'UserPlus', title: 'Admissions', text: 'Bulk intake without paper.' },
      { icon: 'GraduationCap', title: 'Student Management', text: 'Records and transfer certificates.' },
    ],
    workflowTitle: 'How a board school runs on ChaloSchools',
    workflowSub: 'From admission to the board-format report card.',
    steps: [
      { icon: 'UserPlus', title: 'Admit', text: 'Take admissions in bulk and verify documents.' },
      { icon: 'ClipboardCheck', title: 'Examine', text: 'Run term exams and unit tests.' },
      { icon: 'FileText', title: 'Report', text: 'Issue report cards and certificates.' },
    ],
  },
  ib: {
    listTitle: 'Everything an IB school needs',
    rows: [
      { icon: 'FileText', title: 'Custom assessment and narrative report card formats', text: 'Set up report cards the way your school issues them.', moduleId: 'exams' },
      { icon: 'BookOpen', title: 'Unit planner and PYP, MYP and DP-aligned tracking', text: 'Plan units and follow each programme in one place.', moduleId: 'student' },
      { icon: 'Globe', title: 'Multi-language parent communication', text: 'Reach families in more than one language.', moduleId: 'communication' },
      { icon: 'CalendarDays', title: 'Flexible timetabling for subject blocks and electives', text: 'Build timetables around subject groups and elective choices.', moduleId: 'timetable' },
      { icon: 'TrendingUp', title: 'Extended Essay and CAS tracking', text: 'Follow the Extended Essay and CAS requirements for each student.', moduleId: 'student' },
      { icon: 'ClipboardCheck', title: 'Internal assessment management', text: 'Record and manage internal assessments alongside everyday progress.', moduleId: 'exams' },
    ],
    glance: [
      { icon: 'FileText', title: 'Academic and Examination', text: 'Assessment and report cards.' },
      { icon: 'CalendarDays', title: 'AI Timetable and Scheduling', text: 'Subject blocks and electives.' },
      { icon: 'MessageCircle', title: 'Communication', text: 'Notices to parents in their language.' },
    ],
    workflowTitle: 'How an IB school runs on ChaloSchools',
    workflowSub: 'Plan the programme, assess, then report.',
    steps: [
      { icon: 'BookOpen', title: 'Plan', text: 'Set up programmes, units and subject blocks.' },
      { icon: 'ClipboardCheck', title: 'Assess', text: 'Record assessments, Extended Essay and CAS progress.' },
      { icon: 'FileText', title: 'Report', text: 'Issue narrative reports and inform parents.' },
    ],
  },
  cambridge: {
    listTitle: 'Everything a Cambridge school needs',
    rows: [
      { icon: 'Layers', title: 'Stage-wise tracking: Primary, Lower and Upper Secondary', text: 'Follow each learner through the Cambridge stages.', moduleId: 'student' },
      { icon: 'FileText', title: 'Cambridge-format report cards and grading scales', text: 'Issue reports on the grading scales your school uses.', moduleId: 'exams' },
      { icon: 'CalendarDays', title: 'Subject-wise teacher and timetable management', text: 'Plan teachers and periods around subject choices.', moduleId: 'timetable' },
      { icon: 'Globe', title: 'International fee currency and billing', text: 'Bill international families in the right currency.', moduleId: 'fees' },
      { icon: 'ClipboardCheck', title: 'Checkpoint assessment management', text: 'Record checkpoint assessments with the rest of a learner\'s results.', moduleId: 'exams' },
      { icon: 'TrendingUp', title: 'Progress and predicted grades', text: 'Track progress towards predicted grades.', moduleId: 'performance-insights' },
    ],
    glance: [
      { icon: 'FileText', title: 'Academic and Examination', text: 'Cambridge-format reports.' },
      { icon: 'IndianRupee', title: 'Fee Management', text: 'International billing.' },
      { icon: 'BarChart3', title: 'Performance Insights', text: 'Progress and predicted grades.' },
    ],
    workflowTitle: 'How a Cambridge school runs on ChaloSchools',
    workflowSub: 'Teach by stage, assess at checkpoints, report on Cambridge scales.',
    steps: [
      { icon: 'Layers', title: 'Set up stages', text: 'Subjects, teachers and timetables by stage.' },
      { icon: 'ClipboardCheck', title: 'Assess', text: 'Record checkpoints and results.' },
      { icon: 'FileText', title: 'Report', text: 'Issue reports and predicted grades.' },
    ],
  },
  montessori: {
    listTitle: 'Everything a Montessori school needs',
    rows: [
      { icon: 'Sprout', title: 'Activity and material-based progress tracking', text: 'Show progress through activities and materials, not only marks.', moduleId: 'student' },
      { icon: 'FileText', title: 'Individual learning plan for each child', text: 'Document each child\'s plan and review it as they develop.', moduleId: 'student' },
      { icon: 'Smile', title: 'Parent updates on developmental milestones', text: 'Share milestones with parents in the Parent App.', moduleId: 'parent-app' },
      { icon: 'CalendarDays', title: 'Flexible, non-traditional timetables', text: 'Plan work cycles without fixed periods.', moduleId: 'timetable' },
      { icon: 'Users', title: 'Mixed-age group management', text: 'Set up and manage classes that span more than one age.', moduleId: 'student' },
      { icon: 'Eye', title: 'Observational assessment', text: 'Record observations as the basis of assessment.', moduleId: 'exams' },
    ],
    glance: [
      { icon: 'GraduationCap', title: 'Student Management', text: 'Learning plans and mixed-age groups.' },
      { icon: 'Smartphone', title: 'Parent and Student App', text: 'Milestone updates for parents.' },
      { icon: 'CalendarDays', title: 'AI Timetable and Scheduling', text: 'Flexible days.' },
    ],
    workflowTitle: 'How a Montessori school runs on ChaloSchools',
    workflowSub: 'Observe, plan, share.',
    steps: [
      { icon: 'Eye', title: 'Observe', text: 'Record activities and observations.' },
      { icon: 'FileText', title: 'Plan', text: 'Keep each child\'s learning plan current.' },
      { icon: 'Smile', title: 'Share', text: 'Send milestone updates to parents.' },
    ],
  },
  matric: {
    listTitle: 'Everything a Matric or higher-secondary school needs',
    rows: [
      { icon: 'Layers', title: 'Stream-wise class and section management', text: 'Manage Science, Commerce and Arts classes and sections.', moduleId: 'student' },
      { icon: 'ClipboardCheck', title: 'Board exam readiness and internal assessments', text: 'Track internal assessments as students prepare for board exams.', moduleId: 'exams' },
      { icon: 'CalendarDays', title: 'Higher-secondary timetable and elective handling', text: 'Build timetables that handle electives.', moduleId: 'timetable' },
      { icon: 'Award', title: 'Alumni and higher-education transition tracking', text: 'Follow students on to higher education.', moduleId: 'student' },
      { icon: 'BookOpen', title: 'Semester and credit management', text: 'Manage semesters and credits where your programme uses them.', moduleId: 'exams' },
      { icon: 'FileText', title: 'Compliance reporting', text: 'Produce the reports your school has to submit.', moduleId: 'reports' },
    ],
    glance: [
      { icon: 'GraduationCap', title: 'Student Management', text: 'Streams, sections and alumni.' },
      { icon: 'FileText', title: 'Academic and Examination', text: 'Internal assessments and board readiness.' },
      { icon: 'BarChart3', title: 'Reports', text: 'Compliance reporting.' },
    ],
    workflowTitle: 'How a Matric school runs on ChaloSchools',
    workflowSub: 'From stream selection to board exams and beyond.',
    steps: [
      { icon: 'Layers', title: 'Set up streams', text: 'Classes, sections and electives.' },
      { icon: 'ClipboardCheck', title: 'Assess', text: 'Internal assessments through the year.' },
      { icon: 'Award', title: 'Prepare and follow on', text: 'Board readiness, then alumni tracking.' },
    ],
  },

  // ---------- By role: the rows are each page's own points ----------
  'school-owners': {
    listTitle: 'Everything a school owner needs',
    rows: [
      { icon: 'Eye', title: 'Consolidated dashboard across admissions, fees, academics and staff', text: 'See the whole school in one place.', moduleId: 'reports' },
      { icon: 'Building2', title: 'Multi-branch management for school groups and trusts', text: 'Look at each branch, or the whole group, from one account.' },
      { icon: 'TrendingUp', title: 'ROI and growth analytics', text: 'See trends across the school to guide decisions.', moduleId: 'performance-insights' },
      { icon: 'ClipboardCheck', title: 'Reduced dependency on manual reporting from staff', text: 'Get figures when you need them, without waiting for a report.', moduleId: 'reports' },
    ],
    glance: [
      { icon: 'BarChart3', title: 'Reports', text: 'The same figures for owners and principals.' },
      { icon: 'TrendingUp', title: 'Performance Insights', text: 'Trends across the school.' },
      { icon: 'Bot', title: 'AI Secretary', text: 'Ask questions in plain language.' },
    ],
    workflowTitle: 'How an owner uses ChaloSchools',
    workflowSub: 'Check, ask, decide.',
    steps: [
      { icon: 'Eye', title: 'Check', text: 'Open the dashboard to see the school today.' },
      { icon: 'Bot', title: 'Ask', text: 'Use the AI Secretary instead of a spreadsheet.' },
      { icon: 'Target', title: 'Decide', text: 'Review insights before meetings.' },
    ],
  },
  principals: {
    listTitle: 'Everything a principal needs',
    rows: [
      { icon: 'ClipboardCheck', title: 'Real-time academic and attendance oversight', text: 'See attendance and results as they happen.', moduleId: 'attendance' },
      { icon: 'UserCog', title: 'Staff performance and leave management at a glance', text: 'See who is on leave and how staff are doing.', moduleId: 'staff' },
      { icon: 'ShieldCheck', title: 'Quick approvals for circulars, leave and admissions', text: 'Approve requests from one place.', moduleId: 'admissions' },
      { icon: 'MessageCircle', title: 'Parent communication oversight', text: 'See what is sent to parents, and to whom.', moduleId: 'communication' },
    ],
    glance: [
      { icon: 'ClipboardCheck', title: 'Attendance', text: 'Daily attendance and absences.' },
      { icon: 'Users', title: 'Staff Management', text: 'Leave and performance.' },
      { icon: 'MessageCircle', title: 'Communication', text: 'Notices to parents.' },
    ],
    workflowTitle: 'How a principal uses ChaloSchools',
    workflowSub: 'Check, approve, communicate.',
    steps: [
      { icon: 'ClipboardCheck', title: 'Check', text: 'Attendance and academics for the day.' },
      { icon: 'ShieldCheck', title: 'Approve', text: 'Circulars, leave and admissions.' },
      { icon: 'MessageCircle', title: 'Communicate', text: 'Keep parents informed.' },
    ],
  },
  teachers: {
    listTitle: 'Everything a teacher needs',
    rows: [
      { icon: 'ClipboardCheck', title: 'Quick attendance marking via app', text: 'Mark attendance in one tap from the Teachers App.', moduleId: 'attendance' },
      { icon: 'FileText', title: 'Simplified marks and assignment entry', text: 'Enter marks once, and they flow to the report card.', moduleId: 'exams' },
      { icon: 'MessageCircle', title: 'Direct messaging with parents', text: 'Share notes and homework from the school account.', moduleId: 'communication' },
      { icon: 'CalendarDays', title: 'Auto-generated timetables and substitution alerts', text: 'See your periods and any change straight away.', moduleId: 'timetable' },
    ],
    glance: [
      { icon: 'ClipboardCheck', title: 'Attendance', text: 'One tap for a full class.' },
      { icon: 'FileText', title: 'Academic and Examination', text: 'Marks entered once.' },
      { icon: 'CalendarDays', title: 'AI Timetable and Scheduling', text: 'Periods and substitutions.' },
    ],
    workflowTitle: 'How a teacher uses ChaloSchools',
    workflowSub: 'Less paperwork, more teaching.',
    steps: [
      { icon: 'CalendarDays', title: 'See your day', text: 'Periods, classes and changes.' },
      { icon: 'ClipboardCheck', title: 'Mark attendance', text: 'In one tap.' },
      { icon: 'FileText', title: 'Enter marks', text: 'Once, after each test.' },
    ],
  },
  parents: {
    listTitle: 'Everything a parent needs',
    rows: [
      { icon: 'Bell', title: 'Real-time attendance and academic updates', text: 'Know when your child is absent and see results as they are published.', moduleId: 'parent-app' },
      { icon: 'IndianRupee', title: 'Online fee payment, no more queues', text: 'See dues, pay online and keep every receipt.', moduleId: 'fees' },
      { icon: 'MessageCircle', title: 'Direct communication with teachers', text: 'Get notices and messages in one place.', moduleId: 'communication' },
      { icon: 'Bus', title: 'Bus tracking and safety notifications', text: 'Follow the school bus and get pickup alerts.', moduleId: 'transport' },
    ],
    glance: [
      { icon: 'Smartphone', title: 'Parent and Student App', text: 'Everything in one app.' },
      { icon: 'IndianRupee', title: 'Fee Management', text: 'Pay online with receipts.' },
      { icon: 'Bus', title: 'Transport Management', text: 'Bus location and alerts.' },
    ],
    workflowTitle: 'How a parent uses ChaloSchools',
    workflowSub: 'Know what is happening, without calling the office.',
    steps: [
      { icon: 'Bell', title: 'Get updates', text: 'Attendance and bus alerts.' },
      { icon: 'IndianRupee', title: 'Pay fees', text: 'Online, with a receipt.' },
      { icon: 'FileText', title: 'See progress', text: 'Results and notices.' },
    ],
  },
  accountants: {
    listTitle: 'Everything an accountant needs',
    rows: [
      { icon: 'IndianRupee', title: 'Automated fee collection and receipt generation', text: 'Record every payment once and issue the receipt.', moduleId: 'fees' },
      { icon: 'Bell', title: 'Real-time defaulter and collection reports', text: 'See who owes what, and send reminders.', moduleId: 'fees' },
      { icon: 'FileText', title: 'Audit-ready financial statements', text: 'Pull reports for audits from the same ledger.', moduleId: 'reports' },
      { icon: 'Wallet', title: 'Easy reconciliation across payment modes', text: 'Online and counter payments, reconciled together.', moduleId: 'fees' },
    ],
    glance: [
      { icon: 'IndianRupee', title: 'Fee Management', text: 'Collection, dues and receipts.' },
      { icon: 'Wallet', title: 'Payroll Management', text: 'Salaries, PF, ESI and TDS.' },
      { icon: 'BarChart3', title: 'Reports', text: 'Collection and dues for audits.' },
    ],
    workflowTitle: 'How an accountant uses ChaloSchools',
    workflowSub: 'Collect, reconcile, report.',
    steps: [
      { icon: 'IndianRupee', title: 'Collect', text: 'Counter and online, one ledger.' },
      { icon: 'Bell', title: 'Follow up', text: 'Defaulters listed, reminders sent.' },
      { icon: 'BarChart3', title: 'Report', text: 'Collection and dues reports.' },
    ],
  },
  administrators: {
    listTitle: 'Everything an administrator needs',
    rows: [
      { icon: 'Building2', title: 'Centralized front office and visitor management', text: 'Handle front-office requests from one dashboard.', moduleId: 'admissions' },
      { icon: 'UserPlus', title: 'Digital admissions processing, from enquiry to enrolment', text: 'Follow every enquiry through to admission.', moduleId: 'admissions' },
      { icon: 'FileText', title: 'Document verification and digital record-keeping', text: 'Upload, verify and keep documents with the student record.', moduleId: 'student' },
      { icon: 'Network', title: 'Cross-department coordination without endless phone calls', text: 'Find what you need without calling three departments.', moduleId: 'staff' },
    ],
    glance: [
      { icon: 'UserPlus', title: 'Admissions', text: 'Enquiry to enrolment.' },
      { icon: 'GraduationCap', title: 'Student Management', text: 'Records and documents.' },
      { icon: 'UserCog', title: 'Staff Management', text: 'Roles and permissions.' },
    ],
    workflowTitle: 'How an administrator uses ChaloSchools',
    workflowSub: 'From enquiry to enrolment, without the paper trail.',
    steps: [
      { icon: 'UserPlus', title: 'Take the enquiry', text: 'Record it and follow it up.' },
      { icon: 'FileText', title: 'Verify documents', text: 'Check them online.' },
      { icon: 'GraduationCap', title: 'Enrol', text: 'The student record is created.' },
    ],
  },
  coordinator: {
    listTitle: 'Everything a coordinator needs',
    rows: [
      { icon: 'CalendarDays', title: 'AI-powered, conflict-free timetable generation', text: 'Set the rules and review a timetable with no clashes.', moduleId: 'timetable' },
      { icon: 'ClipboardList', title: 'Exam scheduling and academic calendar management', text: 'Plan exams and the academic calendar together.', moduleId: 'exams' },
      { icon: 'Users', title: 'Real-time substitution handling on teacher absence', text: 'Cover absences from the available teachers.', moduleId: 'timetable' },
      { icon: 'BarChart3', title: 'Cross-department reporting for management reviews', text: 'Pull reports for review meetings.', moduleId: 'reports' },
    ],
    glance: [
      { icon: 'CalendarDays', title: 'AI Timetable and Scheduling', text: 'Conflict-free timetables.' },
      { icon: 'FileText', title: 'Academic and Examination', text: 'Exam schedules.' },
      { icon: 'ClipboardCheck', title: 'Attendance', text: 'Absences while planning cover.' },
    ],
    workflowTitle: 'How a coordinator uses ChaloSchools',
    workflowSub: 'Plan once, adjust quickly when something changes.',
    steps: [
      { icon: 'CalendarDays', title: 'Build', text: 'Generate the timetable.' },
      { icon: 'ClipboardList', title: 'Schedule', text: 'Exams and the calendar.' },
      { icon: 'Users', title: 'Cover', text: 'Handle absences on the day.' },
    ],
  },
  'transport-incharge': {
    listTitle: 'Everything a transport incharge needs',
    rows: [
      { icon: 'Map', title: 'Real-time GPS tracking for every bus', text: 'See every bus on a live map.', moduleId: 'transport' },
      { icon: 'Bus', title: 'Route and stop planning across the fleet', text: 'Set up routes, stops and who rides which bus.', moduleId: 'transport' },
      { icon: 'ClipboardList', title: 'Driver and vehicle record management', text: 'Keep driver and vehicle details in one place.', moduleId: 'transport' },
      { icon: 'Bell', title: 'Automated parent notifications on pickup and drop', text: 'Parents hear at pickup and drop, without calling the office.', moduleId: 'communication' },
    ],
    glance: [
      { icon: 'Bus', title: 'Transport Management', text: 'Routes, vehicles and drivers.' },
      { icon: 'Smartphone', title: 'Parent and Student App', text: 'Parents see the bus themselves.' },
      { icon: 'MessageCircle', title: 'Communication', text: 'Delay notices.' },
    ],
    workflowTitle: 'How a transport incharge uses ChaloSchools',
    workflowSub: 'Plan, track, inform.',
    steps: [
      { icon: 'Map', title: 'Plan', text: 'Routes and stops.' },
      { icon: 'Bus', title: 'Track', text: 'Every bus on a live map.' },
      { icon: 'Bell', title: 'Inform', text: 'Alert parents at pickup and drop.' },
    ],
  },
};
