import { Server, ShieldCheck, Network, ClipboardCheck, Lightbulb, Headset, type LucideIcon } from 'lucide-react';

// The Inspace Technologies "Beyond Software" service lines, condensed. They
// live on their own page (/managed-it-services), not on the homepage, because
// they serve a different buyer from the school ERP.
export interface ManagedService {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  shadow: string;
}

export const MANAGED_SERVICES: ManagedService[] = [
  { icon: Server, title: 'Managed IT Infrastructure', description: 'Servers, smart classrooms and CCTV, managed end to end.', gradient: 'from-[#026dde] to-[#00d4ff]', shadow: 'shadow-[#026dde]/20' },
  { icon: ShieldCheck, title: 'Cybersecurity Audit', description: 'Penetration testing, vulnerability scans and remediation.', gradient: 'from-[#e11d48] to-[#f87171]', shadow: 'shadow-[#e11d48]/20' },
  { icon: Network, title: 'Network Design & Deployment', description: 'Campus-wide wired and wireless networks.', gradient: 'from-[#0891b2] to-[#22d3ee]', shadow: 'shadow-[#0891b2]/20' },
  { icon: ClipboardCheck, title: 'Compliance Audit & Advisory', description: 'DPDP Act, IT Act 2000 and ISO 27001 readiness.', gradient: 'from-[#10b981] to-[#34d399]', shadow: 'shadow-[#10b981]/20' },
  { icon: Lightbulb, title: 'IT Strategy Consulting', description: 'Vendor-neutral technology roadmaps.', gradient: 'from-[#f59e0b] to-[#fbbf24]', shadow: 'shadow-[#f59e0b]/20' },
  { icon: Headset, title: '24/7 Helpdesk & AMC', description: 'SLA-backed on-site and remote support.', gradient: 'from-[#8b5cf6] to-[#a78bfa]', shadow: 'shadow-[#8b5cf6]/20' },
];
