<script setup lang="ts">
import QuizBuilder from '../components/quiz/QuizBuilder.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans text-sm">
    <!-- Sidebar Component -->
    <AppSidebar />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto bg-gray-50/50">
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 class="font-bold text-primary text-xl">Quiz Builder</h1>
        <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">B</div>
      </header>
      <div class="p-4 md:p-8 max-w-7xl mx-auto">
        <QuizBuilder />
      </div>
    </main>
  </div>
</template>
