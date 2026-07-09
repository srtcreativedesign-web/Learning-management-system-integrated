<script setup lang="ts">
import QuizBuilder from '../components/quiz/QuizBuilder.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar / Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <button 
          @click="router.push('/dashboard')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          title="Kembali ke Dasbor"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="font-bold text-primary text-xl">SobatHR LMS</h1>
      </div>
      <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">B</div>
    </header>

    <!-- Main Content: The Quiz Builder Component -->
    <main class="flex-1 overflow-y-auto px-4 md:px-8">
      <QuizBuilder />
    </main>
  </div>
</template>
