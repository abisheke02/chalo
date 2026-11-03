'use client';

import { useState, useEffect, useRef, useId, useMemo } from 'react';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';


import {
  Menu, ChevronDown, ArrowRight, Layers, UserPlus, GraduationCap, Users,
  IndianRupee, CalendarDays, ClipboardCheck, FileText, MessageCircle, Package,
  Wallet, BookOpen, Bus, TrendingUp, Bot, Smartphone, ShieldCheck,
  Globe, Landmark, Shapes, School, Award, Building2, UserCog, Presentation, Heart, Calculator, ClipboardList, Network, Newspaper, Video, Megaphone, Trophy, LifeBuoy, Rocket, Info, Sparkles, Lock, Briefcase, Mail, Handshake,
  type LucideIcon,
} from 'lucide-react';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import Image from 'next/image';

import type { MenuIconName, NavMenu } from '@/data/nav-menu';



interface NavItem {

  label: string;

  href?: string;

  icon?: LucideIcon;

  desc?: string;

}

interface NavSection {

  title?: string;

  items: NavItem[];

}

interface NavDropdownData {

  sections: NavSection[];

  panelClass?: string;

  gridClass?: string;

  footer?: { label: string; href: string; text?: string };

}

const ICONS: Record<MenuIconName, LucideIcon> = {
  UserPlus, GraduationCap, Users, IndianRupee, CalendarDays, ClipboardCheck, FileText, MessageCircle,
  Package, Wallet, BookOpen, Bus, TrendingUp, Bot, Smartphone, ShieldCheck,  Globe, Landmark, Shapes, School, Award, Building2, UserCog, Presentation, Heart, Calculator, ClipboardList, Network, Newspaper, Video, Megaphone, Trophy, LifeBuoy, Rocket, Info, Sparkles, Lock, Briefcase, Mail, Handshake,
};

