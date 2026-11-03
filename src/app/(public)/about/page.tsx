import { Metadata } from 'next';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target, Eye, Heart, Shield, Zap, Users, Award, TrendingUp,
  ArrowRight, GraduationCap, BookOpen, Building2, Globe,
} from 'lucide-react';
import { getSiteContent, getContent } from '@/lib/get-site-content';


import PageHero from '@/components/PageHero';
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/about');
}

const FALLBACK_MISSION = 'Giving every Indian school access to the same efficient, data-driven administration tools — currently serving 200+ schools and 1.5+ Million students across India, with more joining every month.';
const FALLBACK_VISION = 'To be the most trusted school management platform, making quality education management accessible to every school and empowering excellence in academic performance.';
const FALLBACK_STORY_1 = 'ChaloSchools – Schools Automated — is a product of Inspace Edu Solutions Private Limited. It was built from a simple observation: Indian schools spend more time managing paperwork than educating students.';
const FALLBACK_STORY_2 = 'What started as an effort to digitize school operations has grown into a comprehensive platform. Today, ChaloSchools handles all the activities for the operation of a school — from admissions and attendance to fees, transport, library, payroll, and more.';
const FALLBACK_STORY_3 = "We've built ChaloSchools specifically for Indian schools — supporting Pre School, State & CBSE, IB, Cambridge, Montessori, and Matriculation/Higher Education curricula. Every feature is designed with input from real school leaders, teachers, and parents.";
const FALLBACK_STORY_4 = 'Our passionate team of educators and engineers works tirelessly to ensure that every school, regardless of size or budget, has access to world-class management technology.';

// Brand gradient palette used site-wide, cycled by index so icon boxes look
// consistent with the rest of the site.
const GRADIENTS = [
  'from-[#026dde] to-[#00d4ff]',
  'from-[#f59e0b] to-[#fbbf24]',
  'from-[#10b981] to-[#34d399]',
  'from-[#8b5cf6] to-[#a78bfa]',
  'from-[#0891b2] to-[#22d3ee]',
  'from-[#e11d48] to-[#f87171]',
];

const SHADOWS = [
  'shadow-[#026dde]/20',
  'shadow-[#f59e0b]/20',
  'shadow-[#10b981]/20',
  'shadow-[#8b5cf6]/20',
  'shadow-[#0891b2]/20',
  'shadow-[#e11d48]/20',
];

const whyChooseData = [
  {
    icon: Shield,
    title: 'ISO 27001:2022 Certified',
    description: 'Your school data is protected by internationally recognized information security standards.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Cloud-native architecture ensures instant performance even on slow connections.',
  },
  {
    icon: Users,
    title: 'Built for Indian Schools',
    description: 'Supporting Pre School, State & CBSE, IB, Cambridge, Montessori, and Matriculation/Higher Education curricula.',
  },
  {
    icon: Heart,
    title: 'Dedicated Support',
    description: 'On-ground training, multilingual support, and a dedicated success manager for every school.',
  },
  {
    icon: Award,
    title: 'Industry Trusted',
    description: 'Trusted by schools across India for reliable school management solutions.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'Monthly feature releases driven by real feedback from school leaders, teachers, and parents.',
  },
];

const milestoneStats = [
  { icon: Building2, value: '2003', label: 'Incorporated' },
  { icon: Users, value: '350+', label: 'Team members' },
  { icon: TrendingUp, value: '80%', label: 'Repeat business rate' },
  { icon: Globe, value: '4', label: 'Countries — India, Singapore, Malaysia, Oman' },
];

const leadershipItems = [
  { title: 'Founder & CEO', description: 'Leading the vision to transform school administration with technology, ensuring every school has access to world-class management tools.' },
  { title: 'Technology & Engineering', description: 'Building robust, scalable, and secure school management solutions that serve schools across India.' },
  { title: 'Product & Design', description: 'Designing intuitive features that solve real challenges faced by school leaders, teachers, and parents every day.' },
  { title: 'Customer Success', description: 'Ensuring every school gets maximum value from ChaloSchools with dedicated onboarding, training, and ongoing support.' },
];

