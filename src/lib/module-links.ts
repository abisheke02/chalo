// One link rule for every module, shared by the header menu, the homepage,
// the hero campus and the product page: a module always opens its own
// section on /product (3D scene + features). That section links on to the
// module's /features page when one exists.

// Module id (as used by ModuleExplorer) -> /features/[slug] page.
const DETAIL_PAGES: Record<string, string> = {
  admissions: 'admissions',
  staff: 'staff-hr',
  payroll: 'payroll',
  fees: 'fees',
  timetable: 'timetable',
  attendance: 'attendance',
  exams: 'exams',
  reports: 'reports',
  library: 'library',
  transport: 'transport',
  'parent-app': 'parent-app',
  communication: 'whatsapp',
  student: 'student',
  inventory: 'inventory',
  'performance-insights': 'performance-insights',
  'ai-secretary': 'ai-secretary',
};

export function moduleDetailHref(id: string): string | null {
  const slug = DETAIL_PAGES[id];
  return slug ? `/features/${slug}` : null;
}

export function moduleHref(id: string): string {
  return `/product#${id}`;
}

// /features/[slug] -> the module scene that represents it.
export function moduleIdForFeatureSlug(slug: string): string {
  const entry = Object.entries(DETAIL_PAGES).find(([, s]) => s === slug);
  return entry ? entry[0] : 'reports';
}