// The menu comes from Admin > Menus (or the default in data/nav-menu.ts). A menu with three or more
// groups gets the wide three-column panel; the others use the normal one.
function toDropdowns(menu: NavMenu): { label: string; data: NavDropdownData }[] {
  return menu.dropdowns.map((d) => ({
    label: d.label,
    data: {
      sections: d.sections.map((sec) => ({
        title: sec.title,
        items: sec.items.map((it) => ({ label: it.label, href: it.href, icon: it.icon ? ICONS[it.icon] : undefined, desc: it.desc })),
      })),
      footer: d.footer,
      ...(d.sections.length > 2 ? { panelClass: 'w-[640px]', gridClass: 'grid-cols-3' } : {}),
    },
  }));
}

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

      className="static"

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

        className={`relative flex items-center gap-1.5 px-3 xl:px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${isOpen || active ? 'bg-primary/10 text-heading' : 'text-heading/80 hover:text-primary'}`}

      >

        {label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />

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

          className="absolute left-1/2 top-full z-50 mt-3 max-h-[min(62svh,480px)] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-3xl border border-border bg-card p-3 shadow-[0_30px_70px_-24px_rgba(15,42,74,0.4)]"

        >

          <div className="grid gap-2">

            {/* the banner: where the menu leads as a whole. An icon, a thin line, the title and a line of text, and a round arrow. */}
            {data.footer && (
              <Link
                href={data.footer.href}
                role="menuitem"
                className="group flex items-center gap-3 rounded-2xl bg-[#dcebfd] px-4 py-2 transition-colors hover:bg-[#cfe3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <Layers className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.6} aria-hidden="true" />
                <span aria-hidden="true" className="h-10 w-px shrink-0 bg-primary/40" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold leading-tight text-heading">{data.footer.label}</span>
                  {data.footer.text && <span className="block text-sm text-body">{data.footer.text}</span>}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#c4dcf8] text-primary transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            )}

            {data.sections.map((section, idx) => (

              <div key={idx} className={idx > 0 ? 'border-t border-border pt-2' : ''}>

                {section.title && (
                  <p className="mb-1 flex items-center gap-2 px-1 text-sm font-bold text-heading">
                    <span aria-hidden="true" className="h-4 w-1 rounded-full bg-primary" />
                    {section.title}
                  </p>
                )}

                <motion.div

                  className={`grid grid-cols-2 gap-x-4 gap-y-0 ${section.items.some((i) => i.desc) ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}

                  initial={reduce ? undefined : 'hidden'}

                  animate={reduce ? undefined : 'visible'}

                  variants={reduce ? undefined : { hidden: {}, visible: { transition: { staggerChildren: 0.025, delayChildren: 0.02 } } }}

                >

                  {section.items.map((item) => (

                    <motion.div

                      key={item.label}

                      variants={reduce ? undefined : { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}

                    >

                      <Link

                        href={item.href || '#'}

                        role="menuitem"

                        className="group/item flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-[13px] font-medium leading-snug text-heading transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"

                      >

                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#e8f0fb] text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-white">
                          {item.icon ? <item.icon className="h-4 w-4" aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                        </span>

                        <span className="min-w-0">
                          <span className="block">{item.label}</span>
                          {item.desc && <span className="block text-[11.5px] font-normal leading-snug text-body group-hover/item:text-primary/80">{item.desc}</span>}
                        </span>

                      </Link>

                    </motion.div>

                  ))}

                </motion.div>

              </div>

            ))}

          </div>

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

export default function HeaderClient({ menu }: { menu: NavMenu }) {

  const [scrolled, setScrolled] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const pathname = usePathname();

  const dropdowns = useMemo(() => toDropdowns(menu), [menu]);

  // The logo and Home on the home page itself: a link to the page you are on does nothing, so scroll back to the top (the hero).
  const goHome = (e: React.MouseEvent) => {
    if (pathname !== '/') return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) window.history.replaceState(null, '', '/');
  };

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

  function isActive(data: NavDropdownData): boolean {

    return data.sections.some((s) => s.items.some((it) => it.href && it.href !== '#' && pathname.startsWith(it.href)));

  }

  return (

    <nav
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      aria-label="Primary"
    >
      {/* Soft bar behind the row once the page has scrolled, so text never shows through the logo or button */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'py-2' : 'pt-4 pb-2'}`}>
        <div className="pointer-events-auto flex-1">
          <Link href="/" onClick={goHome} className="inline-flex items-center shrink-0">
            <Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="theme-logo h-11 w-auto" priority />
          </Link>
        </div>

        {/* Navigation pill */}
        <div
          className={`pointer-events-auto relative hidden lg:flex items-center gap-1 h-12 px-2 rounded-full border border-primary/25 backdrop-blur-xl transition-colors duration-500 ${
            scrolled ? 'bg-card/90 shadow-lg shadow-primary/15' : 'bg-card/70 shadow-md shadow-primary/5'
          }`}
        >
          <Link
            href="/"
            onClick={goHome}
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`px-3 xl:px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${pathname === '/' ? 'bg-primary/10 text-heading' : 'text-heading/80 hover:text-primary'}`}
          >
            Home
          </Link>
          {dropdowns.map(({ label, data }) => (
            <MegaDropdown
              key={label}
              label={label}
              data={data}
              isOpen={activeDropdown === label}
              onOpen={() => handleDropdownOpen(label)}
              onClose={handleDropdownClose}
              active={isActive(data)}
            />
          ))}
          <Link
            href="/pricing"
            aria-current={pathname === '/pricing' ? 'page' : undefined}
            className={`px-3 xl:px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${pathname === '/pricing' ? 'bg-primary/10 text-heading' : 'text-heading/80 hover:text-primary'}`}
          >
            Pricing
          </Link>
        </div>

        <div className="pointer-events-auto flex flex-1 items-center justify-end gap-3">
          <Button asChild className="hidden lg:inline-flex shrink-0 whitespace-nowrap h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
            <Link href={menu.cta.href}>{menu.cta.label} <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>

          <Sheet>

            <SheetTrigger asChild className="lg:hidden"><Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="w-5 h-5" /></Button></SheetTrigger>

            <SheetContent side="right" className="w-80 p-0"><SheetTitle className="sr-only">Menu</SheetTitle>

              <div className="flex flex-col h-full">

                <div className="p-6 border-b border-border">

                  <Link href="/" onClick={goHome}><Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="theme-logo h-8 w-auto" /></Link>

                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">

                  <Link href="/" onClick={goHome} className="block px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary rounded-lg transition-colors">Home</Link>

                  {dropdowns.map(({ label, data }) => (

                    <MobileAccordion key={label} label={label} data={data} />

                  ))}

                  <Link href="/pricing" className="block px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary rounded-lg transition-colors">Pricing</Link>

                </div>

                <div className="p-4 border-t border-border">

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">

                    <Link href={menu.cta.href}>{menu.cta.label} <ArrowRight className="w-4 h-4 ml-2" /></Link>

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

