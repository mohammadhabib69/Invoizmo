'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkTo?: string | null;
}

export function Logo({ size = 'md', showText = false, linkTo = '/' }: LogoProps) {
  const sizes = {
    sm: { w: 100, h: 33 },
    md: { w: 140, h: 46 },
    lg: { w: 180, h: 60 },
    xl: { w: 220, h: 73 },
  };

  const LogoContent = (
    <div className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 duration-200">
      <Image 
        src="/logo.png" 
        alt="Invoizmo Logo" 
        width={sizes[size].w} 
        height={sizes[size].h}
        className="object-contain"
        priority
      />
    </div>
  );

  if (linkTo) {
    return <Link href={linkTo} className="no-underline">{LogoContent}</Link>;
  }
  return LogoContent;
}
