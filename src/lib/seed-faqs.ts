import { PrismaClient } from '@prisma/client';

interface FAQSeed {
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

const SEED_FAQS: FAQSeed[] = [
  {
    question: 'How long does it take to set up Chalo Schools?',
    answer: 'Most schools go live in under 30 days. Our onboarding team handles the entire data migration from your existing tool or spreadsheets.',
    category: 'General',
    order: 1,
    published: true,
  },
  {
    question: 'Do parents need a separate app?',
    answer: 'Yes — the free Chalo Parent App (iOS + Android) gives parents a single place to see attendance, fees, homework, and school communication.',
    category: 'General',
    order: 2,
    published: true,
  },
  {
    question: 'Is my school\'s data secure?',
    answer: 'Absolutely. Chalo Schools uses bank-grade AES-256 encryption, daily encrypted backups, and is fully compliant with India\'s DPDP Act.',
    category: 'General',
    order: 3,
    published: true,
  },
  {
    question: 'Can we migrate from our existing ERP or Excel sheets?',
    answer: 'Yes. Our team migrates all your student, staff, fee and academic data at zero additional cost.',
    category: 'General',
    order: 4,
    published: true,
  },
  {
    question: 'Does Chalo Schools support CBSE, ICSE and state boards?',
    answer: 'Yes — CBSE, ICSE, IB, IGCSE, and every major state board are supported out of the box.',
    category: 'General',
    order: 5,
    published: true,
  },
  {
    question: 'What is the pricing model?',
    answer: 'Chalo Schools is billed annually on a per-student basis, with modules you can enable or disable.',
    category: 'Pricing',
    order: 6,
    published: true,
  },
  {
    question: 'What kind of support do you offer?',
    answer: '24/7 human support via WhatsApp, phone and in-app chat. Average first response time is under 4 minutes.',
    category: 'Support',
    order: 7,
    published: true,
  },
];

export async function seedFAQs(prisma: PrismaClient): Promise<void> {
  for (const faq of SEED_FAQS) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${faq.order}` },
      update: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        published: faq.published,
      },
      create: {
        id: `seed-faq-${faq.order}`,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        published: faq.published,
      },
    });
  }
  console.log(`[Seed] Upserted ${SEED_FAQS.length} FAQs`);
}
