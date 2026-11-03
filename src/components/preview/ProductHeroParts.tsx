import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { site } from '@/config/site';

// The buttons and trust line of the /product hero, shared by the mod1 and mod2 previews.
export function ProductHeroActions() {
  return (
    <>
      <Button asChild size="lg" className="h-14 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
        <Link href="/contact#contact-form">Book a Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
      <Link href="#modules" className="inline-flex h-14 items-center gap-2 rounded-full border border-border bg-card px-7 text-base font-semibold text-heading transition-[border-color,color,transform] duration-150 hover:border-primary hover:text-primary active:scale-[0.97]">
        Explore Modules <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );
}

export function ProductTrustLine() {
  return (
    <p className="mt-5 flex items-center gap-2 text-sm font-medium text-subtle">
      <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
      ISO 27001:2022 certified · Used by {site.schoolsCount} schools
    </p>
  );
}
