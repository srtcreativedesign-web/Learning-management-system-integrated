<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const attempts = ref([]);
const loading = ref(false);
const showDetail = ref(false);
const selectedAttempt = ref<any>(null);

const fetchAttempts = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3001/quizzes/attempts');
    if (res.ok) {
      attempts.value = await res.json();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const viewDetails = (data: any) => {
  selectedAttempt.value = data;
  showDetail.value = true;
};

onMounted(() => {
  fetchAttempts();
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto p-6 md:p-8">
      <div class="max-w-7xl mx-auto space-y-6">
        
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">Riwayat Pengerjaan Kuis</h1>
            <p class="text-slate-500 mt-1">Lacak performa belajar, skor, dan evaluasi soal tiap karyawan.</p>
          </div>
          <Button icon="pi pi-refresh" label="Muat Ulang" @click="fetchAttempts" :loading="loading" severity="secondary" outlined />
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <DataTable :value="attempts" :loading="loading" paginator :rows="10" class="p-datatable-sm" rowHover>
            <template #empty>Belum ada data pengerjaan kuis.</template>
            
            <Column field="User.full_name" header="Karyawan">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700">{{ data.User?.full_name || 'Unknown' }}</span>
                  <span class="text-xs text-gray-500">{{ data.User?.hris_user_id }}</span>
                </div>
              </template>
            </Column>
            <Column field="Quiz.Material.Course.title" header="Materi / Kursus"></Column>
            <Column field="score" header="Skor" sortable>
              <template #body="{ data }">
                <span class="font-bold" :class="data.is_passed ? 'text-green-600' : 'text-red-500'">
                  {{ data.score.toFixed(0) }} / 100
                </span>
              </template>
            </Column>
            <Column field="xp_awarded" header="XP Didapat" sortable>
              <template #body="{ data }">
                <span class="font-bold text-[#419CC3]">+{{ data.xp_awarded }}</span>
              </template>
            </Column>
            <Column field="is_passed" header="Status">
              <template #body="{ data }">
                <Tag :value="data.is_passed ? 'Lulus' : 'Gagal'" :severity="data.is_passed ? 'success' : 'danger'" />
              </template>
            </Column>
            <Column field="created_at" header="Tanggal" sortable>
              <template #body="{ data }">
                {{ formatDate(data.created_at) }}
              </template>
            </Column>
            <Column header="Evaluasi" style="width: 100px; text-align: center">
              <template #body="{ data }">
                <Button icon="pi pi-search" class="p-button-rounded p-button-text p-button-sm" @click="viewDetails(data)" v-tooltip="'Lihat Detail Jawaban'" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </main>
  </div>

  <Dialog v-model:visible="showDetail" header="Evaluasi Jawaban Kuis" :modal="true" :style="{ width: '50vw' }" breakpoints="{'960px': '75vw', '640px': '95vw'}">
    <div v-if="selectedAttempt" class="space-y-6 pt-4">
      
      <!-- Summary Card -->
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-500">Karyawan</p>
          <p class="font-bold text-slate-800">{{ selectedAttempt.User?.full_name }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-500">Skor Akhir</p>
          <p class="font-extrabold text-2xl" :class="selectedAttempt.is_passed ? 'text-green-600' : 'text-red-500'">
            {{ selectedAttempt.score.toFixed(0) }}
          </p>
        </div>
      </div>

      <!-- Answers List -->
      <div v-if="selectedAttempt.answers_detail && selectedAttempt.answers_detail.length > 0" class="space-y-4">
        <h3 class="font-bold text-slate-800 border-b pb-2">Detail Soal & Jawaban</h3>
        
        <div v-for="(ans, idx) in selectedAttempt.answers_detail" :key="idx" 
             class="p-4 rounded-lg border border-l-4"
             :class="ans.is_correct ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'">
          
          <div class="flex items-start gap-3">
            <div class="mt-0.5">
              <i v-if="ans.is_correct" class="pi pi-check-circle text-green-500 text-lg"></i>
              <i v-else class="pi pi-times-circle text-red-500 text-lg"></i>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-slate-800 mb-2">{{ idx + 1 }}. {{ ans.question_text }}</p>
              
              <div class="space-y-1.5 mt-3">
                <div v-for="opt in ans.options" :key="opt.id" 
                     class="text-sm flex items-center gap-2 p-2 rounded-md"
                     :class="{
                       'bg-green-100/50 text-green-800 border border-green-200': opt.is_correct,
                       'bg-red-100/50 text-red-800 border border-red-200': !opt.is_correct && ans.user_selected_ids.includes(opt.id),
                       'text-slate-600': !opt.is_correct && !ans.user_selected_ids.includes(opt.id)
                     }">
                  
                  <i v-if="opt.is_correct" class="pi pi-check text-green-600 text-xs"></i>
                  <i v-else-if="ans.user_selected_ids.includes(opt.id)" class="pi pi-times text-red-600 text-xs"></i>
                  <i v-else class="pi pi-circle-fill text-[8px] text-slate-300"></i>
                  
                  <span :class="{'font-bold': opt.is_correct || ans.user_selected_ids.includes(opt.id)}">{{ opt.text }}</span>
                  
                  <span v-if="ans.user_selected_ids.includes(opt.id)" class="ml-auto text-[10px] font-bold tracking-wider uppercase opacity-60">Jawaban User</span>
                  <span v-if="opt.is_correct && !ans.user_selected_ids.includes(opt.id)" class="ml-auto text-[10px] font-bold tracking-wider uppercase opacity-60">Kunci Jawaban</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Detail jawaban tidak direkam untuk kuis ini (data lama).
      </div>
    </div>
  </Dialog>
</template>
