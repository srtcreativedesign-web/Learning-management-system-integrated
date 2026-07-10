<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement 
} from 'chart.js';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import gsap from 'gsap';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

// Chart Data: Pre/Post Test
const barChartData = ref({
  labels: ['Komunikasi', 'K3 Dasar', 'SOP Gudang', 'Manajemen Waktu', 'Leadership'],
  datasets: [
    {
      label: 'Pre-test',
      backgroundColor: '#89B4E1', // Secondary
      data: [60, 55, 70, 50, 65]
    },
    {
      label: 'Post-test',
      backgroundColor: '#419CC3', // Primary
      data: [85, 90, 95, 80, 88]
    }
  ]
});

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
});

// Chart Data: Participants
const lineChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  datasets: [
    {
      label: 'Peserta Lulus',
      backgroundColor: '#419CC3',
      borderColor: '#419CC3',
      tension: 0.3,
      data: [120, 150, 180, 140, 210, 250]
    }
  ]
});

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  }
});

// Dummy Data: Leaderboard
const crewRank = ref([
  { id: 1, name: 'Budi Santoso', points: 1250, badge: 'Gold' },
  { id: 2, name: 'Siti Aminah', points: 1100, badge: 'Silver' },
  { id: 3, name: 'Andi Wijaya', points: 950, badge: 'Bronze' },
  { id: 4, name: 'Rina Kusuma', points: 800, badge: 'Participant' },
]);

// Chart Data: Top Compliance (Audit)
const complianceChartData = ref({
  labels: ['Sudirman', 'Kemang', 'Kelapa Gading', 'Bintaro', 'PIK'],
  datasets: [
    {
      label: 'Tingkat Kepatuhan (%)',
      backgroundColor: '#A5D6A7', // Soft Green
      borderRadius: 4,
      data: [98, 95, 94, 91, 89]
    }
  ]
});

const complianceChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100 } }
});

// Chart Data: Most Findings (Audit)
const findingsChartData = ref({
  labels: ['Depok', 'Bekasi', 'Tangerang', 'Bogor', 'Cibubur'],
  datasets: [
    {
      label: 'Jumlah Temuan (NOK)',
      backgroundColor: '#EF9A9A', // Soft Red
      borderRadius: 4,
      data: [24, 19, 15, 12, 10]
    }
  ]
});

const findingsChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } }
});

// Chart Data: Modul Performance (Horizontal Bar)
const moduleChartData = ref({
  labels: ['M1: Pengenalan', 'M2: Visi & Misi', 'M3: SOP Kerja', 'M4: K3 Dasar'],
  datasets: [{
    label: 'Rata-rata Nilai',
    backgroundColor: '#419CC3',
    borderRadius: 4,
    barPercentage: 0.6,
    data: [92, 88, 76, 85]
  }]
});

const moduleChartOptions = ref({
  indexAxis: 'y', // Makes it horizontal
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
    x: { beginAtZero: true, max: 100 },
    y: { grid: { display: false } }
  }
});

