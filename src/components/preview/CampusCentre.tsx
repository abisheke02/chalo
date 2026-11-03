'use client';

import dynamic from 'next/dynamic';
import type { MotionValue } from 'framer-motion';

const CampusScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });

// The product-page campus, sized to sit at the centre of the module carousel.
export default function CampusCentre({ spin }: { spin: MotionValue<number> }) {
  return (
    <div className="absolute left-1/2 top-1/2 h-[380px] w-[460px] -translate-x-1/2 -translate-y-1/2">
      <CampusScene wideOffset={0} distance={1.6} spin={spin} labels={false} />
    </div>
  );
}
