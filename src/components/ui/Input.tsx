import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-app-text mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2 text-sm bg-white border border-app-border rounded-lg text-app-text placeholder:text-app-muted/60',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all',
            error && 'border-status-error focus:ring-status-error',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-status-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-app-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
