<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const employees = ref([]);
const loading = ref(false);
const syncing = ref(false);

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/sync/employees');
    if (res.ok) {
      employees.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    loading.value = false;
  }
};

const syncHRIS = async () => {
  syncing.value = true;
  try {
    const res = await fetch('http://localhost:3000/sync/employees/sync-hris', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      alert(data.message);
      await fetchEmployees();
    } else {
      alert(data.message || 'Gagal sinkronisasi Karyawan HRIS.');
    }
  } catch (error) {
    console.error('Error syncing:', error);
    alert('Tidak dapat terhubung ke Backend NestJS atau Backend gagal menghubungi Server HRIS (Pastikan Server HRIS berjalan).');
  } finally {
    syncing.value = false;
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Manajemen Karyawan</h1>
            <p class="text-gray-500 mt-1">Kelola data karyawan yang disinkronisasi otomatis dari HRIS</p>
          </div>
          <div class="flex gap-2">
            <Button 
              @click="syncHRIS" 
              :loading="syncing" 
              icon="pi pi-sync" 
              label="Sync Karyawan dari HRIS" 
              severity="info" 
            />
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DataTable :value="employees" :loading="loading" paginator :rows="10" 
                     dataKey="id" class="p-datatable-sm" 
                     emptyMessage="Belum ada data karyawan. Klik 'Sync Karyawan dari HRIS' untuk menarik data.">
            
            <Column field="hris_user_id" header="ID (HRIS)" sortable></Column>
            <Column field="full_name" header="Nama Karyawan" sortable></Column>
            <Column field="email" header="Email"></Column>
          </DataTable>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}
</style>
