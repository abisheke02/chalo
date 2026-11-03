'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackConversion } from '@/components/GoogleAnalytics';

// Short demo-request form for the ads landing page. It posts to the same
// /api/contact endpoint as the main contact form (rate limit, honeypot and
// validation included), tagging the lead with where it came from.
const SIZES = ['Under 300 students', '300 to 1,000 students', 'Over 1,000 students'];

export default function LandingLeadForm({ source }: { source: string }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [f, setF] = useState({ name: '', phone: '', email: '', institution: '', city: '', numberOfStudents: '', honeypot: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (f.honeypot) {
      setDone(true);
      return;
    }
    setLoading(true);
    try {
      // Carry the ad campaign (utm_*) into the lead so sales can see what worked.
      const q = new URLSearchParams(window.location.search);
      const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].map((k) => (q.get(k) ? `${k}=${q.get(k)}` : '')).filter(Boolean).join(' ');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, message: `Source: ${source}${utm ? ` (${utm})` : ''}` }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
        trackConversion('generate_lead', { event_category: 'ads_landing', event_label: source, value: 1, currency: 'INR' });
      } else if (res.status === 429) {
        setError('Too many submissions. Please wait a moment and try again.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-bold text-heading">Thank you, we will call you shortly</h3>
        <p className="mt-2 text-sm text-subtle">Our team will contact you within one working day to book your demo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
      <div>
        <h2 className="text-xl font-bold text-heading">Book a free demo</h2>
        <p className="mt-1 text-sm text-subtle">See ChaloSchools working on your own school&apos;s data.</p>
      </div>
      {/* Honeypot: real visitors never see or fill this. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.honeypot} onChange={set('honeypot')} className="hidden" aria-hidden />
      <div>
        <Label htmlFor="lp-name">Your name</Label>
        <Input id="lp-name" required autoComplete="name" value={f.name} onChange={set('name')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lp-phone">Mobile / WhatsApp</Label>
          <Input id="lp-phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+91" value={f.phone} onChange={set('phone')} />
        </div>
        <div>
          <Label htmlFor="lp-email">Email</Label>
          <Input id="lp-email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} />
        </div>
      </div>
      <div>
        <Label htmlFor="lp-school">School name</Label>
        <Input id="lp-school" required value={f.institution} onChange={set('institution')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lp-city">City</Label>
          <Input id="lp-city" required value={f.city} onChange={set('city')} />
        </div>
        <div>
          <Label htmlFor="lp-size">School size</Label>
          <select
            id="lp-size"
            value={f.numberOfStudents}
            onChange={set('numberOfStudents')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">Select</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-2 text-sm text-red-600" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full text-white" style={{ backgroundColor: 'var(--brand)' }}>
        {loading ? 'Sending…' : (<><Send className="mr-2 h-4 w-4" /> Book my free demo</>)}
      </Button>
      <p className="text-center text-xs text-subtle">No spam. Free onboarding, data migration and staff training included.</p>
    </form>
  );
}
