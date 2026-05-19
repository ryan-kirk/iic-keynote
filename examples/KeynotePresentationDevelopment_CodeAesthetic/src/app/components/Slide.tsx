import { ReactNode } from 'react';

interface SlideProps {
  children: ReactNode;
  background?: string;
  className?: string;
}

export function Slide({ children, background, className = '' }: SlideProps) {
  return (
    <div
      className={`w-full h-screen flex items-center justify-center relative ${className}`}
      style={background ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="max-w-6xl w-full px-16">
        {children}
      </div>
    </div>
  );
}
