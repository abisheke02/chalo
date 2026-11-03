'use client';

import { useState, useEffect, useRef, useId } from 'react';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';


import {
  Menu, ChevronDown, ArrowRight, UserPlus, GraduationCap, Users,
  IndianRupee, CalendarDays, ClipboardCheck, FileText, MessageCircle, Package,
  Wallet, BookOpen, Bus, TrendingUp, Bot, Smartphone, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import Image from 'next/image';

import { moduleHref } from '@/lib/module-links';



interface NavItem {

  label: string;

  href?: string;

  icon?: LucideIcon;

}

interface NavSection {

  title?: string;

  items: NavItem[];

}

interface NavDropdownData {

  sections: NavSection[];

  panelClass?: string;

  gridClass?: string;

  footer?: { label: string; href: string };

}

const navDropdowns: Record<string, NavDropdownData> = {

  // The only menu entry for modules — there is no separate "Modules" link.
  Modules: {

    panelClass: 'w-[640px]',

    gridClass: 'grid-cols-3',

    footer: { label: 'View all modules', href: '/product' },

    sections: [
      { title: 'Core Modules', items: [
        { label: 'Admissions Management', href: moduleHref('admissions'), icon: UserPlus },
        { label: 'Student Management', href: moduleHref('student'), icon: GraduationCap },
        { label: 'Staff Management', href: moduleHref('staff'), icon: Users },
        { label: 'Fee Management', href: moduleHref('fees'), icon: IndianRupee },
        { label: 'AI Powered Timetable & Scheduling', href: moduleHref('timetable'), icon: CalendarDays },
        { label: 'Attendance Management', href: moduleHref('attendance'), icon: ClipboardCheck },
        { label: 'Academic & Examination', href: moduleHref('exams'), icon: FileText },
        { label: 'Communication Management', href: moduleHref('communication'), icon: MessageCircle },
      ]},
      { title: 'Add-on Modules', items: [
        { label: 'Academic Inventory Tracking', href: moduleHref('inventory'), icon: Package },
        { label: 'Payroll Management', href: moduleHref('payroll'), icon: Wallet },
        { label: 'Library Management', href: moduleHref('library'), icon: BookOpen },
        { label: 'Transport Management', href: moduleHref('transport'), icon: Bus },
        { label: 'Inspace Performance Insights', href: moduleHref('performance-insights'), icon: TrendingUp },
        { label: 'AI Secretary', href: moduleHref('ai-secretary'), icon: Bot },
      ]},
      { title: 'More', items: [
        { label: 'Parent App', href: moduleHref('parent-app'), icon: Smartphone },
        { label: 'Teachers App', href: '/#our-apps', icon: GraduationCap },
        { label: 'Management App', href: '/#our-apps', icon: ShieldCheck },
      ]},
    ],

  },

  Solutions: {

    sections: [

      { title: 'By Board', items: [

        { label: 'IB Schools', href: '/solutions/ib' },

        { label: 'Cambridge Schools', href: '/solutions/cambridge' },

        { label: 'Montessori Schools', href: '/solutions/montessori' },

        { label: 'State & CBSE', href: '/solutions/state-cbse' },

        { label: 'Matric / Higher Education', href: '/solutions/matric' },

      ]},

      { title: 'By Role', items: [

        { label: 'School Owners', href: '/solutions/role/school-owners' },

        { label: 'Principals', href: '/solutions/role/principals' },

        { label: 'Teachers', href: '/solutions/role/teachers' },

        { label: 'Parents', href: '/solutions/role/parents' },

        { label: 'Accountants', href: '/solutions/role/accountants' },

        { label: 'Administrators', href: '/solutions/role/administrators' },

        { label: 'Coordinator', href: '/solutions/role/coordinator' },

        { label: 'Transport Incharge', href: '/solutions/role/transport-incharge' },

      ]},

    ],

  },

  Resources: {

    sections: [{ items: [

      { label: 'Blogs', href: '/blog' },

      { label: 'Webinars', href: '/webinars' },

      { label: 'News & Events', href: '/news' },

      { label: 'Case Studies', href: '/case-studies' },

      { label: 'Help & Documentation', href: '/help' },

      { label: 'Release Notes', href: '/release-notes' },

    ] }],

  },

  Company: {

    sections: [{ items: [

      { label: 'About Us', href: '/about' },

      { label: 'Why ChaloSchools?', href: '/compare' },

      { label: 'Data Protection & Security', href: '/security' },

      { label: 'Our Team', href: '/about' },

      { label: 'Careers', href: '/careers' },

      { label: 'Contact Us', href: '/contact' },

      { label: 'Partner With Us', href: '/contact' },

    ] }],

  },

};

const navItems = ['Modules', 'Solutions', 'Resources', 'Company'];

function MegaDropdown({

  label, data, isOpen, onOpen, onClose, active,

}: {

  label: string; data: NavDropdownData; isOpen: boolean; onOpen: () => void; onClose: () => void; active: boolean;

}) {

  const panelId = useId();

  const containerRef = useRef<HTMLDivElement>(null);

  const reduce = useReducedMotion();

  function handleKeyDown(e: React.KeyboardEvent) {

    if (e.key === 'Escape' && isOpen) {

      e.stopPropagation();

      onClose();

      const trigger = containerRef.current?.querySelector<HTMLButtonElement>('button[aria-haspopup]');

      trigger?.focus();

    }

  }

  return (

    <div

      ref={containerRef}

      className="relative"

      onMouseEnter={onOpen}

      onMouseLeave={onClose}

      onKeyDown={handleKeyDown}

    >

      <button

        type="button"

        aria-haspopup="true"

        aria-expanded={isOpen}

        aria-controls={panelId}

        onClick={() => (isOpen ? onClose() : onOpen())}

        onFocus={onOpen}

        className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-heading/80 hover:text-primary transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"

      >

        {label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />

        {active && (

          <motion.span

            layoutId="nav-active"

            className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-primary"

            transition={{ type: 'spring', stiffness: 300, damping: 25 }}

          />

        )}

      </button>

      <AnimatePresence>{isOpen && (

        <motion.div

          id={panelId}

          role="menu"

          aria-label={label}

          initial={{ opacity: 0, y: 8, scale: 0.98 }}

          animate={{ opacity: 1, y: 0, scale: 1 }}

          exit={{ opacity: 0, y: 8, scale: 0.98 }}

          transition={{ duration: 0.15 }}

          className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${data.panelClass ?? 'w-[500px]'} bg-card rounded-xl shadow-xl border border-border p-6 z-50`}

        >

          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card rotate-45 rounded-[2px] border-l border-t border-border" />

          <div className="space-y-4">

            {data.sections.map((section, idx) => (

              <div key={idx}>

                {section.title && <p className="text-xs font-extrabold uppercase tracking-wider text-heading mb-2">{section.title}</p>}

                <motion.div

                  className={`grid ${data.gridClass ?? 'grid-cols-2'} gap-1`}

                  initial={reduce ? undefined : 'hidden'}

                  animate={reduce ? undefined : 'visible'}

                  variants={reduce ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } }}

                >

                  {section.items.map((item) => (

                    <motion.div

                      key={item.label}

                      variants={reduce ? undefined : { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}

                    >

                      <Link

                        href={item.href || '#'}

                        role="menuitem"

                        className="group/item flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"

                      >

                        {item.icon && (
                          <span className="grid place-items-center w-7 h-7 rounded-md bg-primary/10 text-primary shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                            <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        )}

                        <span className="truncate">{item.label}</span>

                      </Link>

                    </motion.div>

                  ))}

                </motion.div>

              </div>

            ))}

          </div>

          {data.footer && (
            <Link
              href={data.footer.href}
              role="menuitem"
              className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {data.footer.label}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}

        </motion.div>

      )}</AnimatePresence>

    </div>

  );

}

// --- Mobile accordion section (height auto animation) ---

function MobileAccordion({ label, data }: { label: string; data: NavDropdownData }) {

  const [open, setOpen] = useState(false);

  return (

    <div className="border-b border-border/50 last:border-0">

      <button

        type="button"

        onClick={() => setOpen((o) => !o)}

        aria-expanded={open}

        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"

      >

        {label}

        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />

      </button>

      <AnimatePresence initial={false}>

        {open && (

          <motion.div

            initial={{ height: 0, opacity: 0 }}

            animate={{ height: 'auto', opacity: 1 }}

            exit={{ height: 0, opacity: 0 }}

            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}

            className="overflow-hidden"

          >

            {data.sections.map((s, idx) => (

              <div key={idx} className="pb-1">

                {s.title && <p className="px-5 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase">{s.title}</p>}

                {s.items.map((item) => (

                  <Link key={item.label} href={item.href || '#'} className="block px-5 py-2.5 text-sm text-foreground hover:text-primary rounded-lg transition-colors">{item.label}</Link>

                ))}

              </div>

            ))}

            {data.footer && (
              <Link href={data.footer.href} className="block px-5 py-2.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">{data.footer.label} →</Link>
            )}

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}

export default function Header() {

  const [scrolled, setScrolled] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const pathname = usePathname();

  useEffect(() => {

    const h = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', h);

    return () => window.removeEventListener('scroll', h);

  }, []);

  function handleDropdownOpen(label: string) {

    clearTimeout(closeTimeoutRef.current);

    setActiveDropdown(label);

  }

  function handleDropdownClose() {

    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);

  }

  // Which top-level dropdown owns the current route (for the layoutId indicator).

  function isActive(label: string): boolean {

    const data = navDropdowns[label];

    if (!data) return false;

    return data.sections.some((s) => s.items.some((it) => it.href && it.href !== '#' && pathname.startsWith(it.href)));

  }

  return (

    <nav

      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/80 backdrop-blur-xl shadow-md border-b border-border' : 'bg-card border-b border-border'}`}

      aria-label="Primary"

    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16 lg:h-[68px]">

          <Link href="/" className="flex items-center gap-2 shrink-0">

            <Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="theme-logo h-11 w-auto" priority />

          </Link>

          <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

            <Link href="/" className="relative px-3 py-2 text-sm font-medium text-heading/80 hover:text-primary transition-colors hover-underline">Home</Link>

            {navItems.map((item) => navDropdowns[item] ? (

              <MegaDropdown

                key={item}

                label={item}

                data={navDropdowns[item]}

                isOpen={activeDropdown === item}

                onOpen={() => handleDropdownOpen(item)}

                onClose={handleDropdownClose}

                active={isActive(item)}

              />

            ) : null)}

            <Link href="/pricing" className="relative px-3 py-2 text-sm font-medium text-heading/80 hover:text-primary transition-colors hover-underline">Pricing</Link>

          </div>

          <div className="hidden lg:flex items-center gap-2">

            <Button asChild size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-4 h-8 shadow-sm shadow-primary/20">

              <Link href="/contact#contact-form">Book a Demo <ArrowRight className="w-3 h-3 ml-1" /></Link>

            </Button>

          </div>

          <Sheet>

            <SheetTrigger asChild className="lg:hidden"><Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="w-5 h-5" /></Button></SheetTrigger>

            <SheetContent side="right" className="w-80 p-0"><SheetTitle className="sr-only">Menu</SheetTitle>

              <div className="flex flex-col h-full">

                <div className="p-6 border-b border-border">

                  <Link href="/"><Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="theme-logo h-8 w-auto" /></Link>

                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">

                  <Link href="/" className="block px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary rounded-lg transition-colors">Home</Link>

                  {Object.entries(navDropdowns).map(([label, data]) => (

                    <MobileAccordion key={label} label={label} data={data} />

                  ))}

                  <Link href="/pricing" className="block px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary rounded-lg transition-colors">Pricing</Link>

                </div>

                <div className="p-4 border-t border-border">

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">

                    <Link href="/contact#contact-form">Book a Demo <ArrowRight className="w-4 h-4 ml-2" /></Link>

                  </Button>

                </div>

              </div>

            </SheetContent>

          </Sheet>

        </div>

      </div>

    </nav>

  );

}

