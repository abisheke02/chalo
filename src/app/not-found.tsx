import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import { ArrowRight, Home, Search, Phone, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary/10 select-none leading-none">
              404
            </div>
            <div className="relative -mt-14 md:-mt-16">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heading mb-4">
            Page Not Found
          </h1>
          <p className="text-subtle text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-[#026dde] hover:bg-[#0258b8] text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Homepage
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#026dde] text-primary hover:bg-[#026dde] hover:text-white font-semibold px-8 py-6 text-base rounded-lg transition-all"
              asChild
            >
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-border pt-10">
            <p className="text-sm text-subtle mb-6 font-medium uppercase tracking-wider">
              Popular Pages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/features/admissions"
                className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-[#026dde]/30 hover:shadow-md transition-all bg-card"
              >
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-heading group-hover:text-primary transition-colors">
                  Admissions Module
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
              <Link
                href="/about"
                className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-[#026dde]/30 hover:shadow-md transition-all bg-card"
              >
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-heading group-hover:text-primary transition-colors">
                  About Us
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-[#026dde]/30 hover:shadow-md transition-all bg-card"
              >
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-heading group-hover:text-primary transition-colors">
                  Request a Demo
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
