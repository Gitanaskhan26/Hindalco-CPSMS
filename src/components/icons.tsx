import * as React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

// A placeholder Logo component to prevent rendering errors.
// This can be replaced with the actual SVG or image component for the logo.
export const Logo = ({ width = 80, height = 19, className }: LogoProps) => {
  return (
    <div
      className={className}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E67326',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRadius: '4px',
      }}
      aria-label="Hindalco Logo"
    >
      HINDALCO
    </div>
  );
};
