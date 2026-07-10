<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 class="font-bold text-primary text-xl">Laporan Audit & Assessment</h1>
        <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">B</div>
      </header>
      <div class="p-4 md:p-8 flex items-center justify-center h-[calc(100vh-80px)]">
        <div class="text-center text-gray-400">
          <i class="pi pi-chart-bar text-4xl mb-4 block"></i>
          <p>Halaman laporan audit sedang dalam pengembangan.</p>
        </div>
      </div>
    </main>
  </div>
</template>