export default async function AboutPage() {
  const sc = await getSiteContent();

  const missionDescription = getContent(sc, 'about_mission', FALLBACK_MISSION);
  const visionDescription = getContent(sc, 'about_vision', FALLBACK_VISION);
  const story1 = getContent(sc, 'about_story_1', FALLBACK_STORY_1);
  const story2 = getContent(sc, 'about_story_2', FALLBACK_STORY_2);
  const story3 = getContent(sc, 'about_story_3', FALLBACK_STORY_3);
  const story4 = getContent(sc, 'about_story_4', FALLBACK_STORY_4);

  const missionVisionData = [
    {
      icon: Target,
      title: 'Our Mission',
      description: missionDescription,
      color: '#026dde',
      gradient: 'from-[#026dde] to-[#00d4ff]',
      shadow: 'shadow-[#026dde]/20',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: visionDescription,
      color: '#f59e0b',
      gradient: 'from-[#f59e0b] to-[#fbbf24]',
      shadow: 'shadow-[#f59e0b]/20',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHero
        scene="campus"
        eyebrow="About Us"
        title="Built in India, for Indian Schools"
        subtitle={missionDescription}
      />

      {/* Mission & Vision */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionVisionData.map((item) => {
              const IconComp = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border-border hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg ${item.shadow} text-white`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-heading mb-4">
                      {item.title}
                    </h2>
                    <p className="text-subtle leading-relaxed text-base">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-subtle leading-relaxed">
                <p>{story1}</p>
                <p>{story2}</p>
                <p>{story3}</p>
                <p>{story4}</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-[#026dde]/5 to-[#f59e0b]/10 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <GraduationCap className="w-24 h-24 text-primary mx-auto" />
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-primary">ISO</div>
                    <div className="text-subtle font-medium">27001:2022 Certified</div>
                  </div>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f59e0b]">{site.modulesCount}</div>
                      <div className="text-xs text-subtle">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f59e0b]">5</div>
                      <div className="text-xs text-subtle">Board Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f59e0b]">∞</div>
                      <div className="text-xs text-subtle">Possibilities</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge className="px-4 py-1.5 text-sm font-medium bg-[#026dde]/10 text-primary border-[#026dde]/20 rounded-full">
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      An ISO 27001:2022 Certified Company
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Milestones & Recognition */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              Built on Two Decades of Experience
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              ChaloSchools is built by Inspace Technologies — an established enterprise software company with a track record schools can trust.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {milestoneStats.map((stat, i) => {
              const IconComp = stat.icon;
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const shadow = SHADOWS[i % SHADOWS.length];
              return (
                <Card key={stat.label} className="border-border text-center">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${shadow} text-white`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-heading mb-1">{stat.value}</div>
                    <p className="text-xs text-subtle">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-subtle text-center max-w-2xl mx-auto mb-8">
            Beyond India, Inspace Technologies supports school and business automation
            engagements in Singapore, Malaysia, and Oman — the same platform, backed by
            the same team, wherever your school operates.
          </p>
          <div className="flex justify-center">
            <Badge className="px-4 py-2 text-sm font-medium bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 rounded-full">
              <Award className="w-4 h-4 mr-2" />
              Frost &amp; Sullivan India School Automation — New Product Innovation Leadership Award, 2017
            </Badge>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              Why Schools Choose ChaloSchools
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              Here&apos;s what makes us different from every other school management software.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseData.map((item, i) => {
              const IconComp = item.icon;
              const gradient = GRADIENTS[i % GRADIENTS.length];
              const shadow = SHADOWS[i % SHADOWS.length];
              return (
                <Card
                  key={item.title}
                  className="group border border-border hover:border-[#026dde]/30 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg ${shadow} text-white`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-heading mb-2">
                      {item.title}
                    </h3>
                    <p className="text-subtle text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-16 bg-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
              Our Leadership
            </h2>
            <p className="text-subtle text-lg max-w-2xl mx-auto">
              Meet the team behind ChaloSchools — a passionate group committed to transforming school operations across India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipItems.map((item) => (
              <Card
                key={item.title}
                className="border border-border hover:shadow-lg transition-all duration-300 text-center"
              >
                <CardContent className="pt-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#026dde] to-[#026dde]/60 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-heading">{item.title}</h3>
                  <p className="text-primary text-sm font-medium mb-3">ChaloSchools</p>
                  <p className="text-subtle text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-subtle text-lg mb-8 max-w-2xl mx-auto">
            Experience how ChaloSchools can transform your school administration.
          </p>
          <Button
            size="lg"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
            asChild
          >
            <Link href="/contact">
              Get in Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}