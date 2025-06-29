import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="hsl(var(--primary))" />
    <path
      d="M10 10V22H12V16H20V22H22V10H20V14H12V10H10Z"
      fill="hsl(var(--primary-foreground))"
    />
  </svg>
);
