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
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Pustaka SOP</h1>
          <p class="text-gray-500">Standar Operasional Prosedur Perusahaan</p>
        </div>

        <!-- Filter Kategori -->
        <div class="flex justify-center gap-4 mb-8">
          <button 
            @click="activeCategory = 'HEAD_OFFICE'"
            :class="activeCategory === 'HEAD_OFFICE' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            class="px-6 py-2 rounded-lg font-bold transition-colors duration-200"
          >
            Head Office
          </button>
          <button 
            @click="activeCategory = 'OPERASIONAL'"
            :class="activeCategory === 'OPERASIONAL' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            class="px-6 py-2 rounded-lg font-bold transition-colors duration-200"
          >
            Operasional Outlet
          </button>
        </div>

        <!-- Daftar SOP -->
        <div v-if="!selectedSop" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="sop in filteredSops" 
            :key="sop.id"
            @click="openSop(sop.id)"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-[#89B4E1] transition-all duration-200 group"
          >
            <div class="w-12 h-12 rounded-lg bg-[#89B4E1]/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i class="pi pi-book text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ sop.title }}</h3>
            <p class="text-sm text-gray-500">{{ sop._count.Points }} Langkah Prosedur</p>
          </div>
          <div v-if="filteredSops.length === 0" class="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            Belum ada dokumen SOP di kategori ini.
          </div>
        </div>

        <!-- Baca SOP (Native UI) -->
        <div v-else class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <button @click="selectedSop = null" class="text-gray-500 hover:text-primary mb-6 flex items-center gap-2 transition-colors">
            <i class="pi pi-arrow-left"></i> Kembali ke Daftar
          </button>

          <h2 class="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">{{ selectedSopDetails?.title }}</h2>

          <div v-if="loadingDetails" class="text-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
            <p class="mt-4 text-gray-500">Memuat detail prosedur...</p>
          </div>

          <div v-else class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#89B4E1] before:to-transparent">
            <div 
              v-for="(point, index) in selectedSopDetails?.Points" 
              :key="point.id"
              class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <!-- Timeline Marker -->
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                {{ index + 1 }}
              </div>
              
              <!-- Card Content -->
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#89B4E1] transition-all">
                <h4 class="text-lg font-bold text-gray-800 mb-2">{{ point.title }}</h4>
                <p class="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{{ point.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-12 text-center" v-if="selectedSopDetails?.source_pdf">
            <a :href="`http://localhost:3001${selectedSopDetails.source_pdf}`" target="_blank" class="text-sm font-bold text-white bg-primary hover:bg-[#2F7A9B] px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
              <i class="pi pi-file-pdf"></i> Lihat Dokumen Asli (PDF)
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

interface SopPoint {
  id: string;
  order_num: number;
  title: string;
  description: string;
}

interface SopDocument {
  id: string;
  title: string;
  category: string;
  source_pdf: string;
  _count: { Points: number };
  Points?: SopPoint[];
}

const sops = ref<SopDocument[]>([]);
const activeCategory = ref('HEAD_OFFICE');
const selectedSop = ref<string | null>(null);
const selectedSopDetails = ref<SopDocument | null>(null);
const loadingDetails = ref(false);

const filteredSops = computed(() => {
  return sops.value.filter(s => s.category === activeCategory.value);
});

const fetchSops = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/sop');
    const data = await res.json();
    sops.value = data;
  } catch (err) {
    console.error('Failed to fetch SOPs:', err);
  }
};

const openSop = async (id: string) => {
  selectedSop.value = id;
  loadingDetails.value = true;
  selectedSopDetails.value = null;
  try {
    const res = await fetch(`http://localhost:3001/api/sop/${id}`);
    const data = await res.json();
    selectedSopDetails.value = data;
  } catch (err) {
    console.error('Failed to fetch SOP details:', err);
  } finally {
    loadingDetails.value = false;
  }
};

onMounted(() => {
  fetchSops();
});
</script>
