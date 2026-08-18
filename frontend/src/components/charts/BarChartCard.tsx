import React from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export interface BarDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderRadius?: number;
  barPercentage?: number;
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  labels: string[];
  datasets: BarDataset[];
  height?: number | string;
  horizontal?: boolean;
  showLegend?: boolean;
  maxY?: number;
  className?: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  subtitle,
  icon,
  labels,
  datasets,
  height = 240,
  horizontal = false,
  showLegend = true,
  maxY,
  className = '',
}) => {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderRadius: ds.borderRadius ?? 4,
    })),
  };

  const options = {
    indexAxis: (horizontal ? 'y' : 'x') as 'y' | 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'Inter' },
        },
      },
    },
    scales: horizontal
      ? {
          x: { beginAtZero: true, max: maxY },
          y: { grid: { display: false } },
        }
      : {
          y: { beginAtZero: true, max: maxY },
          x: { grid: { display: false } },
        },
  };

  return (
    <Card className={`rounded-2xl border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/40">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          {icon && <span className="text-[#419CC3]">{icon}</span>}
          <span>{title}</span>
        </CardTitle>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </CardHeader>
      <CardContent className="p-5">
        <div style={{ height }}>
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
