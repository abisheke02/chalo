// The 14 modules, grouped by what a school is trying to do. One list, used by the
// homepage and the module pages, so the grouping can never disagree.
export interface ModuleArea {
  id: string;
  title: string;
  promise: string;
  modules: string[]; // module ids (see src/data/module-features.ts)
}

export const MODULE_AREAS: ModuleArea[] = [
  { id: 'admissions-students', title: 'Admissions and students', promise: 'From enquiry to enrolment, one record per student.', modules: ['admissions', 'student'] },
  { id: 'fees-finance', title: 'Fees and finance', promise: 'Fees collected on time, salaries run without errors.', modules: ['fees', 'payroll'] },
  { id: 'teaching-academics', title: 'Teaching and academics', promise: 'Timetables, attendance and results without spreadsheets.', modules: ['timetable', 'attendance', 'exams', 'library'] },
  { id: 'people-communication', title: 'People and communication', promise: 'Staff records and parent messages in one place.', modules: ['staff', 'communication'] },
  { id: 'campus-operations', title: 'Campus operations', promise: 'Live bus tracking and stock that never runs out.', modules: ['transport', 'inventory'] },
  { id: 'insight-ai', title: 'Insight and AI', promise: 'Ask a question, get an answer from your own school data.', modules: ['performance-insights', 'ai-secretary'] },
];

export function areaForModule(moduleId: string): ModuleArea | undefined {
  return MODULE_AREAS.find((a) => a.modules.includes(moduleId));
}
