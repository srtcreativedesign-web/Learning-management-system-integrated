<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';

const router = useRouter();

const materials = ref([]);
const searchQuery = ref('');
const syncing = ref(false);
const loading = ref(false);

const showDialog = ref(false);
const isEdit = ref(false);
const currentId = ref('');
const formData = ref({
  title: '',
  description: '',
  type: 'PDF',
  thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
  reward_points: 0,
});
const uploadedFileUrl = ref('');

const fetchMaterials = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/lms/courses');
    if (res.ok) {
      materials.value = await res.json();
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEdit.value = false;
  currentId.value = '';
  formData.value = {
    title: '',
    description: '',
    type: 'PDF',
    thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
    reward_points: 100,
  };
  uploadedFileUrl.value = '';
  showDialog.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  currentId.value = item.id;
  formData.value = {
    title: item.title,
    description: item.description,
    type: item.Materials?.[0]?.type || 'PDF',
    thumbnail_url: item.thumbnail_url,
    reward_points: item.reward_points || 0,
  };
  uploadedFileUrl.value = item.Materials?.[0]?.content_url || '';
  showDialog.value = true;
};

const onUpload = async (event: any) => {
  const res = JSON.parse(event.xhr.response);
  if (res && res.success) {
    uploadedFileUrl.value = res.url;
    alert('File berhasil diunggah!');
  }
};

const saveMaterial = async () => {
  if (!formData.value.title) return alert('Judul wajib diisi');
  if (!isEdit.value && !uploadedFileUrl.value) return alert('Silakan pilih dan unggah file materi (PDF/Video) terlebih dahulu!');

  const payload = {
    title: formData.value.title,
    description: formData.value.description,
    thumbnail_url: formData.value.thumbnail_url,
    reward_points: Number(formData.value.reward_points),
    materials: uploadedFileUrl.value ? [
      { type: formData.value.type, content_url: uploadedFileUrl.value, min_read_time: 0 }
    ] : undefined
  };

  try {
    const url = isEdit.value 
      ? `http://localhost:3000/lms/courses/${currentId.value}`
      : 'http://localhost:3000/lms/courses';
      
    const method = isEdit.value ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(isEdit.value ? 'Berhasil diperbarui' : 'Berhasil ditambahkan');
      showDialog.value = false;
      fetchMaterials();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menyimpan');
  }
};

const syncMaterials = async () => {
  syncing.value = true;
  setTimeout(() => {
    syncing.value = false;
    alert('Sinkronisasi HRIS selesai. (Mobile app HRIS dapat mengambil data terbaru dari backend LMS ini)');
  }, 1000);
};

