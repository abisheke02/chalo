import { moduleHref } from '@/lib/module-links';

// The header menu. The defaults below are what the site shows until someone saves a menu in
// Admin > Menus; the saved copy is stored as JSON under the site-content key `nav_menu`.
// Home and Pricing are fixed links, and the demo button is editable (label and link).

export const NAV_MENU_KEY = 'nav_menu';

// Icons a menu link may use (the module links show one). Names only; the header maps them to icons.
export const MENU_ICON_NAMES = [
  'UserPlus', 'GraduationCap', 'Users', 'IndianRupee', 'CalendarDays', 'ClipboardCheck', 'FileText', 'MessageCircle',
  'Package', 'Wallet', 'BookOpen', 'Bus', 'TrendingUp', 'Bot', 'Smartphone', 'ShieldCheck',
  'Globe', 'Landmark', 'Shapes', 'School', 'Award', 'Building2', 'UserCog', 'Presentation', 'Heart', 'Calculator', 'ClipboardList', 'Network', 'Newspaper', 'Video', 'Megaphone', 'Trophy', 'LifeBuoy', 'Rocket', 'Info', 'Sparkles', 'Lock', 'Briefcase', 'Mail', 'Handshake',
] as const;
export type MenuIconName = (typeof MENU_ICON_NAMES)[number];

export interface MenuLink {
  label: string;
  href: string;
  icon?: MenuIconName;
  desc?: string; // a short line under the name
}
export interface MenuSection {
  title?: string;
  items: MenuLink[];
}
export interface MenuDropdown {
  label: string;
  // Shown as a highlighted banner at the top of the panel (title, an optional short line, and where it goes).
  footer?: { label: string; href: string; text?: string };
  sections: MenuSection[];
}
export interface NavMenu {
  dropdowns: MenuDropdown[];
  cta: { label: string; href: string };
}

