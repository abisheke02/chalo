// One source for each module's name and its three headline features, used by
// the hero campus and the per-module 3D scenes. Feature order matches the
// three interactive objects in that module's scene (components/three/module-scenes.ts).

export interface ModuleFeature {
  name: string;
  line: string;
}

export interface ModuleInfo {
  id: string;
  title: string;
  features: [ModuleFeature, ModuleFeature, ModuleFeature];
}

export const MODULES: ModuleInfo[] = [
  { id: 'admissions', title: 'Admissions Management', features: [
    { name: 'Enquiry Management', line: 'Capture and follow up every enquiry.' },
    { name: 'Conversion Tracking', line: 'See where applicants drop off.' },
    { name: 'Online Applications', line: 'Forms with document upload and e-payment.' },
  ] },
  { id: 'student', title: 'Student Management', features: [
    { name: 'Unified Profiles', line: 'One record per student, admission to alumni.' },
    { name: 'Academic History', line: 'Marks, attendance and documents for every year.' },
    { name: 'Instant Search', line: 'Any student record in seconds.' },
  ] },
  { id: 'staff', title: 'Staff Management', features: [
    { name: 'Staff Directory', line: 'Complete records for all staff.' },
    { name: 'Departments & Roles', line: 'Clear structure and reporting lines.' },
    { name: 'Access Control', line: 'Role-based permissions for every user.' },
  ] },
  { id: 'fees', title: 'Fee Management', features: [
    { name: 'Fee Collection', line: 'Online and counter payments, reconciled daily.' },
    { name: 'Defaulter Tracking', line: 'Automated reminders until dues are cleared.' },
    { name: 'Secure Ledger', line: 'Every receipt accounted for.' },
  ] },
  { id: 'timetable', title: 'AI Powered Timetable & Scheduling', features: [
    { name: 'Conflict-Free Scheduling', line: 'AI builds the timetable around every constraint.' },
    { name: 'Period Planning', line: 'Balanced teaching loads across the week.' },
    { name: 'Instant Substitutions', line: 'Absences covered in one click.' },
  ] },
  { id: 'attendance', title: 'Attendance Management', features: [
    { name: 'Class Attendance', line: 'A full class marked in one tap.' },
    { name: 'Biometric & RFID', line: 'Works with your existing devices.' },
    { name: 'Absence Alerts', line: 'Parents notified immediately.' },
  ] },
  { id: 'exams', title: 'Academic & Examination', features: [
    { name: 'Result Analytics', line: 'Performance by student, subject and class.' },
    { name: 'Report Cards', line: 'Board-compliant, generated automatically.' },
    { name: 'Fast Results', line: 'From marks entry to results in minutes.' },
  ] },
  { id: 'communication', title: 'Communication Management', features: [
    { name: 'Parent Reach', line: 'Every parent, every notice, on time.' },
    { name: 'Delivery Tracking', line: 'See who has received each message.' },
    { name: 'Multi-Channel', line: 'WhatsApp, SMS and voice from one console.' },
  ] },
  { id: 'reports', title: 'Reports & Analytics', features: [
    { name: 'Report Library', line: 'Ready-made reports across every module.' },
    { name: 'One-Click Export', line: 'Excel and PDF, ready for management.' },
    { name: 'Live Dashboards', line: 'Real-time figures for leadership.' },
  ] },
  { id: 'inventory', title: 'Academic Inventory Tracking', features: [
    { name: 'Stock Management', line: 'Books, uniforms and supplies in one register.' },
    { name: 'Barcode Tracking', line: 'Scan items in and out.' },
    { name: 'Low-Stock Alerts', line: 'Reorder before anything runs out.' },
  ] },
  { id: 'payroll', title: 'Payroll Management', features: [
    { name: 'Automated Salaries', line: 'Accurate pay runs every month.' },
    { name: 'Statutory Compliance', line: 'PF, ESI and TDS calculated automatically.' },
    { name: 'Digital Payslips', line: 'Generated and shared in seconds.' },
  ] },
  { id: 'library', title: 'Library Management', features: [
    { name: 'Issue & Return', line: 'Barcode-based circulation desk.' },
    { name: 'Digital Catalogue', line: 'Every title searchable online.' },
    { name: 'Due-Date Reminders', line: 'Automatic notices for overdue books.' },
  ] },
  { id: 'transport', title: 'Transport Management', features: [
    { name: 'Live GPS Tracking', line: 'Every bus visible in real time.' },
    { name: 'Route Management', line: 'Routes, vehicles and drivers in one place.' },
    { name: 'Pickup Alerts', line: 'Parents notified at every stop.' },
  ] },
  { id: 'performance-insights', title: 'Inspace Performance Insights', features: [
    { name: 'School-Wide View', line: 'Academic health across every class.' },
    { name: 'Cohort Comparison', line: 'Benchmark sections, subjects and years.' },
    { name: 'Early Warnings', line: 'Identify at-risk students early.' },
  ] },
  { id: 'ai-secretary', title: 'AI Secretary', features: [
    { name: 'Always Available', line: 'An assistant that works around the clock.' },
    { name: 'Drafting', line: 'Notices and circulars in seconds.' },
    { name: 'Parent Queries', line: 'Routine questions answered automatically.' },
  ] },
  { id: 'parent-app', title: 'Parent & Student App', features: [
    { name: 'Connected Parents', line: 'One app for every family.' },
    { name: 'Fewer WhatsApp Groups', line: 'One official channel replaces many.' },
    { name: 'All in One Place', line: 'Fees, results, attendance and bus location.' },
  ] },
];

export function moduleInfo(id: string): ModuleInfo | undefined {
  return MODULES.find((m) => m.id === id);
}
