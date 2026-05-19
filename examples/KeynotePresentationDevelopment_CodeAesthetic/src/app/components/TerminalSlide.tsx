import { ReactNode } from 'react';

interface TerminalSlideProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function TerminalSlide({ children, title, className = '' }: TerminalSlideProps) {
  return (
    <div className={`w-full h-screen flex items-center justify-center bg-black ${className}`}>
      <div className="max-w-7xl w-full px-8">
        {title && (
          <div className="mb-6 border border-green-500/30 bg-black p-3 font-mono text-green-500 text-sm">
            <span className="text-green-300">$</span> {title}
          </div>
        )}
        <div className="border border-green-500/30 bg-black p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
