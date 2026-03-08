'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 160, height: 53 },
    md: { width: 240, height: 80 },
    lg: { width: 280, height: 93 },
    xl: { width: 320, height: 107 },
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/images/inthisone-jobs-logo.png"
        alt="Inthisone Jobs"
        width={sizes[size].width}
        height={sizes[size].height}
        className="h-auto"
        priority
      />
    </Link>
  );
}
