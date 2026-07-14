<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto bg-gray-50/50">
      
      <!-- Top Mobile Nav (Hidden on Desktop) -->
      <div class="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <h1 class="font-bold text-primary">TND SYSTEM</h1>
        <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">B</div>
      </div>

      <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl font-bold text-gray-800">Manajemen SOP (Admin)</h1>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl">
          <form @submit.prevent="uploadSop" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul SOP</label>
              <InputText v-model="form.title" class="w-full rounded-lg" placeholder="Contoh: SOP Kasir Outlet" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <Select v-model="form.category" :options="categories" optionLabel="label" optionValue="value" placeholder="Pilih Kategori" class="w-full rounded-lg" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">File PDF SOP</label>
              <input type="file" ref="fileInput" accept="application/pdf" class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-[#89B4E1] file:text-white
                hover:file:brightness-95 cursor-pointer
              " required />
              <p class="text-xs text-gray-500 mt-2">Sistem AI akan mengekstrak panduan dari PDF ini secara otomatis.</p>
            </div>

            <div class="pt-4 border-t border-gray-100">
              <Button type="submit" :loading="isUploading" label="Upload & Ekstrak AI" icon="pi pi-sparkles" class="w-full bg-primary border-primary rounded-lg text-white font-bold py-3" />
            </div>
          </form>

          <div v-if="uploadSuccess" class="mt-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center gap-3">
            <i class="pi pi-check-circle text-xl"></i>
            <div>
              <h3 class="font-bold">Berhasil Diunggah!</h3>
              <p class="text-sm">SOP telah diekstrak oleh AI dan siap dibaca oleh tim.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const form = ref({
  title: '',
  category: ''
});

const categories = [
  { label: 'Head Office', value: 'HEAD_OFFICE' },
  { label: 'Operasional (Outlet)', value: 'OPERASIONAL' }
];

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const uploadSuccess = ref(false);

const uploadSop = async () => {
  const file = fileInput.value?.files?.[0];
  if (!file) return;

  isUploading.value = true;
  uploadSuccess.value = false;

  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('category', form.value.category);
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:3001/api/sop/upload', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      uploadSuccess.value = true;
      form.value.title = '';
      form.value.category = '';
      if (fileInput.value) fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Gagal mengunggah SOP.');
  } finally {
    isUploading.value = false;
  }
};
</script>
