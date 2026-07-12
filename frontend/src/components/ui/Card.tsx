import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-slate-200 bg-white text-slate-950 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';
