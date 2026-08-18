import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'passed'
  | 'failed'
  | 'published'
  | 'draft'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normalized = status?.toLowerCase();

  let text = label || status;
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'active' || normalized === 'aktif') {
    text = label || 'Aktif';
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (normalized === 'inactive' || normalized === 'non-aktif') {
    text = label || 'Non-aktif';
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
  } else if (normalized === 'passed' || normalized === 'lulus' || normalized === 'success') {
    text = label || 'Lulus';
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
  } else if (normalized === 'failed' || normalized === 'gagal' || normalized === 'danger') {
    text = label || 'Gagal';
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
  } else if (normalized === 'published') {
    text = label || 'Published';
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (normalized === 'draft' || normalized === 'warning') {
    text = label || 'Draft';
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
  } else if (normalized === 'pakar sobathr') {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
  } else if (normalized === 'master pengetahuan') {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
  } else if (normalized === 'karyawan terampil' || normalized === 'info') {
    colorStyles = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
  } else if (normalized === 'pembelajar aktif') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
  }

  return (
    <Badge variant="outline" className={cn('px-2.5 py-0.5 text-xs', colorStyles, className)}>
      {text}
    </Badge>
  );
};
