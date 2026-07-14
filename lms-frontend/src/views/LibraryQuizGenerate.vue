<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';

const router = useRouter();
const route = useRoute();

const materialText = ref('');
const isGenerating = ref(false);
const generatedSummary = ref<string>('');
const generatedQuestions = ref<any[]>([]);

const generateQuiz = async () => {
  if (!materialText.value.trim()) {
    alert('Masukkan teks materi terlebih dahulu.');
    return;
  }

  isGenerating.value = true;
  try {
    const payload: any = { materialText: materialText.value };

    const res = await fetch('http://localhost:3001/quizzes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (res.ok && data.success) {
      generatedSummary.value = data.data.summary || '';
      generatedQuestions.value = data.data.questions.map((q: any) => ({ ...q, isEditing: false })) || [];
    } else {
      alert(data.message || 'Gagal generate kuis.');
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan pada koneksi server.');
  } finally {
    isGenerating.value = false;
  }
};

const saveQuiz = async () => {
  if (generatedQuestions.value.length === 0) return;
  const courseId = route.query.courseId;
  if (!courseId) return alert('ID Course tidak ditemukan');

  try {
    const res = await fetch(`http://localhost:3001/lms/courses/${courseId}`);
    const course = await res.json();
    const materialId = course.Materials?.[0]?.id;
    if (!materialId) return alert('Materi belum dilampirkan, harap lengkapi PDF/Video terlebih dahulu');

    const payload = {
      course_material_id: materialId,
      passing_score: 80,
      questions: generatedQuestions.value.map(q => ({
        text: q.question_text,
        type: 'MULTIPLE_CHOICE',
        options: q.options.map((o: any) => ({
          text: o.option_text,
          is_correct: o.is_correct
        }))
      }))
    };

    const saveRes = await fetch('http://localhost:3001/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (saveRes.ok) {
      alert('Kuis berhasil disimpan dan dipublikasikan!');
      router.push(`/library/course/${courseId}`);
    } else {
      alert('Gagal menyimpan kuis');
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan sistem saat menyimpan');
  }
};

const setCorrectOption = (question: any, correctIndex: number) => {
  question.options.forEach((opt: any, i: number) => {
    opt.is_correct = i === correctIndex;
  });
};

onMounted(async () => {
  const courseId = route.query.courseId;
  if (courseId) {
    materialText.value = 'Sedang mengekstrak teks asli dari PDF... Mohon tunggu...';
    try {
      const res = await fetch(`http://localhost:3001/quizzes/extract-pdf/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.text) {
          materialText.value = data.text;
          
          // Optional: Auto-trigger generation for WOW factor
          setTimeout(() => {
            generateQuiz();
          }, 1500);
        } else {
          materialText.value = 'Gagal mengekstrak PDF atau file tidak ditemukan. Silakan copy-paste teks secara manual di sini.';
        }
      }
    } catch (e) {
      console.error('Failed to extract PDF', e);
      materialText.value = 'Terjadi kesalahan sistem saat membaca PDF. Silakan copy-paste teks secara manual.';
    }
  }
});
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans text-sm selection:bg-[#419CC3] selection:text-white">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto relative">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#419CC3]/10 to-[#89B4E1]/5 -z-10"></div>
      <div class="absolute top-10 right-20 w-72 h-72 bg-[#89B4E1]/20 rounded-full blur-3xl -z-10"></div>
      
      <div class="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in-up">
        
        <!-- Premium Header -->
        <div class="flex items-start gap-5">
          <Button 
            icon="pi pi-arrow-left" 
            text 
            rounded 
            severity="secondary"
            class="hover:bg-white hover:shadow-sm transition-all duration-300 mt-1"
            @click="router.push('/library')" 
          />
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#419CC3]/20 to-[#89B4E1]/20 rounded-full text-[#419CC3] font-bold text-xs mb-3 border border-[#419CC3]/20">
              <i class="pi pi-sparkles"></i> AI-Powered
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              Generate Quiz Cepat <span class="text-4xl">⚡</span>
            </h1>
            <p class="text-slate-500 mt-2 max-w-2xl text-base leading-relaxed">
              Kecerdasan Buatan kami akan menganalisis dokumen materi Anda dan memetakannya menjadi sekumpulan soal pilihan ganda berkualitas tinggi dalam hitungan detik.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Input Material (Left Column) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div class="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h2 class="font-bold text-slate-700 flex items-center gap-2">
                  <span class="flex items-center justify-center w-6 h-6 rounded-full bg-[#419CC3] text-white text-xs">1</span>
                  Sumber Materi
                </h2>
                <i class="pi pi-file-edit text-slate-400"></i>
              </div>
              <div class="p-6 space-y-4">
                <p class="text-slate-500 text-sm leading-relaxed">
                  Tempelkan (copy-paste) poin-poin penting, ringkasan, atau isi dari PDF pelatihan ke dalam kotak di bawah ini.
                </p>
                <div class="relative group">
                  <Textarea 
                    v-model="materialText" 
                    rows="14" 
                    class="w-full text-sm bg-slate-50 border-slate-200 rounded-xl focus:border-[#419CC3] focus:ring focus:ring-[#419CC3]/20 transition-all duration-300 resize-none p-4 placeholder-slate-400" 
                    placeholder="Contoh: Prosedur penanganan keluhan pelanggan VIP wajib diselesaikan dalam kurun waktu 1 jam. Jika lewat dari batas waktu, maka eskalasi ke Manajer Toko wajib dilakukan..." 
                  />
                  <div class="absolute bottom-4 right-4 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ materialText.length }} karakter
                  </div>
                </div>
                
                <Button 
                  @click="generateQuiz" 
                  :loading="isGenerating" 
                  label="Analisis & Generate Soal" 
                  icon="pi pi-bolt" 
                  class="w-full !rounded-xl !py-3 !font-bold shadow-lg shadow-[#419CC3]/30 hover:shadow-[#419CC3]/50 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#419CC3] to-[#3a8bb0] border-none" 
                />
              </div>
            </div>
          </div>

          <!-- Generated Quiz Output (Right Column) -->
          <div class="lg:col-span-7">
            <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div class="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h2 class="font-bold text-slate-700 flex items-center gap-2">
                  <span class="flex items-center justify-center w-6 h-6 rounded-full bg-[#89B4E1] text-white text-xs">2</span>
                  Hasil Soal & Review
                </h2>
                <div v-if="generatedQuestions.length > 0" class="text-xs font-bold text-[#419CC3] bg-[#419CC3]/10 px-3 py-1 rounded-full">
                  {{ generatedQuestions.length }} Soal Berhasil Dibuat
                </div>
              </div>
              
              <div class="p-6 flex-1 flex flex-col bg-slate-50/30">
                
                <!-- Empty State -->
                <div v-if="generatedQuestions.length === 0 && !isGenerating" class="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
                  <div class="w-24 h-24 bg-[#419CC3]/5 rounded-full flex items-center justify-center mb-6">
                    <i class="pi pi-sparkles text-4xl text-[#89B4E1]"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 mb-2">Area Review Kosong</h3>
                  <p class="text-slate-500 max-w-sm leading-relaxed">
                    Masukkan teks materi di sebelah kiri dan klik tombol Generate. Sistem AI kami akan menyiapkan soal-soal berkualitas untuk Anda tinjau di sini.
                  </p>
                </div>

                <!-- Loading State -->
                <div v-if="isGenerating" class="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div class="relative w-20 h-20 mb-6 flex items-center justify-center">
                    <div class="absolute inset-0 border-4 border-[#419CC3]/20 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-[#419CC3] rounded-full border-t-transparent animate-spin"></div>
                    <i class="pi pi-bolt text-2xl text-[#419CC3] animate-pulse"></i>
                  </div>
                  <h3 class="text-lg font-bold text-slate-700 animate-pulse">AI Sedang Membaca & Merangkum Materi...</h3>
                  <p class="text-slate-500 mt-2">Mengekstrak poin-poin krusial dan merancang struktur jawaban.</p>
                </div>

                <div v-if="generatedQuestions.length > 0" class="flex-1 flex flex-col max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                  <!-- AI Summary -->
                  <div v-if="generatedSummary" class="mb-6 bg-gradient-to-r from-[#89B4E1]/10 to-[#419CC3]/5 border border-[#89B4E1]/30 p-5 rounded-xl shrink-0">
                    <h3 class="text-[#419CC3] font-bold mb-2 flex items-center gap-2"><i class="pi pi-sparkles"></i> Ringkasan Materi (AI Generated)</h3>
                    <p class="text-slate-600 leading-relaxed text-sm">{{ generatedSummary }}</p>
                  </div>

                  <!-- Questions List -->
                  <div class="space-y-5">
                    <div v-for="(q, idx) in generatedQuestions" :key="idx" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#89B4E1] transition-colors group">
                    <div class="flex gap-4">
                      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-[#419CC3]/10 group-hover:text-[#419CC3] transition-colors">
                        {{ idx + 1 }}
                      </div>
                      <div class="flex-1">
                        <div v-if="!q.isEditing">
                          <h4 class="font-bold text-slate-800 text-base mb-4 leading-relaxed">{{ q.question_text }}</h4>
                          <div class="space-y-3">
                            <div v-for="(opt, oIdx) in q.options" :key="oIdx" 
                                 :class="['flex items-start gap-3 p-3 rounded-lg border transition-all duration-200', 
                                         opt.is_correct ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-transparent hover:bg-slate-100']">
                              <i :class="['mt-0.5 text-lg', opt.is_correct ? 'pi pi-check-circle text-emerald-500' : 'pi pi-circle text-slate-300']"></i>
                              <span :class="['leading-relaxed', opt.is_correct ? 'font-bold text-emerald-800' : 'text-slate-600']">{{ opt.option_text }}</span>
                            </div>
                          </div>
                          <div class="mt-4 flex gap-2">
                            <Button @click="q.isEditing = true" icon="pi pi-pencil" label="Edit Soal Ini" severity="secondary" size="small" text class="hover:bg-slate-100" />
                          </div>
                        </div>
                        <div v-else class="bg-slate-50 p-4 rounded-xl border border-[#419CC3]/30">
                          <label class="block text-xs font-bold text-[#419CC3] uppercase mb-2">Pertanyaan</label>
                          <InputText v-model="q.question_text" class="w-full mb-4 font-bold border-slate-300 focus:border-[#419CC3]" />
                          
                          <label class="block text-xs font-bold text-[#419CC3] uppercase mb-2">Pilihan Jawaban (Pilih yang Benar)</label>
                          <div class="space-y-2">
                            <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="flex items-center gap-3">
                              <input type="radio" :name="'correct_' + idx" :value="true" :checked="opt.is_correct" @change="setCorrectOption(q, oIdx)" class="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer">
                              <InputText v-model="opt.option_text" class="w-full border-slate-300 focus:border-[#419CC3]" />
                            </div>
                          </div>
                          
                          <div class="mt-5 flex gap-2 justify-end">
                            <Button @click="q.isEditing = false" icon="pi pi-check" label="Selesai Edit" severity="success" size="small" class="font-bold" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

              </div>
              
              <!-- Footer Action -->
              <div v-if="generatedQuestions.length > 0" class="p-6 border-t border-slate-100 bg-white">
                <Button 
                  @click="saveQuiz" 
                  label="Simpan & Publikasikan Kuis" 
                  severity="info" 
                  icon="pi pi-check" 
                  class="w-full !rounded-xl !py-3 !font-bold" 
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
</style>
