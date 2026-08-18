import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { getApiUrl } from '@/lib/api';

interface Employee {
  id: string;
  hris_user_id: string;
  full_name: string;
  email: string;
  join_date?: string;
}

export const EmployeeManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/sync/employees'));
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl('/sync/employees/sync-hris'), {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal sinkronisasi Karyawan HRIS.');
      }
      return data;
    },
    onSuccess: (data) => {
      alert(data.message || 'Sinkronisasi berhasil!');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Tidak dapat terhubung ke Backend NestJS atau Server HRIS.');
    },
  });

  const columns: ColumnDef<Employee>[] = [
    {
      key: 'hris_user_id',
      header: 'ID (HRIS)',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-500 font-semibold">
          {row.hris_user_id}
        </span>
      ),
    },
    {
      key: 'full_name',
      header: 'Nama Karyawan',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-800">{row.full_name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="text-slate-600">{row.email || '-'}</span>,
    },
    {
      key: 'join_date',
      header: 'Tanggal Bergabung',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {row.join_date
            ? new Date(row.join_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Manajemen Karyawan"
        subtitle="Kelola data karyawan yang disinkronisasi otomatis dari HRIS"
        icon={<Users className="w-7 h-7" />}
        actions={
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
            Sync Karyawan dari HRIS
          </Button>
        }
      />

      {/* Reusable Data Table */}
      <DataTable
        data={employees}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari ID, nama, atau email karyawan..."
        emptyMessage="Belum ada data karyawan. Klik 'Sync Karyawan dari HRIS' untuk menarik data."
      />
    </div>
  );
};
