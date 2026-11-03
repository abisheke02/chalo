import { PrismaClient } from '@prisma/client';

interface TestimonialSeed {
  name: string;
  role: string;
  school: string;
  content: string;
  rating: number;
  order: number;
  published: boolean;
}

const SEED_TESTIMONIALS: TestimonialSeed[] = [
  {
    name: 'Group Captain G Senthil Kumar',
    role: 'Station Adjutant/Senior Education Officer',
    school: 'Air Force School, Chennai',
    content: 'The association of Inspace Edu Solutions Pvt Ltd with Air Force School, Avadi, commenced in the year 2017 with a project to develop end-to-end software. Their team demonstrated exceptional professionalism and the Chalo platform has significantly streamlined our school operations.',
    rating: 5,
    order: 1,
    published: true,
  },
  {
    name: 'Chairman',
    role: 'Chairman',
    school: 'C.E.O.A. Matric Hr. Sec. School, Madurai',
    content: 'We were not sure of a success in migrating our schools chain to a new software, yet we had taken a chance with Chalo. The transition was smooth, the support was outstanding, and today we cannot imagine going back to our old system.',
    rating: 5,
    order: 2,
    published: true,
  },
  {
    name: 'Correspondent',
    role: 'Correspondent',
    school: 'Pushpalata Vidya Mandir, Tirunelveli',
    content: 'Inspace Edu Solutions Pvt. Ltd. provides exuberant and magnificent support and guidance in Chalo App for our Vidyalaya. The comprehensive features and responsive support team have transformed how we manage our institution.',
    rating: 5,
    order: 3,
    published: true,
  },
  {
    name: 'Mrs. Pushpalatha Pooranan',
    role: 'Principal',
    school: 'Dr. Nalli Kuppuswami Vivekananda Vidyalaya Junior College, Chennai',
    content: 'We have been using Chalo App & Student management system for the past 3 years. The platform has simplified our fee collection, attendance tracking, and parent communication tremendously.',
    rating: 5,
    order: 4,
    published: true,
  },
  {
    name: 'Dr. A. H. Rizvi',
    role: 'President',
    school: 'Rizvi Springfield High School, Mumbai',
    content: 'We at Rizvi Springfield High School had using Chalo – School Automated Software developed and installed by Inspace Edu Solutions. The software has been instrumental in digitizing our entire school operation and parent engagement.',
    rating: 5,
    order: 5,
    published: true,
  },
];

export async function seedTestimonials(prisma: PrismaClient): Promise<void> {
  for (const testimonial of SEED_TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${testimonial.order}` },
      update: {
        name: testimonial.name,
        role: testimonial.role,
        school: testimonial.school,
        content: testimonial.content,
        rating: testimonial.rating,
        order: testimonial.order,
        published: testimonial.published,
      },
      create: {
        id: `seed-testimonial-${testimonial.order}`,
        name: testimonial.name,
        role: testimonial.role,
        school: testimonial.school,
        content: testimonial.content,
        rating: testimonial.rating,
        order: testimonial.order,
        published: testimonial.published,
      },
    });
  }
  console.log(`[Seed] Upserted ${SEED_TESTIMONIALS.length} testimonials`);
}
