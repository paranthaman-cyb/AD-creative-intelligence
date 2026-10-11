import React from 'react';
import { cn } from '../../lib/utils';
import { EvidenceStatus } from '../../types';
import { CheckCircle2, HelpCircle, AlertCircle, MinusCircle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: EvidenceStatus;
  variant?: 'default' | 'outline' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant = 'default',
  className,
  children,
  ...props
}) => {
  if (status) {
    const statusConfig: Record<EvidenceStatus, { text: string; bg: string; color: string; icon: React.ReactNode }> = {
      supported: {
        text: 'Supported',
        bg: 'bg-status-successBg',
        color: 'text-status-success',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      },
      inconclusive: {
        text: 'Inconclusive',
        bg: 'bg-status-warningBg',
        color: 'text-status-warning',
        icon: <HelpCircle className="w-3.5 h-3.5" />,
      },
      underpowered: {
        text: 'Underpowered',
        bg: 'bg-brand-100',
        color: 'text-brand-700',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
      },
      not_available: {
        text: 'Not Available',
        bg: 'bg-gray-100',
        color: 'text-app-muted',
        icon: <MinusCircle className="w-3.5 h-3.5" />,
      },
    };

    const cfg = statusConfig[status] || statusConfig.not_available;

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none border border-transparent whitespace-nowrap shrink-0',
          cfg.bg,
          cfg.color,
          className
        )}
        {...props}
      >
        {cfg.icon}
        <span>{children || cfg.text}</span>
      </span>
    );
  }

  const variants = {
    default: 'bg-lavender-100 text-app-text',
    outline: 'border border-app-border text-app-muted bg-transparent',
    purple: 'bg-brand-100 text-brand-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
