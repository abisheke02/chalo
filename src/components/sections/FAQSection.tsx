'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, CircleHelp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20">
            <CircleHelp className="w-4 h-4 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Frequently Asked Questions
          </h2>
          <div className="text-center py-6">
            <CircleHelp className="w-10 h-10 text-primary/20 mx-auto mb-2" />
            <p className="text-subtle">FAQs Coming Soon</p>
          </div>
        </div>
      </section>
    );
  }

  // Split FAQs into two columns for desktop
  const midPoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midPoint);
  const rightColumn = faqs.slice(midPoint);

  function FAQItem({ faq }: { faq: FAQItem }) {
    const isOpen = openId === faq.id;
    return (
      <div
        className={`border rounded-lg transition-all cursor-pointer ${
          isOpen
            ? 'border-[#026dde]/30 bg-card shadow-sm'
            : 'border-border bg-card hover:border-[#026dde]/20'
        }`}
        onClick={() => setOpenId(isOpen ? null : faq.id)}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <h3 className="text-sm font-semibold text-heading leading-snug">{faq.question}</h3>
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
        {isOpen && (
          <div className="px-4 pb-3 pt-0">
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-subtle leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="pt-10 pb-10 md:pt-14 md:pb-14 bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-7">
          <Badge variant="secondary" className="mb-3 bg-[#026dde]/10 text-primary border-[#026dde]/20">
            <CircleHelp className="w-4 h-4 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-subtle text-base">
            Find quick answers to common questions about ChaloSchools.
          </p>
        </div>

        {/* 2-column grid for desktop, single column for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-3">
            {leftColumn.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
          <div className="space-y-3">
            {rightColumn.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