export const DEFAULT_NAV_MENU: NavMenu = {
  cta: { label: 'Book a Demo', href: '/contact#contact-form' },
  dropdowns: [
    {
      label: 'Modules',
      footer: { label: 'All modules', href: '/product', text: 'Everything your school needs, in one platform' },
      sections: [
        {
          title: 'Core Modules',
          items: [
            { label: 'Admissions Management', href: moduleHref('admissions'), icon: 'UserPlus' },
            { label: 'Student Management', href: moduleHref('student'), icon: 'GraduationCap' },
            { label: 'Staff Management', href: moduleHref('staff'), icon: 'Users' },
            { label: 'Fee Management', href: moduleHref('fees'), icon: 'IndianRupee' },
            { label: 'AI Powered Timetable & Scheduling', href: moduleHref('timetable'), icon: 'CalendarDays' },
            { label: 'Attendance Management', href: moduleHref('attendance'), icon: 'ClipboardCheck' },
            { label: 'Academic & Examination', href: moduleHref('exams'), icon: 'FileText' },
            { label: 'Communication Management', href: moduleHref('communication'), icon: 'MessageCircle' },
          ],
        },
        {
          title: 'Add-on Modules',
          items: [
            { label: 'Academic Inventory Tracking', href: moduleHref('inventory'), icon: 'Package' },
            { label: 'Payroll Management', href: moduleHref('payroll'), icon: 'Wallet' },
            { label: 'Library Management', href: moduleHref('library'), icon: 'BookOpen' },
            { label: 'Transport Management', href: moduleHref('transport'), icon: 'Bus' },
            { label: 'Inspace Performance Insights', href: moduleHref('performance-insights'), icon: 'TrendingUp' },
            { label: 'AI Secretary', href: moduleHref('ai-secretary'), icon: 'Bot' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Parent App', href: moduleHref('parent-app'), icon: 'Smartphone' },
            { label: 'Teachers App', href: '/#our-apps', icon: 'GraduationCap' },
            { label: 'Management App', href: '/#our-apps', icon: 'ShieldCheck' },
          ],
        },
      ],
    },
    {
      label: 'Solutions',
      sections: [
        {
          title: 'By Board',
          items: [
            { label: 'IB Schools', href: '/solutions/ib', icon: 'Globe', desc: 'PYP, MYP and DP programmes' },
            { label: 'Cambridge Schools', href: '/solutions/cambridge', icon: 'Landmark', desc: 'IGCSE, O-Level and A-Level' },
            { label: 'Montessori Schools', href: '/solutions/montessori', icon: 'Shapes', desc: 'Activity-based, child-centred learning' },
            { label: 'State & CBSE', href: '/solutions/state-cbse', icon: 'School', desc: 'Board-format results and bulk admissions' },
            { label: 'Matric / Higher Education', href: '/solutions/matric', icon: 'Award', desc: 'Streams, electives and board exams' },
          ],
        },
        {
          title: 'By Role',
          items: [
            { label: 'School Owners', href: '/solutions/role/school-owners', icon: 'Building2', desc: 'One view of the whole school' },
            { label: 'Principals', href: '/solutions/role/principals', icon: 'UserCog', desc: 'Attendance, approvals and parent notices' },
            { label: 'Teachers', href: '/solutions/role/teachers', icon: 'Presentation', desc: 'Attendance, marks and timetable' },
            { label: 'Parents', href: '/solutions/role/parents', icon: 'Heart', desc: 'Fees, results, attendance and the bus' },
            { label: 'Accountants', href: '/solutions/role/accountants', icon: 'Calculator', desc: 'Fees, payroll and audit reports' },
            { label: 'Administrators', href: '/solutions/role/administrators', icon: 'ClipboardList', desc: 'Admissions and student records' },
            { label: 'Coordinator', href: '/solutions/role/coordinator', icon: 'Network', desc: 'Timetables, exams and substitutions' },
            { label: 'Transport Incharge', href: '/solutions/role/transport-incharge', icon: 'Bus', desc: 'Routes, buses and live tracking' },
          ],
        },
      ],
    },
    {
      label: 'Resources',
      sections: [
        {
          items: [
            { label: 'Blogs', href: '/blog', icon: 'Newspaper', desc: 'Ideas and best practices for schools' },
            { label: 'Webinars', href: '/webinars', icon: 'Video', desc: 'Live sessions and recordings' },
            { label: 'News & Events', href: '/news', icon: 'Megaphone', desc: 'Company updates and events' },
            { label: 'Case Studies', href: '/case-studies', icon: 'Trophy', desc: 'How schools use ChaloSchools' },
            { label: 'Help & Documentation', href: '/help', icon: 'LifeBuoy', desc: 'Guides to get started' },
            { label: 'Release Notes', href: '/release-notes', icon: 'Rocket', desc: 'What is new in the product' },
          ],
        },
      ],
    },
    {
      label: 'Company',
      sections: [
        {
          items: [
            { label: 'About Us', href: '/about', icon: 'Info', desc: 'Who we are and what we do' },
            { label: 'Why ChaloSchools?', href: '/compare', icon: 'Sparkles', desc: 'How we compare with others' },
            { label: 'Data Protection & Security', href: '/security', icon: 'Lock', desc: 'How your school\'s data is protected' },
            { label: 'Our Team', href: '/about', icon: 'Users', desc: 'The people behind ChaloSchools' },
            { label: 'Careers', href: '/careers', icon: 'Briefcase', desc: 'Open roles and how to apply' },
            { label: 'Contact Us', href: '/contact', icon: 'Mail', desc: 'Phone, email and our address' },
            { label: 'Partner With Us', href: '/contact', icon: 'Handshake', desc: 'Work with us as a partner' },
          ],
        },
      ],
    },
  ],
};

// --- Checking a saved menu. Anything that does not pass is refused (when saving) or ignored (when reading). ---

const LIMITS = { dropdowns: 8, sections: 6, items: 30 };
const SAFE_TEXT = /^[^<>]{1,80}$/;
// A link must start with / (this site), # (a place on a page), http(s):// , mailto: or tel:, with no spaces or quotes.
const SAFE_HREF = /^(\/|#|https?:\/\/|mailto:|tel:)[^\s<>"'`\\]{0,300}$/;

function text(v: unknown, max = 80): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 && t.length <= max && SAFE_TEXT.test(t) ? t : null;
}
function href(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return SAFE_HREF.test(t) && !/^\s*javascript:/i.test(t) ? t : null;
}

export type MenuCheck = { ok: true; menu: NavMenu } | { ok: false; error: string };

export function checkNavMenu(raw: unknown): MenuCheck {
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'The menu is not an object' };
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.dropdowns) || r.dropdowns.length === 0 || r.dropdowns.length > LIMITS.dropdowns) {
    return { ok: false, error: `Keep between 1 and ${LIMITS.dropdowns} menu headings` };
  }
  const cta = r.cta as Record<string, unknown> | undefined;
  const ctaLabel = text(cta?.label, 40);
  const ctaHref = href(cta?.href);
  if (!ctaLabel || !ctaHref) return { ok: false, error: 'The demo button needs a label and a link that starts with / or https://' };

  const dropdowns: MenuDropdown[] = [];
  for (const [di, d] of (r.dropdowns as unknown[]).entries()) {
    const dd = d as Record<string, unknown>;
    const label = text(dd?.label, 30);
    if (!label) return { ok: false, error: `Menu heading ${di + 1} needs a name (up to 30 characters, no < or >)` };
    if (!Array.isArray(dd.sections) || dd.sections.length === 0 || dd.sections.length > LIMITS.sections) {
      return { ok: false, error: `"${label}" needs between 1 and ${LIMITS.sections} groups` };
    }
    const sections: MenuSection[] = [];
    for (const s of dd.sections as unknown[]) {
      const ss = s as Record<string, unknown>;
      if (!Array.isArray(ss?.items) || ss.items.length === 0 || ss.items.length > LIMITS.items) {
        return { ok: false, error: `Each group in "${label}" needs between 1 and ${LIMITS.items} links` };
      }
      const title = ss.title === undefined || ss.title === '' ? undefined : text(ss.title, 40);
      if (ss.title !== undefined && ss.title !== '' && !title) return { ok: false, error: `A group title in "${label}" is not valid` };
      const items: MenuLink[] = [];
      for (const it of ss.items as unknown[]) {
        const ii = it as Record<string, unknown>;
        const l = text(ii?.label);
        const h = href(ii?.href);
        if (!l) return { ok: false, error: `A link in "${label}" has no name, or its name has < or >` };
        if (!h) return { ok: false, error: `The link "${l}" needs an address that starts with /, #, https://, mailto: or tel:` };
        const icon = ii.icon && (MENU_ICON_NAMES as readonly string[]).includes(ii.icon as string) ? (ii.icon as MenuIconName) : undefined;
        const desc = ii.desc ? text(ii.desc, 70) : null;
        items.push({ label: l, href: h, ...(icon ? { icon } : {}), ...(desc ? { desc } : {}) });
      }
      sections.push({ ...(title ? { title } : {}), items });
    }
    let footer: MenuDropdown['footer'];
    const f = dd.footer as Record<string, unknown> | undefined;
    if (f && (f.label || f.href)) {
      const fl = text(f.label, 40);
      const fh = href(f.href);
      if (!fl || !fh) return { ok: false, error: `The bottom link of "${label}" needs a label and an address, or leave both empty` };
      const ft = f.text ? text(f.text, 120) : null;
      footer = { label: fl, href: fh, ...(ft ? { text: ft } : {}) };
    }
    dropdowns.push({ label, ...(footer ? { footer } : {}), sections });
  }
  return { ok: true, menu: { dropdowns, cta: { label: ctaLabel, href: ctaHref } } };
}

// What the site uses: the saved menu if it is there and valid, otherwise the defaults.
export function resolveNavMenu(saved: string | null | undefined): NavMenu {
  if (!saved) return DEFAULT_NAV_MENU;
  try {
    const c = checkNavMenu(JSON.parse(saved));
    return c.ok ? c.menu : DEFAULT_NAV_MENU;
  } catch {
    return DEFAULT_NAV_MENU;
  }
}
