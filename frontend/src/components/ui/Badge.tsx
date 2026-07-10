import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
      secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      outline: 'text-slate-800 border border-slate-300 dark:text-slate-300 dark:border-slate-700',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
