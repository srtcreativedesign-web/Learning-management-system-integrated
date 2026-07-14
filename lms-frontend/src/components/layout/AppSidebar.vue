<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menu = ref([
  {
    label: 'Beranda Dasbor',
    icon: 'pi pi-home',
    path: '/dashboard'
  },
  {
    label: 'Manajemen Kursus',
    icon: 'pi pi-book',
    expanded: false,
    items: [
      {
        label: 'Daftar Kursus',
        path: '/library'
      }
    ]
  },
  {
    label: 'Sistem Audit',
    icon: 'pi pi-check-square',
    expanded: true,
    items: [
      {
        label: 'Manajemen Outlet',
        path: '/outlets'
      },
      {
        label: 'Kriteria Checklist',
        path: '/checklist-builder'
      },
      {
        label: 'Laporan Inspeksi',
        path: '/audit-reports'
      }
    ]
  },
  {
    label: 'Analytics & Report',
    icon: 'pi pi-chart-pie',
    expanded: true,
    items: [
      {
        label: 'Gamifikasi & Kuis',
        icon: 'pi pi-star',
        expanded: true,
        items: [
          { label: 'Papan Peringkat (XP)', path: '/analytics/leaderboard' },
          { label: 'Riwayat Kuis', path: '/analytics/quiz-history' }
        ]
      },
      {
        label: 'Training & Development',
        icon: 'pi pi-chart-line',
        expanded: true,
        items: [
          { label: 'In Class Training', path: '/analytics/training/in-class' },
          { label: 'On Site Training', path: '/analytics/training/on-site' },
          { label: 'Online Training (Quiz)', path: '/analytics/training/online' }
        ]
      },
      {
        label: 'Audit & Assessment',
        icon: 'pi pi-chart-bar',
        path: '/analytics/audit'
      }
    ]
  },
  {
    label: 'Standar Operasional (SOP)',
    icon: 'pi pi-file',
    expanded: false,
    items: [
      {
        label: 'Pustaka SOP',
        path: '/sop/viewer'
      },
      {
        label: 'Unggah SOP (Admin)',
        path: '/sop/management'
      }
    ]
  },
  {
    label: 'Pustaka Materi',
    icon: 'pi pi-folder-open',
    path: '/library'
  },
  {
    label: 'Manajemen Karyawan',
    icon: 'pi pi-users',
    path: '/employees'
  }
]);

const navigate = (item: any) => {
  if (item.items) {
    item.expanded = !item.expanded;
  } else if (item.path) {
    router.push(item.path);
  }
};

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <aside class="w-72 bg-white border-r border-gray-200 flex flex-col hidden md:flex h-screen sticky top-0 shrink-0 shadow-sm">
    <!-- Header -->
    <div class="p-5 border-b border-gray-100 flex items-center gap-3">
      <div class="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
        <i class="pi pi-building text-primary text-lg"></i>
      </div>
      <div>
        <h1 class="font-bold text-lg text-primary tracking-tight leading-tight">TND SYSTEM</h1>
        <p class="text-[11px] text-gray-500 font-medium">Learning Management System</p>
      </div>
    </div>
    
    <!-- Menu -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
      <template v-for="(item, index) in menu" :key="index">
        
        <!-- Parent Menu Item -->
        <div 
          @click="navigate(item)" 
          class="flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group select-none"
          :class="[
            isActive(item.path) ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            item.expanded ? 'bg-gray-50/50' : ''
          ]"
        >
          <i :class="[item.icon, 'text-lg mr-3 w-5 text-center', isActive(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600']"></i>
          <span class="text-[13px] flex-1 font-medium whitespace-nowrap">{{ item.label }}</span>
          <i v-if="item.items" class="pi text-xs transition-transform duration-200 text-gray-400" :class="item.expanded ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
        </div>

        <!-- Level 1 Submenu -->
        <div v-if="item.items" 
             class="grid transition-all duration-300 ease-in-out" 
             :class="item.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
          <div class="overflow-hidden">
            <div class="pl-4 mt-1 space-y-1 mb-2 border-l-2 border-gray-100 ml-5">
              <template v-for="(subItem, subIndex) in item.items" :key="subIndex">
                
                <div 
                  @click="navigate(subItem)"
                  class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group select-none"
                  :class="isActive(subItem.path) ? 'bg-primary/5 text-primary font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'"
                >
                  <i v-if="subItem.icon" :class="[subItem.icon, 'text-sm mr-2.5 w-4 text-center', isActive(subItem.path) ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600']"></i>
                  <span class="text-[13px] flex-1 font-medium whitespace-nowrap">{{ subItem.label }}</span>
                  <i v-if="subItem.items" class="pi text-[10px] transition-transform duration-200 text-gray-400" :class="subItem.expanded ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
                </div>

                <!-- Level 2 Submenu -->
                <div v-if="subItem.items" 
                     class="grid transition-all duration-300 ease-in-out" 
                     :class="subItem.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'">
                  <div class="overflow-hidden">
                    <div class="pl-3 mt-1 space-y-1 mb-1 border-l-2 border-gray-100 ml-4">
                      <div 
                        v-for="(subSubItem, subSubIndex) in subItem.items" 
                        :key="subSubIndex"
                        @click="navigate(subSubItem)"
                        class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 select-none"
                        :class="isActive(subSubItem.path) ? 'text-primary font-bold bg-primary/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'"
                      >
                        <span class="text-xs font-medium whitespace-nowrap">{{ subSubItem.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- User Profile -->
    <div class="p-4 border-t border-gray-100 bg-gray-50/30">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-sm">
          B
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-bold text-gray-800 truncate">Halo, Budi!</p>
          <p class="text-[11px] text-gray-500 truncate">Instruktur Utama</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
