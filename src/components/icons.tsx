import * as React from 'react';
import Image from 'next/image';

interface LogoProps {
  width: number;
  height: number;
  className?: string;
}

export const Logo = ({ width, height, className }: LogoProps) => {
  return (
    <Image
      src="https://storage.googleapis.com/project-spark-3c32e.appspot.com/a/studio-images/w7Yx3tZqRf/file.png"
      alt="Hindalco Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};
