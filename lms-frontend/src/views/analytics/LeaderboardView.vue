<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

const users = ref([]);
const loading = ref(false);
const searchQuery = ref('');

// Edit XP Modal
const showDialog = ref(false);
const editData = ref({
  hris_user_id: '',
  full_name: '',
  new_xp: 0,
  reason: ''
});

const fetchLeaderboard = async () => {
  loading.value = true;
  try {
    const url = new URL('http://localhost:3001/api/gamification/leaderboard');
    if (searchQuery.value) {
      url.searchParams.append('search', searchQuery.value);
    }
    const res = await fetch(url.toString());
    if (res.ok) {
      users.value = await res.json();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getRankSeverity = (rank: string) => {
  if (rank === 'Pakar SobatHR') return 'danger';
  if (rank === 'Master Pengetahuan') return 'warning';
  if (rank === 'Karyawan Terampil') return 'info';
  if (rank === 'Pembelajar Aktif') return 'success';
  return 'secondary';
};

const openEditModal = (user: any) => {
  editData.value = {
    hris_user_id: user.hris_user_id,
    full_name: user.full_name,
    new_xp: user.total_xp,
    reason: ''
  };
  showDialog.value = true;
};

const saveXp = async () => {
  if (!editData.value.reason) return alert('Alasan perubahan XP wajib diisi untuk Audit Trail.');
  
  try {
    const res = await fetch('http://localhost:3001/api/gamification/adjust-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hris_user_id: editData.value.hris_user_id,
        new_xp: Number(editData.value.new_xp),
        reason: editData.value.reason
      })
    });
    
    if (res.ok) {
      alert('XP berhasil diubah!');
      showDialog.value = false;
      fetchLeaderboard();
    } else {
      alert('Gagal merubah XP');
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan');
  }
};

let debounceTimer: any;
const onSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchLeaderboard();
  }, 500);
};

onMounted(() => {
  fetchLeaderboard();
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto p-6 md:p-8">
      <div class="max-w-6xl mx-auto space-y-6">
        
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">Papan Peringkat (Leaderboard)</h1>
            <p class="text-slate-500 mt-1">Pantau total XP dan Rank Gamifikasi seluruh karyawan.</p>
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="searchQuery" @input="onSearch" placeholder="Cari ID atau Nama..." class="w-64" />
          </span>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <DataTable :value="users" :loading="loading" paginator :rows="10" 
            class="p-datatable-sm" 
            rowHover>
            <template #empty>Belum ada data</template>
            
            <Column header="Peringkat" style="width: 80px">
              <template #body="{ index }">
                <span class="font-bold text-gray-400">#{{ index + 1 }}</span>
              </template>
            </Column>
            <Column field="hris_user_id" header="ID Karyawan"></Column>
            <Column field="full_name" header="Nama Karyawan">
              <template #body="{ data }">
                <span class="font-bold text-slate-700">{{ data.full_name }}</span>
              </template>
            </Column>
            <Column field="current_rank" header="Pangkat (Rank)">
              <template #body="{ data }">
                <Tag :value="data.current_rank" :severity="getRankSeverity(data.current_rank)" class="font-bold" />
              </template>
            </Column>
            <Column field="total_xp" header="Total XP" sortable>
              <template #body="{ data }">
                <span class="font-extrabold text-[#419CC3]">{{ data.total_xp }} XP</span>
              </template>
            </Column>
            <Column field="quizzes_completed" header="Kuis Selesai" sortable></Column>
            <Column header="Aksi" style="width: 120px">
              <template #body="{ data }">
                <Button icon="pi pi-pencil" text rounded severity="secondary" @click="openEditModal(data)" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </main>
  </div>

  <Dialog v-model:visible="showDialog" header="Penyesuaian XP Manual" :modal="true" class="w-[450px]">
    <div class="space-y-4 pt-4">
      <div class="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs font-medium flex items-start gap-2">
        <i class="pi pi-info-circle mt-0.5"></i>
        <span>Pengubahan XP manual akan mencatat Log Audit Trail. Pastikan Anda memiliki alasan yang jelas.</span>
      </div>
      
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700">Karyawan</label>
        <InputText :value="editData.full_name" disabled class="bg-gray-100" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700">Total XP Baru</label>
        <InputText v-model="editData.new_xp" type="number" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700">Alasan Perubahan (Audit Trail) <span class="text-red-500">*</span></label>
        <Textarea v-model="editData.reason" rows="3" placeholder="Contoh: Kesalahan sistem kuis pada tgl 12 Agustus" />
      </div>
    </div>
    <template #footer>
      <Button label="Batal" icon="pi pi-times" @click="showDialog = false" text />
      <Button label="Simpan Perubahan" icon="pi pi-check" @click="saveXp" severity="danger" />
    </template>
  </Dialog>
</template>
