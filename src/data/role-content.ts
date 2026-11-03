// Extra text for each "For [role]" page: a day in the role, the modules that role uses, and common questions.
// Only things the product does are described here (see module-features.ts). No numbers, ratings or customer claims.

export interface RoleModule {
  id: string; // module id, as in module-features.ts
  name: string;
  use: string; // what this role does with it
}

export interface RoleContent {
  intro: string;
  day: { title: string; text: string }[];
  modules: RoleModule[];
  faqs: { q: string; a: string }[];
}

export const ROLE_CONTENT: Record<string, RoleContent> = {
  'school-owners': {
    intro:
      'As an owner or trustee you carry the whole school in your head: how many students have enrolled, which fees are pending, whether salaries are on time, and what each branch is doing. ChaloSchools puts these answers in one place, so you see the school as it is today and do not wait for someone to compile a report.',
    day: [
      { title: 'Start with the numbers', text: 'Open the dashboard to see admissions, fee collection and attendance together, across one school or every branch.' },
      { title: 'Spot what needs attention', text: 'Pending fees, absent staff and unanswered enquiries show up as items to act on, so small problems do not grow.' },
      { title: 'Ask a question in plain words', text: 'Use the AI Secretary to ask things like which classes have the most pending fees, and get the answer without a spreadsheet.' },
      { title: 'Review and decide', text: 'Look at performance insights and reports before a meeting, and decide with the same figures your principal sees.' },
    ],
    modules: [
      { id: 'reports', name: 'Reports', use: 'Share the same figures with trustees, principals and accountants.' },
      { id: 'performance-insights', name: 'Performance Insights', use: 'See academic and operational trends across the school.' },
      { id: 'fees', name: 'Fee Management', use: 'Check collection, dues and reconciliation at any time.' },
      { id: 'ai-secretary', name: 'AI Secretary', use: 'Ask questions about your school in plain language.' },
    ],
    faqs: [
      { q: 'Can I see more than one branch in one place?', a: 'Yes. ChaloSchools supports multi-branch schools and groups, so you can look at each branch and at the whole group from the same account.' },
      { q: 'Do I have to learn the whole system?', a: 'No. Owners usually use the dashboard, reports and the AI Secretary. Daily work stays with your staff, who have their own screens.' },
      { q: 'Who can see the financial figures?', a: 'Access is based on roles. You decide which people can see fees, payroll and reports, and everyone else sees only what their work needs.' },
    ],
  },
  principals: {
    intro:
      'A principal spends the day moving between classrooms, teachers, parents and paperwork. ChaloSchools keeps the day-to-day picture in front of you: who is absent, which classes need cover, how results are trending, and which parents are waiting for an answer.',
    day: [
      { title: 'Morning check', text: 'See student and staff attendance for the day, and which classes need a substitute.' },
      { title: 'Cover the gaps', text: 'Substitutions are suggested from the timetable, so a teacher\'s absence does not leave a class unattended.' },
      { title: 'Keep parents informed', text: 'Send a circular or an urgent notice to every parent, or to one class, in a few taps.' },
      { title: 'Review progress', text: 'Look at result analytics and cohort comparisons before parent meetings and board reviews.' },
    ],
    modules: [
      { id: 'attendance', name: 'Attendance Management', use: 'Watch daily attendance and absence patterns.' },
      { id: 'timetable', name: 'AI Timetable and Scheduling', use: 'Approve timetables and handle teacher absences.' },
      { id: 'exams', name: 'Academic and Examination', use: 'Follow results, report cards and class performance.' },
      { id: 'communication', name: 'Communication', use: 'Reach every parent with one message.' },
      { id: 'performance-insights', name: 'Performance Insights', use: 'Compare sections, subjects and years.' },
    ],
    faqs: [
      { q: 'How do I find out which teachers are absent?', a: 'Staff attendance is recorded each day and appears with the timetable, so you can see which periods need cover.' },
      { q: 'Can I message only one class or section?', a: 'Yes. Notices can go to the whole school, one class or one section, by WhatsApp, SMS or voice, with delivery tracking.' },
      { q: 'Can I see how a class is performing over time?', a: 'Yes. Result analytics and cohort comparison show performance by student, subject and class, and how it changes between exams.' },
    ],
  },
  teachers: {
    intro:
      'Teachers want to teach, not copy marks between registers. ChaloSchools reduces the daily paperwork: attendance is marked in a tap, marks are entered once, and parents see the result without the teacher sending anything separately.',
    day: [
      { title: 'See your timetable', text: 'Your periods, classes and any changes are on your screen, so there are no surprises at the start of the day.' },
      { title: 'Mark attendance', text: 'Mark a full class present or absent in one tap. Absent students\' parents are notified automatically.' },
      { title: 'Enter marks once', text: 'Enter marks after a test and they flow to the report card. There is no second copy to maintain.' },
      { title: 'Stay in touch', text: 'Share homework or a note with parents through the school\'s channel, not a private WhatsApp group.' },
    ],
    modules: [
      { id: 'attendance', name: 'Attendance Management', use: 'Mark class attendance in one tap.' },
      { id: 'timetable', name: 'AI Timetable and Scheduling', use: 'See your periods and substitutions.' },
      { id: 'exams', name: 'Academic and Examination', use: 'Enter marks and view results.' },
      { id: 'communication', name: 'Communication', use: 'Send notes to parents from the school account.' },
    ],
    faqs: [
      { q: 'Do I need a computer to mark attendance?', a: 'No. Teachers can mark attendance from the Teachers App on a phone or tablet.' },
      { q: 'Do I have to type marks again for the report card?', a: 'No. Marks are entered once and used for results and report cards.' },
      { q: 'Will parents know when a student is absent?', a: 'Yes. When a student is marked absent, the parent is notified straight away.' },
    ],
  },
  parents: {
    intro:
      'For parents, the school day happens out of sight. ChaloSchools gives parents one app to see what matters: attendance, fees, results, notices and where the school bus is, with the school\'s official messages in one place instead of several WhatsApp groups.',
    day: [
      { title: 'Know your child reached school', text: 'See attendance, and get a message if your child is marked absent.' },
      { title: 'Follow the bus', text: 'Check where the school bus is and get an alert before pickup.' },
      { title: 'Pay and keep receipts', text: 'See pending fees, pay online and keep every receipt in the app.' },
      { title: 'See results and notices', text: 'Read circulars, homework and exam results when the school publishes them.' },
    ],
    modules: [
      { id: 'parent-app', name: 'Parent and Student App', use: 'One app for fees, results, attendance and the bus.' },
      { id: 'communication', name: 'Communication', use: 'Receive official notices from the school.' },
      { id: 'fees', name: 'Fee Management', use: 'View dues and pay online.' },
      { id: 'transport', name: 'Transport Management', use: 'Follow the bus and get pickup alerts.' },
    ],
    faqs: [
      { q: 'Is the Parent App free for parents?', a: 'The app is provided by your school. Ask your school office for the login details.' },
      { q: 'Can I see all my children in one place?', a: 'If your children study in the same school, they can be linked to one parent account.' },
      { q: 'How will I get notices?', a: 'Your school sends notices through the app and, if the school chooses, by WhatsApp, SMS or voice call.' },
    ],
  },
  accountants: {
    intro:
      'An accountant\'s week is mostly reconciling: fee receipts against bank entries, dues against promises, salaries against attendance. ChaloSchools keeps one ledger so each receipt is recorded once and the reports are ready when the principal or auditor asks.',
    day: [
      { title: 'Collect fees', text: 'Record counter payments and see online payments reconciled in the same ledger.' },
      { title: 'Follow up on dues', text: 'Defaulters are listed with their dues, and reminders are sent automatically until fees are cleared.' },
      { title: 'Run payroll', text: 'Salaries are calculated each month, with PF, ESI and TDS handled, and payslips shared digitally.' },
      { title: 'Close the books', text: 'Pull the daily collection, pending dues and payroll reports without rebuilding them in a spreadsheet.' },
    ],
    modules: [
      { id: 'fees', name: 'Fee Management', use: 'Collect, reconcile and chase dues.' },
      { id: 'payroll', name: 'Payroll Management', use: 'Run monthly salaries and statutory deductions.' },
      { id: 'reports', name: 'Reports', use: 'Daily collection and dues reports for audits.' },
      { id: 'inventory', name: 'Academic Inventory Tracking', use: 'Track stock and purchases.' },
    ],
    faqs: [
      { q: 'Does it handle both online and cash fee payments?', a: 'Yes. Online and counter payments are recorded in the same ledger and reconciled daily.' },
      { q: 'Can parents get a receipt automatically?', a: 'Yes. Every payment produces a receipt, and parents can see it in the Parent App.' },
      { q: 'Does payroll include PF, ESI and TDS?', a: 'Yes. Payroll calculates statutory deductions and generates digital payslips.' },
    ],
  },
  administrators: {
    intro:
      'School administrators keep the office running: admissions, student records, staff files, certificates and every request that arrives at the front desk. ChaloSchools keeps these in one system so records are found in seconds and the same detail is not typed in three places.',
    day: [
      { title: 'Handle enquiries', text: 'Record every enquiry, follow it up and see how many have become admissions.' },
      { title: 'Keep records current', text: 'Student and staff files are in one place, with documents attached and changes tracked.' },
      { title: 'Control access', text: 'Give each person access to only the screens their work needs.' },
      { title: 'Answer requests', text: 'Find a student\'s details, fee status or documents without calling three departments.' },
    ],
    modules: [
      { id: 'admissions', name: 'Admissions Management', use: 'Run enquiries, applications and enrolment.' },
      { id: 'student', name: 'Student Management', use: 'Keep complete student records.' },
      { id: 'staff', name: 'Staff Management', use: 'Manage directory, roles and permissions.' },
      { id: 'inventory', name: 'Academic Inventory Tracking', use: 'Keep track of school assets and stock.' },
    ],
    faqs: [
      { q: 'Can we bring our existing student records into ChaloSchools?', a: 'Yes. Your team and ours plan the migration during onboarding, which is part of the service.' },
      { q: 'Can different staff see different information?', a: 'Yes. Access is role-based, so each person sees only what they need.' },
      { q: 'How are online applications handled?', a: 'Parents apply online, documents are uploaded and verified, and the application moves through the admissions pipeline you define.' },
    ],
  },
  coordinator: {
    intro:
      'Coordinators decide who teaches what and when, then deal with every change: a teacher on leave, a clash between two classes, a room needed for an event. ChaloSchools builds the timetable with AI and adjusts it quickly when the plan changes.',
    day: [
      { title: 'Build the timetable', text: 'Set the rules, such as teacher availability and subjects per week, and let the AI produce a timetable with no clashes.' },
      { title: 'Balance the load', text: 'Check that teaching loads are spread evenly across the week.' },
      { title: 'Cover absences', text: 'When a teacher is absent, substitutions are suggested and the changes reach everyone.' },
      { title: 'Track exams and attendance', text: 'See attendance and exam schedules alongside the timetable.' },
    ],
    modules: [
      { id: 'timetable', name: 'AI Timetable and Scheduling', use: 'Build conflict-free timetables and handle substitutions.' },
      { id: 'attendance', name: 'Attendance Management', use: 'See absences while planning cover.' },
      { id: 'exams', name: 'Academic and Examination', use: 'Plan exams and follow results.' },
      { id: 'staff', name: 'Staff Management', use: 'Know who is available for which classes.' },
    ],
    faqs: [
      { q: 'How is the timetable made?', a: 'You enter the constraints, such as teachers, subjects and periods. The AI builds a conflict-free timetable that you can review and change.' },
      { q: 'What happens when a teacher is absent?', a: 'ChaloSchools suggests substitutes from available teachers, and the change appears on their timetable.' },
      { q: 'Can I change a timetable after publishing it?', a: 'Yes. You can edit it at any time, and the people affected see the update.' },
    ],
  },
  'transport-incharge': {
    intro:
      'Transport incharges answer to parents all day: where is the bus, why is it late, who is on which route. ChaloSchools gives you routes, vehicles and drivers in one place, with live bus location and pickup alerts that cut the phone calls.',
    day: [
      { title: 'Plan routes', text: 'Set up routes, stops and which students travel on each bus.' },
      { title: 'Assign vehicles and drivers', text: 'Match vehicles and drivers to routes and keep their details in one place.' },
      { title: 'Watch the buses', text: 'See every bus on a live map as the school day starts and ends.' },
      { title: 'Alert parents', text: 'Parents are notified at pickup and drop, so they do not need to call the office.' },
    ],
    modules: [
      { id: 'transport', name: 'Transport Management', use: 'Routes, vehicles, drivers and live tracking.' },
      { id: 'communication', name: 'Communication', use: 'Tell parents about delays or route changes.' },
      { id: 'parent-app', name: 'Parent and Student App', use: 'Parents see the bus location themselves.' },
    ],
    faqs: [
      { q: 'Can parents track the bus themselves?', a: 'Yes. The Parent App shows the bus location, with alerts for pickup and drop.' },
      { q: 'Can I notify parents of a delay?', a: 'Yes. You can send a message to the parents of one route or to everyone.' },
      { q: 'Do I need special hardware for GPS tracking?', a: 'Live tracking depends on a location source on the bus. Ask us during the demo what works for your vehicles.' },
    ],
  },
};
