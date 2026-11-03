import FAQSection from './FAQSection';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HomepageFAQ({ faqs = [] }: { faqs?: FAQItem[] }) {
  if (!faqs || faqs.length === 0) {
    return (
      <section className="py-10 md:py-12 bg-surface-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">FAQ</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="text-lg text-subtle font-medium">FAQs Coming Soon</p>
            <p className="text-sm text-subtle mt-1">Have a question now? Reach out via the contact form below.</p>
          </div>
        </div>
      </section>
    );
  }

  return <FAQSection faqs={faqs} />;
}
