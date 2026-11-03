// The 3D campus grouped into seven places, each holding one to three modules. Used by the
// click-to-explore hero. Positions are in the campus scene's own units (see HeroScene.tsx).
export interface CampusZone {
  id: string;
  title: string;
  short: string;
  modules: string[]; // module ids, as in module-features.ts
  focus: [number, number, number]; // where the camera looks when the zone is chosen
  zoom: number; // camera distance as a fraction of the full-campus distance
  az: number; // degrees round the campus the camera moves to (0 = the front, 90 = the right, -90 = the left)
}

export const CAMPUS_ZONES: CampusZone[] = [
  { id: 'front', title: 'Front office', short: 'Front Office', modules: ['admissions', 'student', 'parent-app'], focus: [0, 1, 6.8], zoom: 0.58, az: 0 },
  { id: 'classes', title: 'Classroom block', short: 'Classrooms', modules: ['attendance', 'timetable', 'exams'], focus: [0, 1.6, -4.3], zoom: 0.55, az: 0 },
  { id: 'admin', title: 'Admin block', short: 'Admin', modules: ['fees', 'staff', 'payroll'], focus: [-5.8, 1, 1.6], zoom: 0.58, az: -90 },
  { id: 'office', title: 'Office and insights', short: 'Office & AI', modules: ['reports', 'performance-insights', 'ai-secretary'], focus: [5.8, 1, 2.4], zoom: 0.6, az: 90 },
  { id: 'library', title: 'Library and store', short: 'Library & Store', modules: ['library', 'inventory'], focus: [0, 1, -5], zoom: 0.85, az: 0 },
  { id: 'comms', title: 'Announcement tower', short: 'Messages', modules: ['communication'], focus: [-2.7, 1.5, 3.2], zoom: 0.45, az: 0 },
  { id: 'transport', title: 'Bus bay', short: 'Transport', modules: ['transport'], focus: [-5, 0.8, 6.3], zoom: 0.5, az: -60 },
];

// Street view: where a visitor stands to look at each place [x, z], and optionally the point to face [x, z] (the place's focus by default).
// The visitor walks in from the gate at the front, at eye height.
export const STREET_GATE: [number, number] = [0, 21];
export const STREET_STOPS: Record<string, { stand: [number, number]; face?: [number, number]; height?: number; look?: number }> = {
  // the first view is raised and looks down over the whole campus, so it reads as 3D; the other stops come down to eye level
  front: { stand: [0, 19], face: [0, 0], height: 8.5, look: -0.42 },
  classes: { stand: [0, 4] },
  admin: { stand: [0.5, 0.4], face: [-5.8, 0.4] },
  office: { stand: [-0.5, 1.6], face: [5.8, 1.6] },
  library: { stand: [3.0, -0.2], face: [5.0, -5.0] },
  comms: { stand: [-5.2, 10.5] },
  transport: { stand: [-1.6, 2.4], face: [-5, 6.3] },
};

// Where each name tag floats. A zone with two buildings gets two tags.
export const CAMPUS_ZONE_PINS: { zone: string; at: [number, number, number] }[] = [
  { zone: 'front', at: [0, 3.5, 7.3] },
  { zone: 'classes', at: [0, 4.1, -4.3] },
  { zone: 'admin', at: [-6.8, 3.1, -0.6] },
  { zone: 'office', at: [5.8, 3.2, 1.5] },
  { zone: 'library', at: [5.2, 3.1, -5.1] },
  { zone: 'comms', at: [-2.4, 4.5, 3.6] },
  { zone: 'transport', at: [-5, 1.6, 6.3] },
];
