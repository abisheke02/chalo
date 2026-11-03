'use client';

import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/config/site';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube, Instagram, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="space-y-5 max-w-sm">
            <Link href="/"><Image src="/images/logo.png" alt="ChaloSchools" width={900} height={343} className="h-9 w-auto" /></Link>
            <p className="text-sm footer-muted leading-relaxed">CHALO – Schools Automated. Complete School Management Software which handles all the activities for operation of a school. An ISO 27001:2022 Certified Company.</p>
            <Link href="/security" className="inline-flex items-center gap-1.5 text-xs footer-muted hover:text-accent transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 &amp; ISO 27001:2022 Compliant
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs footer-muted">
              <Link href="/school-erp-tamil-nadu" className="hover:text-accent transition-colors">School ERP Tamil Nadu</Link>
              <Link href="/school-erp-chennai" className="hover:text-accent transition-colors">School ERP Chennai</Link>
              <Link href="/managed-it-services" className="hover:text-accent transition-colors">Managed IT Services</Link>
            </div>
          </div>
          <div className="space-y-2.5 shrink-0">
            <a href="tel:+919962228160" className="flex items-center gap-2 text-sm footer-muted hover:text-accent transition-colors"><Phone className="w-4 h-4" />+91 99622 28160</a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm footer-muted hover:text-accent transition-colors"><Mail className="w-4 h-4" />{site.email}</a>
            <div className="flex items-center gap-2 text-sm footer-muted"><MapPin className="w-4 h-4" />Chennai, Tamil Nadu, India</div>
          </div>
        </div>
        <Separator className="footer-divider" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/share/14n1PfEVNpE/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full footer-social flex items-center justify-center hover:bg-accent transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/chalo---schools-automated/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full footer-social flex items-center justify-center hover:bg-accent transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://youtube.com/@chalo-z4v" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full footer-social flex items-center justify-center hover:bg-accent transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/chaloschools" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full footer-social flex items-center justify-center hover:bg-accent transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm footer-muted">© {new Date().getFullYear()} ChaloSchools. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
