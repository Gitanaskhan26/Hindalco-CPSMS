import * as React from 'react';

export const Logo = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src="https://storage.googleapis.com/project-spark-3c32e.appspot.com/a/studio-images/z6nLp1hIeI/logo.svg"
      alt="Hindalco Logo"
      className={className}
      {...props}
    />
  );
};
