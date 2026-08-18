import React from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);

export interface LineDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  tension?: number;
  fill?: boolean;
}

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  labels: string[];
  datasets: LineDataset[];
  height?: number | string;
  showLegend?: boolean;
  className?: string;
}

export const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  subtitle,
  icon,
  labels,
  datasets,
  height = 240,
  showLegend = true,
  className = '',
}) => {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor || '#419CC3',
      backgroundColor: ds.backgroundColor || '#419CC3',
      tension: ds.tension ?? 0.35,
      pointRadius: 3,
      pointHoverRadius: 5,
    })),
  };

  const options = {
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
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
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
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