onMounted(() => {
  fetchMaterials();
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-[#419CC3]/5 to-transparent pointer-events-none"></div>
          <div class="relative z-10">
            <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              Pustaka Materi
            </h1>
            <p class="text-slate-500 mt-1 font-medium">Kelola modul PDF, Video, dan Kuis. Tersinkronisasi dengan HRIS.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span class="p-input-icon-left flex-1 md:flex-none">
              <i class="pi pi-search" />
              <InputText v-model="searchQuery" placeholder="Cari materi..." class="w-full md:w-64" />
            </span>
            <Button @click="syncMaterials" :loading="syncing" icon="pi pi-cloud-download" label="Sync HRIS" severity="info" />
            <Button @click="openCreateModal" icon="pi pi-plus" label="Buat Baru" severity="primary" />
          </div>
        </div>

        <!-- Grid of Materials -->
        <div v-if="loading" class="text-center py-10"><i class="pi pi-spin pi-spinner text-3xl text-primary"></i></div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card v-for="item in materials" :key="item.id" class="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(65,156,195,0.15)] transition-all duration-500 rounded-2xl bg-white group hover:-translate-y-1">
            <template #header>
              <div class="h-48 overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img :src="item.thumbnail_url" :alt="item.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute top-4 right-4 z-20">
                  <Tag :value="item.Materials?.[0]?.type || 'N/A'" severity="secondary" class="shadow-lg font-bold bg-white/90 text-slate-800 backdrop-blur-md px-3 py-1 rounded-full" />
                </div>
              </div>
            </template>
            <template #title>
              <div class="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-[#419CC3] transition-colors" :title="item.title">
                {{ item.title }}
              </div>
            </template>
            <template #subtitle>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs font-bold text-[#419CC3] bg-[#419CC3]/10 px-3 py-1 rounded-full">{{ item.description || 'Umum' }}</span>
              </div>
            </template>
            <template #content>
              <div class="flex justify-between items-center mt-3 border-t border-slate-100 pt-4">
                <span class="text-xs text-slate-500 font-bold flex items-center gap-1"><i class="pi pi-star-fill text-yellow-400"></i> {{ item.reward_points }} Poin</span>
                <Tag v-if="item.Materials?.length" value="published" severity="info" class="rounded-full px-3" />
                <Tag v-else value="draft" severity="warning" class="rounded-full px-3" />
              </div>
            </template>
            <template #footer>
              <div class="flex flex-col gap-3 mt-2">
                <Button v-if="!item.Materials?.[0]?.Quiz" @click="router.push(`/library/generate-quiz?courseId=${item.id}`)" icon="pi pi-bolt" label="Generate Kuis Cepat" severity="info" class="w-full text-sm font-bold shadow-md shadow-[#419CC3]/20" />
                <div class="flex gap-2">
                  <Button @click="router.push(`/library/course/${item.id}`)" icon="pi pi-eye" label="Lihat Detail" severity="primary" class="flex-1 font-bold shadow-md shadow-[#419CC3]/20" />
                  <Button @click="openEditModal(item)" icon="pi pi-pencil" label="Edit" severity="secondary" class="flex-1 font-bold" outlined />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-if="materials.length === 0 && !loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <i class="pi pi-folder-open text-3xl text-gray-400"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Belum ada materi</h3>
          <p class="text-gray-500 max-w-md mx-auto mt-2">Klik tombol "Buat Baru" untuk mengunggah PDF/Video Pelatihan.</p>
        </div>

      </div>
    </main>
  </div>

  <!-- Dialog for Create / Edit -->
  <Dialog v-model:visible="showDialog" :header="isEdit ? 'Edit Materi' : 'Buat Materi Baru'" :modal="true" class="w-full max-w-md">
    <div class="space-y-4 pt-2">
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700 uppercase">Judul Course</label>
        <InputText v-model="formData.title" placeholder="Contoh: Pengenalan Kasir" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700 uppercase">Kategori / Deskripsi</label>
        <Textarea v-model="formData.description" rows="2" placeholder="Deskripsi materi..." />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700 uppercase">Tipe File</label>
        <InputText v-model="formData.type" placeholder="PDF / VIDEO" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700 uppercase">Poin Reward Penyelesaian</label>
        <InputText v-model="formData.reward_points" type="number" />
      </div>
      
      <div class="flex flex-col gap-1">
        <label class="font-bold text-xs text-gray-700 uppercase">Upload File Materi (Opsional)</label>
        <FileUpload 
          mode="basic" 
          name="file" 
          url="http://localhost:3000/lms/courses/upload" 
          accept="application/pdf,video/*" 
          auto
          @upload="onUpload" 
          chooseLabel="Pilih & Unggah File" 
          class="w-full"
        />
        <div v-if="uploadedFileUrl" class="text-xs text-[#419CC3] font-bold mt-1 flex items-center gap-1">
          <i class="pi pi-file-check"></i> File berhasil dipilih dan terlampir: {{ uploadedFileUrl.split('/').pop() }}
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button label="Batal" icon="pi pi-times" @click="showDialog = false" text />
      <Button label="Simpan" icon="pi pi-check" @click="saveMaterial" severity="primary" />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-card-body) {
  padding: 1.25rem;
}
:deep(.p-card-content) {
  padding: 0;
}
</style>
