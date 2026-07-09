<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quiz Builder</h1>
        <p class="text-gray-500 mt-1">Buat soal kuis dan atur kunci jawaban untuk modul ini.</p>
      </div>
      <button 
        @click="saveQuiz"
        class="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
      >
        Simpan Kuis
      </button>
    </div>

    <!-- Quiz Settings -->
    <Card class="mb-8">
      <template #header>
        <h2 class="text-lg font-semibold text-gray-800">Pengaturan Utama</h2>
      </template>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nilai Minimal Kelulusan (Passing Score)</label>
          <input 
            v-model="quizConfig.passing_score"
            type="number" 
            min="0" max="100"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Template Sertifikat Kelulusan</label>
          <select 
            v-model="quizConfig.certificate_template_id"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Tidak ada sertifikat</option>
            <!-- In a real app, populate from API -->
            <option value="template-1">Sertifikat Kelulusan Standar</option>
          </select>
        </div>
      </div>
    </Card>

    <!-- Questions List -->
    <div class="space-y-6">
      <Card v-for="(q, qIndex) in questions" :key="q.id">
        <template #header>
          <div class="flex items-center gap-3">
            <span class="bg-gray-100 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
              {{ qIndex + 1 }}
            </span>
            <select 
              v-model="q.type"
              class="border-gray-200 bg-gray-50 text-sm rounded-lg focus:ring-primary focus:border-primary py-1.5"
            >
              <option value="MULTIPLE_CHOICE">Pilihan Ganda (1 Jawaban)</option>
              <option value="MULTIPLE_ANSWER">Pilihan Ganda (Banyak Jawaban)</option>
              <option value="TRUE_FALSE">Benar / Salah</option>
            </select>
          </div>
          <button 
            @click="removeQuestion(qIndex)"
            class="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"
            title="Hapus Soal"
          >
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </template>

        <!-- Question Text -->
        <div class="mb-4">
          <textarea 
            v-model="q.text"
            rows="2"
            placeholder="Tulis pertanyaan di sini..."
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary resize-none"
          ></textarea>
        </div>

        <!-- Options Builder -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pilihan Jawaban</label>
          <DynamicInputList 
            v-model="q.options"
            :type="q.type"
          />
        </div>
      </Card>
    </div>

    <!-- Add Question Button -->
    <button 
      @click="addQuestion"
      class="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex flex-col items-center gap-1"
    >
      <span class="material-symbols-outlined">add_circle</span>
      Tambah Pertanyaan Baru
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '../ui/Card.vue'
import DynamicInputList from '../ui/DynamicInputList.vue'
import type { OptionItem } from '../ui/DynamicInputList.vue'

// Define Question Type
interface Question {
  id: string
  text: string
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE'
  options: OptionItem[]
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const quizConfig = ref({
  passing_score: 80,
  certificate_template_id: ''
})

const questions = ref<Question[]>([
  {
    id: generateId(),
    text: '',
    type: 'MULTIPLE_CHOICE',
    options: [
      { text: '', is_correct: true },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ]
  }
])

const addQuestion = () => {
  questions.value.push({
    id: generateId(),
    text: '',
    type: 'MULTIPLE_CHOICE',
    options: [
      { text: '', is_correct: true },
      { text: '', is_correct: false }
    ]
  })
}

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1)
}

const saveQuiz = () => {
  const payload = {
    ...quizConfig.value,
    questions: questions.value
  }
  
  // Here we would typically call the API (e.g. POST /api/lms/quizzes)
  console.log('Saving Quiz Draft Payload:', payload)
  alert('Kuis berhasil disimpan! (Silakan cek Console Log untuk melihat struktur JSON API)')
}
</script>
