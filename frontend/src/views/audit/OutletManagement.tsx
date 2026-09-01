import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, RefreshCw, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, dataTableHelper } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getApiUrl } from '@/lib/api';

interface Outlet {
  id: string;
  name: string;
  device_code?: string;
  device_name?: string;
  address?: string;
  status: 'active' | 'inactive';
}

const column = dataTableHelper<Outlet>();

const columns = column.columns([
  column.accessor('name', {
    header: 'Nama Outlet',
    cell: ({ getValue }) => <span className="font-bold text-slate-800">{getValue()}</span>,
  }),
  column.accessor('device_code', {
    header: 'Kode Perangkat (HRIS)',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-slate-500 font-semibold">{getValue() || '-'}</span>
    ),
  }),
  column.accessor('device_name', {
    header: 'Nama Perangkat',
    enableSorting: false,
    cell: ({ getValue }) => <span className="text-slate-600">{getValue() || '-'}</span>,
  }),
  column.accessor('address', {
    header: 'Alamat',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-xs text-slate-500 max-w-[280px] block truncate">
        {getValue() || '-'}
      </span>
    ),
  }),
  column.accessor('status', {
    header: 'Status',
    meta: { align: 'center' },
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
]);

export const OutletManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: outlets = [], isLoading } = useQuery<Outlet[]>({
    queryKey: ['outlets'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/audit/outlets'));
      if (!res.ok) throw new Error('Failed to load outlets');
      return res.json();
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl('/audit/outlets/sync-hris'), {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal sinkronisasi Outlet HRIS.');
      }
      return data;
    },
    onSuccess: (data) => {
      alert(data.message || 'Sinkronisasi Outlet HRIS selesai!');
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Gagal menghubungi Backend NestJS atau Server HRIS.');
    },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Manajemen Outlet"
        subtitle="Kelola data outlet (toko) yang terintegrasi dari HRIS"
        icon={<Store className="w-7 h-7" />}
        actions={
          <>
            <Button
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center gap-2 shadow-sm"
            >
              {syncMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Sync dari HRIS
            </Button>
            <Button
              variant="outline"
              className="font-bold flex items-center gap-2 border-slate-200"
            >
              <Plus className="w-4 h-4" /> Tambah Manual
            </Button>
          </>
        }
      />

      {/* Reusable Data Table */}
      <DataTable
        data={outlets}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari nama toko, kode perangkat, atau alamat..."
        emptyMessage="Belum ada data outlet. Klik 'Sync dari HRIS' untuk menyedot data terbaru."
      />
    </div>
  );
};
