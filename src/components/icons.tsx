import * as React from 'react';
import Image from 'next/image';

// A wrapper is needed for next/image with fill={true}
// It should have a position attribute like relative, absolute, fixed, or sticky.
// The parent components already provide dimensions via className.
export const Logo = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`relative ${className || ''}`} {...props}>
      <Image
        src="https://storage.googleapis.com/project-spark-3c32e.appspot.com/a/studio-images/z6nLp1hIeI/logo.svg"
        alt="Hindalco Logo"
        fill
        style={{objectFit: 'contain'}}
      />
    </div>
  );
};
