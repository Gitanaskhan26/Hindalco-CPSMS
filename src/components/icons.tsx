import * as React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Logo = ({ width, height, className }: LogoProps) => {
  return (
    <img
      src="https://storage.googleapis.com/project-spark-b20f9.appspot.com/static/a4816666-6467-4222-9993-9d0a6230f30c"
      alt="Hindalco C-PSMS Logo"
      width={typeof width === 'string' ? undefined : width}
      height={typeof height === 'string' ? undefined : height}
      className={className}
      style={{
        width: width ? (typeof width === 'string' ? width : `${width}px`) : 'auto',
        height: height ? (typeof height === 'string' ? height : `${height}px`) : 'auto',
      }}
    />
  );
};
