<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const outlets = ref([]);
const loading = ref(false);
const syncing = ref(false);

const fetchOutlets = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/audit/outlets');
    if (res.ok) {
      outlets.value = await res.json();
    }
  } catch (error) {
    console.error('Error fetching outlets:', error);
  } finally {
    loading.value = false;
  }
};

const syncHRIS = async () => {
  syncing.value = true;
  try {
    const res = await fetch('http://localhost:3000/audit/outlets/sync-hris', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      alert(data.message);
      await fetchOutlets();
    } else {
      alert(data.message || 'Gagal sinkronisasi HRIS.');
    }
  } catch (error) {
    console.error('Error syncing:', error);
    alert('Tidak dapat terhubung ke Backend NestJS atau Backend gagal menghubungi Server HRIS (Pastikan Server HRIS berjalan di Port 8000).');
  } finally {
    syncing.value = false;
  }
};

onMounted(() => {
  fetchOutlets();
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
            <h1 class="text-2xl font-bold text-gray-800">Manajemen Outlet</h1>
            <p class="text-gray-500 mt-1">Kelola data outlet (toko) yang terintegrasi dari HRIS</p>
          </div>
          <div class="flex gap-2">
            <Button 
              @click="syncHRIS" 
              :loading="syncing" 
              icon="pi pi-sync" 
              label="Sync dari HRIS" 
              severity="info" 
            />
            <Button 
              icon="pi pi-plus" 
              label="Tambah Manual" 
              severity="primary" 
              outlined
            />
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DataTable :value="outlets" :loading="loading" paginator :rows="10" 
                     dataKey="id" class="p-datatable-sm" 
                     emptyMessage="Belum ada data outlet. Klik 'Sync dari HRIS' untuk menyedot data terbaru.">
            
            <Column field="name" header="Nama Outlet" sortable></Column>
            <Column field="device_code" header="Kode Perangkat (HRIS)" sortable></Column>
            <Column field="device_name" header="Nama Perangkat"></Column>
            <Column field="address" header="Alamat" style="max-width: 300px; white-space: normal;">
              <template #body="{ data }">
                <span class="text-xs text-gray-600">{{ data.address || '-' }}</span>
              </template>
            </Column>
            <Column header="Status">
              <template #body="{ data }">
                <Tag :severity="data.status === 'active' ? 'success' : 'danger'" 
                     :value="data.status === 'active' ? 'Aktif' : 'Non-aktif'" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Optional styling overrides for PrimeVue */
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