// GSAP Stagger Animation on Mount
onMounted(() => {
  gsap.from('.gsap-card', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
});
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    
    <!-- Sidebar Component -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto bg-gray-50/50">
      
      <!-- Top Mobile Nav (Hidden on Desktop) -->
      <div class="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <h1 class="font-bold text-primary">TND SYSTEM</h1>
        <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">B</div>
      </div>

      <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        
        <!-- Welcome Header -->
        <div class="gsap-card">
          <h2 class="text-xl font-bold text-text-main">Dasbor Instruktur</h2>
          <p class="text-sm text-text-main/70 mt-1">Pantau perkembangan peserta dan efektivitas kelas Anda bulan ini.</p>
        </div>

        <!-- Top Row: Active Course & Crew Rank -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Content Area (Spans 2 columns) -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            
            <!-- Active Course Card -->
            <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4">Kelas Sedang Berjalan (Batch Aktif)</h3>
            
            <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div class="w-24 h-24 bg-primary/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-4xl">cast_for_education</span>
              </div>
              <div class="flex-1 w-full">
                <h4 class="text-xl font-bold text-text-main mb-2">Orientasi Karyawan Baru - Batch Juli</h4>
                
                <!-- Info Badges to fill space -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="bg-blue-50 text-primary px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <i class="pi pi-desktop text-[10px]"></i> Online Course
                  </span>
                  <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <i class="pi pi-users text-[10px]"></i> 45 Peserta Terdaftar
                  </span>
                  <span class="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <i class="pi pi-clock text-[10px]"></i> Sisa 3 Hari
                  </span>
                </div>
                
                <!-- Progress Bar (Passing Rate) -->
                <div class="flex items-center justify-between text-sm font-medium mb-2">
                  <span class="text-text-main text-xs">Progress Kelulusan Peserta</span>
                  <span class="text-primary font-bold">60% (27/45 Lulus)</span>
                </div>
                <div class="w-full h-2.5 bg-secondary/20 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: 60%"></div>
                </div>
              </div>
              <div class="w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-2 border-l border-gray-100 pl-6 ml-2">
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 text-center">Tindakan</p>
                <button class="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
                  <i class="pi pi-star text-amber-500"></i> Beri Nilai
                </button>
                <button class="w-full md:w-auto px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
                  <i class="pi pi-cog"></i> Kelola Kelas
                </button>
              </div>
            </div>
            </div>
            
            <!-- Module Performance Chart (Fills the empty space) -->
            <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <i class="pi pi-chart-bar"></i> Performa per Modul (Kelas Aktif)
              </h3>
              <div class="h-40">
                <Bar :data="moduleChartData" :options="moduleChartOptions" />
              </div>
            </div>

          </div>

          <!-- Crew Rank Leaderboard -->
          <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-full flex flex-col">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">workspace_premium</span>
              Papan Peringkat Peserta
            </h3>
            
            <div class="space-y-4">
              <div v-for="(crew, index) in crewRank" :key="crew.id" 
                   class="flex items-center justify-between p-3 rounded-lg transition-colors"
                   :class="index === 0 ? 'bg-amber-50 border border-amber-200/50' : 'hover:bg-gray-50'">
                <div class="flex items-center gap-3">
                  <!-- Rank Badge -->
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                       :class="index === 0 ? 'bg-warning text-white' : 'bg-gray-100 text-gray-500'">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-bold text-sm text-text-main">{{ crew.name }}</p>
                    <p class="text-xs text-text-main/60">{{ crew.points }} XP</p>
                  </div>
                </div>
                <!-- Placeholder Badge Icon -->
                <div class="text-gray-300">
                  <span class="material-symbols-outlined" :class="index === 0 ? 'text-warning' : (index === 1 ? 'text-gray-400' : 'text-amber-700')">
                    stars
                  </span>
                </div>
              </div>
            </div>
            
            <div class="mt-auto pt-4 border-t border-gray-100">
              <button class="w-full text-center text-sm font-bold text-primary hover:underline">Lihat Semua Peringkat</button>
            </div>
          </div>
        </div>

        <!-- Middle Row: Analytics Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pre/Post Test Chart -->
          <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">bar_chart</span>
              Rata-rata Nilai Ujian (Pre vs Post)
            </h3>
            <div class="h-64">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </div>

          <!-- Participants Line Chart -->
          <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">show_chart</span>
              Laju Kelulusan Peserta
            </h3>
            <div class="h-64">
              <Line :data="lineChartData" :options="lineChartOptions" />
            </div>
          </div>
        </div>

        <!-- Third Row: Audit Analytics Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Compliance Chart -->
          <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <i class="pi pi-verified text-green-500"></i>
              Top 5 Outlet - Kepatuhan Tertinggi
            </h3>
            <div class="h-64">
              <Bar :data="complianceChartData" :options="complianceChartOptions" />
            </div>
          </div>

          <!-- Most Findings Chart -->
          <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <i class="pi pi-exclamation-circle text-red-400"></i>
              Top 5 Outlet - Temuan Terbanyak
            </h3>
            <div class="h-64">
              <Bar :data="findingsChartData" :options="findingsChartOptions" />
            </div>
          </div>
        </div>

        <!-- Bottom Row: Pustaka Materi -->
        <div class="gsap-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-bold text-text-main/70 uppercase tracking-wider">Materi Terbaru yang Diunggah</h3>
            <a href="#" class="text-sm font-medium text-primary hover:underline">Lihat Semua</a>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- SOP Card 1 -->
            <div class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div class="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <h4 class="font-bold text-sm text-text-main mb-1">SOP K3 Dasar</h4>
              <p class="text-xs text-text-main/60 mb-3">Diperbarui: 1 Hari Lalu</p>
              <div class="flex justify-between items-center text-xs mt-auto">
                <span class="text-gray-500 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">group</span> 45 Diakses</span>
              </div>
            </div>

            <!-- SOP Card 2 -->
            <div class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
              <div class="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined">quiz</span>
              </div>
              <h4 class="font-bold text-sm text-text-main mb-1">Kuis Gudang</h4>
              <p class="text-xs text-text-main/60 mb-3">Diperbarui: 3 Jam Lalu</p>
              <div class="flex justify-between items-center text-xs mt-auto">
                <span class="text-gray-500 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">group</span> 12 Dikerjakan</span>
              </div>
            </div>
            
            <!-- Upload New Material -->
            <div class="p-4 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-primary/5 hover:border-primary transition-all cursor-pointer min-h-[160px]">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
                <span class="material-symbols-outlined">upload_file</span>
              </div>
              <p class="text-sm font-medium text-primary">Unggah Materi</p>
            </div>

            <!-- Create New Quiz -->
            <div @click="$router.push('/quiz-builder')" class="p-4 rounded-lg border border-dashed border-primary flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer min-h-[160px]">
              <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-2">
                <span class="material-symbols-outlined">add_task</span>
              </div>
              <p class="text-sm font-bold text-primary">Buat Kuis Baru</p>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
