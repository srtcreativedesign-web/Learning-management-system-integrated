<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const categories = ref<any[]>([]);
const isLoading = ref(true);

const fetchChecklists = async () => {
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:3000/audit/checklist');
    const data = await res.json();
    if (data.success) {
      categories.value = data.data;
    }
  } catch (error) {
    console.error('Failed to load checklists', error);
  } finally {
    isLoading.value = false;
  }
};

const saveChecklists = async () => {
  try {
    const res = await fetch('http://localhost:3000/audit/checklist/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: categories.value })
    });
    const data = await res.json();
    if (data.success) {
      alert('Berhasil menyimpan checklist!');
      categories.value = data.data; // update with true IDs from DB
    }
  } catch (error) {
    console.error('Failed to save', error);
    alert('Gagal menyimpan checklist');
  }
};

const addCategory = () => {
  categories.value.push({
    name: 'Kategori Baru',
    checklists: []
  });
};

const removeCategory = (index: number) => {
  if (confirm('Yakin ingin menghapus kategori ini?')) {
    categories.value.splice(index, 1);
  }
};

const addPoint = (catIndex: number) => {
  if (!categories.value[catIndex].checklists) {
    categories.value[catIndex].checklists = [];
  }
  categories.value[catIndex].checklists.push({
    question: 'Pertanyaan Baru'
  });
};

const removePoint = (catIndex: number, pointIndex: number) => {
  categories.value[catIndex].checklists.splice(pointIndex, 1);
};

onMounted(fetchChecklists);
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 class="font-bold text-gray-800 text-xl">Kriteria Checklist Audit</h1>
          <p class="text-xs text-gray-500">Atur kategori dan poin pemeriksaan untuk inspeksi lapangan</p>
        </div>
        <Button label="Simpan Perubahan" icon="pi pi-save" @click="saveChecklists" />
      </header>
      
      <div class="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div v-if="isLoading" class="text-center p-12 text-gray-500">
          <i class="pi pi-spin pi-spinner text-4xl mb-4 text-primary"></i>
          <p>Memuat data checklist...</p>
        </div>
        <div v-else class="space-y-6">
          
          <div v-if="categories.length === 0" class="text-center p-12 bg-white border border-dashed border-gray-300 rounded-lg">
            <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
            <p class="text-gray-500 mb-4">Belum ada kriteria checklist yang dibuat.</p>
            <Button label="Buat Kategori Pertama" icon="pi pi-plus" @click="addCategory" />
          </div>

          <div v-for="(cat, cIdx) in categories" :key="cIdx" class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-4">
              <i class="pi pi-bars text-gray-400 cursor-move"></i>
              <InputText v-model="cat.name" class="font-bold flex-1" placeholder="Nama Kategori (Contoh: Kebersihan Area Kasir)" />
              <Button icon="pi pi-trash" severity="danger" text @click="removeCategory(cIdx)" />
            </div>
            
            <div class="p-4 space-y-3">
              <div v-if="!cat.checklists || cat.checklists.length === 0" class="text-sm text-gray-400 italic">
                Belum ada poin pemeriksaan di kategori ini.
              </div>
              
              <div v-for="(point, pIdx) in cat.checklists" :key="pIdx" class="flex items-center gap-3">
                <i class="pi pi-list text-gray-300 cursor-move text-xs"></i>
                <InputText v-model="point.question" class="flex-1" placeholder="Contoh: Lantai bersih dan bebas sampah" />
                <Button icon="pi pi-times" severity="danger" text rounded @click="removePoint(cIdx, pIdx)" />
              </div>
              
              <Button label="Tambah Poin" icon="pi pi-plus" size="small" outlined class="mt-2" @click="addPoint(cIdx)" />
            </div>
          </div>
          
          <div v-if="categories.length > 0" class="text-center pt-4">
            <Button label="Tambah Kategori Baru" icon="pi pi-plus-circle" severity="secondary" @click="addCategory" />
          </div>
          
        </div>
      </div>
    </main>
  </div>
</template>
