import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// The following import assumes you have a file at `src/components/Assets/HINDALCO-logo.ico`.
// If this path is incorrect, please adjust it to match your file's location.
import HindalcoLogo from './Assets/HINDALCO-logo.ico';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Logo = ({ width = 64, height = 64, className }: LogoProps) => {
  return (
    <Image
      src={HindalcoLogo}
      width={Number(width)}
      height={Number(height)}
      alt="Hindalco Logo"
      className={cn(className)}
    />
  );
};
