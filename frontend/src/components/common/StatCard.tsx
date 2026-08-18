import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <Card
      onClick={onClick}
      className={`rounded-2xl border-slate-200 shadow-sm transition-all duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-[#419CC3]' : ''
      } ${className}`}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="mt-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-[#419CC3]/10 text-[#419CC3] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
