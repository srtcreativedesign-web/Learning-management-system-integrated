import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-md mt-1 leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button
            onClick={onAction}
            className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold shadow-sm"
          >
            {actionIcon && <span className="mr-2">{actionIcon}</span>}
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
