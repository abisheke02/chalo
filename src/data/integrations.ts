import { moduleHref } from '@/lib/module-links';

// The five integrations. Only facts the company has confirmed; supported device brands, GPS hardware, the
// Tally sync direction and gateways beyond Razorpay are not claimed. See docs/content/02-integration-pages.md.
// Used by the home page's sticky-scroll section and by the campus tour.
export interface IntegrationItem {
  id: string;
  n: string;
  title: string;
  paras: string[];
  points?: string[];
  link: string;
  href: string;
  pill: string;
  img: string;
  alt: string;
}

export const INTEGRATION_ITEMS: IntegrationItem[] = [
  {
    id: 'biometric', n: '01', title: 'Biometric & RFID Attendance', pill: '#CFE0F7', img: '/images/integrations-sticky/biometric.svg',
    alt: 'Illustration of a fingerprint attendance device',
    paras: ['Works with biometric and RFID devices, so a check-in becomes the day’s attendance record and parents hear about an absence at once.'],
    points: ['No register to fill, so no re-typing and no gaps', 'An absence message goes to the parent straight away', 'Staff attendance and leave feed salary deductions in Payroll'],
    link: 'See Attendance', href: moduleHref('attendance'),
  },
  {
    id: 'gps', n: '02', title: 'GPS Fleet Tracking', pill: '#D6E8FA', img: '/images/integrations-sticky/gps.svg',
    alt: 'Illustration of a school bus following a route to a map pin',
    paras: ['See every school bus live, plan routes from real data, and alert parents at pickup and drop inside the app.'],
    points: ['The whole fleet on one screen', 'Parents see their child’s bus live in the app', 'Driver, attendant and vehicle records in one place'],
    link: 'See Transport', href: moduleHref('transport'),
  },
  {
    id: 'tally', n: '03', title: 'Tally ERP', pill: '#DCE6F8', img: '/images/integrations-sticky/tally.svg',
    alt: 'Illustration of an accounts ledger with a calculator grid',
    paras: ['Fee and finance data match your accounts without being typed twice, so your accountant works from the same figures as the school office.'],
    points: ['Fee receipts and the ledger line up with your accounts', 'Daily reconciliation catches mismatches early', 'GST-ready receipts and detailed financial reports'],
    link: 'See Fees', href: moduleHref('fees'),
  },
  {
    id: 'payments', n: '04', title: 'Online Payment Gateway', pill: '#CFE8EE', img: '/images/integrations-sticky/payments.svg',
    alt: 'Illustration of a payment card with a green tick',
    paras: ['Parents pay fees at any hour from the app, and each payment is matched to the right student and reconciled automatically.'],
    points: ['Parents pay at any time, with no queue at the counter', 'Duplicate payments are prevented', 'A receipt is issued as soon as the payment is made'],
    link: 'See Fees', href: moduleHref('fees'),
  },
  {
    id: 'whatsapp', n: '05', title: 'WhatsApp, SMS & Voice', pill: '#D6DCF7', img: '/images/integrations-sticky/whatsapp.svg',
    alt: 'Illustration of message bubbles with delivered ticks',
    paras: ['Send notices, fee reminders and alerts to parents from one console, and see who has received and read each message.'],
    points: ['Notices go to the right parents, class-wise or school-wide', 'Delivery and read receipts show what was seen', 'One official channel replaces dozens of WhatsApp groups'],
    link: 'See Communication', href: moduleHref('communication'),
  },
];
