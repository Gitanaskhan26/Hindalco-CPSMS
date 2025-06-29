import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Logo = ({ width, height, className }: LogoProps) => {
  return (
    <img
      src={`https://placehold.co/${width || 120}x${height || 13}.png`}
      alt="Logo Placeholder"
      width={typeof width === 'string' ? undefined : width}
      height={typeof height === 'string' ? undefined : height}
      className={cn('bg-muted text-muted-foreground', className)}
      style={{
        width: width ? (typeof width === 'string' ? width : `${width}px`) : 'auto',
        height: height ? (typeof height === 'string' ? height : `${height}px`) : 'auto',
      }}
      data-ai-hint="logo"
    />
  );
};
