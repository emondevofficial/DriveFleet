import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading DriveFleet...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-3">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-amber-500`} />
      </div>
      {label && (
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
};
