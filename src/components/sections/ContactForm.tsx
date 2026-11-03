'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { trackConversion } from '@/components/GoogleAnalytics';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    numberOfStudents: '',
    city: '',
    currentSoftware: '',
    message: '',
    honeypot: '', // Hidden honeypot field for bots
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.institution.trim() || !formData.city.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Honeypot should remain empty (if filled, it's a bot)
    if (formData.honeypot) {
      // Silently pretend success
      setSubmitted(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          institution: formData.institution,
          numberOfStudents: formData.numberOfStudents,
          city: formData.city,
          currentSoftware: formData.currentSoftware,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        trackConversion('generate_lead', {
          event_category: 'contact_form',
          event_label: formData.institution,
          value: 1,
          currency: 'INR',
        });
      } else if (res.status === 429) {
        setError('Too many submissions. Please wait a moment before trying again.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-heading mb-2">Thank You!</h3>
            <p className="text-subtle max-w-sm">
              We&apos;ve received your enquiry. Our team will get back to you within 24 hours to schedule a personalized demo.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', institution: '', numberOfStudents: '', city: '', currentSoftware: '', message: '', honeypot: '' });
              }}
              variant="outline"
              className="mt-6 border-[#026dde] text-primary hover:bg-[#026dde] hover:text-white"
            >
              Send Another Enquiry
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-5 pb-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from real users, bots will fill it */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="institution">Name of Institution *</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Your school or institution name"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@school.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="numberOfStudents">Number of Students</Label>
              <Select value={formData.numberOfStudents} onValueChange={(v) => handleSelectChange('numberOfStudents', v)}>
                <SelectTrigger id="numberOfStudents" className="w-full">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under 500">Under 500</SelectItem>
                  <SelectItem value="500–1000">500–1000</SelectItem>
                  <SelectItem value="1000–2000">1000–2000</SelectItem>
                  <SelectItem value="2000+">2000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="currentSoftware">Current Software</Label>
            <Select value={formData.currentSoftware} onValueChange={(v) => handleSelectChange('currentSoftware', v)}>
              <SelectTrigger id="currentSoftware" className="w-full">
                <SelectValue placeholder="What do you currently use?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excel/Spreadsheets">Excel/Spreadsheets</SelectItem>
                <SelectItem value="Other ERP Software">Other ERP Software</SelectItem>
                <SelectItem value="No Software">No Software</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Anything else you&apos;d like us to know?</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Optional — tell us more about your requirements..."
              rows={2}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold py-5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Book a Demo
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
