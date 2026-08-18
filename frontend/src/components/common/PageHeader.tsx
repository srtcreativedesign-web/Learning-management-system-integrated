import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  backUrl?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  backUrl,
  onBack,
  actions,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const showBack = Boolean(backUrl || onBack);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-start gap-4">
        {showBack && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="rounded-full shrink-0 border-slate-200 hover:bg-slate-50 mt-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Button>
        )}

        <div>
          {badge && <div className="mb-2">{badge}</div>}
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            {icon && <span className="text-[#419CC3]">{icon}</span>}
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">{actions}</div>}
    </div>
  );
};
