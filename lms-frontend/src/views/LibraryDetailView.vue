<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import Button from 'primevue/button';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';

const router = useRouter();
const route = useRoute();

const course = ref<any>(null);
const loading = ref(true);

const fetchCourse = async () => {
  const id = route.params.id;
  try {
    const res = await fetch(`http://localhost:3001/lms/courses/${id}`);
    if (res.ok) {
      course.value = await res.json();
    }
  } catch (error) {
    console.error('Failed to load course details', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourse();
});
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans text-sm selection:bg-[#419CC3] selection:text-white">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto relative">
      
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#419CC3]/10 to-[#89B4E1]/5 -z-10"></div>
      <div class="absolute top-10 right-20 w-72 h-72 bg-[#89B4E1]/20 rounded-full blur-3xl -z-10"></div>
      
      <div class="p-4 md:p-6 w-full space-y-6 animate-fade-in-up">
        
        <!-- Clean Header -->
        <div class="flex flex-col md:flex-row items-start gap-4">
          <Button 
            icon="pi pi-arrow-left" 
            text 
            rounded 
            severity="secondary"
            class="hover:bg-white hover:shadow-sm transition-all duration-300 mt-1 flex-shrink-0"
            @click="router.push('/library')" 
          />
          <div v-if="loading" class="flex-1 flex justify-center py-10 w-full">
            <i class="pi pi-spin pi-spinner text-4xl text-[#419CC3]"></i>
          </div>
          <div v-else-if="course" class="flex-1 w-full">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <Tag :value="course.Materials?.[0]?.type || 'UNKNOWN'" severity="info" class="shadow-sm font-bold px-3 py-1 rounded-full text-xs tracking-wider" />
              <Tag v-if="course.Materials?.[0]?.Quiz" value="Ada Kuis" severity="success" class="shadow-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border-none text-xs tracking-wider" />
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{{ course.title }}</h1>
            <p class="text-slate-500 mt-2 text-base leading-relaxed font-medium">{{ course.description }}</p>
          </div>
        </div>

        <div v-if="course" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[80vh]">
          <Tabs value="materi">
            <TabList class="px-6 pt-6 border-b border-slate-100 bg-slate-50/50 flex gap-4">
              <Tab value="materi" class="font-bold flex items-center gap-2 px-6 py-4 rounded-t-xl transition-colors"><i class="pi pi-book"></i> Konten Materi</Tab>
              <Tab value="kuis" class="font-bold flex items-center gap-2 px-6 py-4 rounded-t-xl transition-colors"><i class="pi pi-question-circle"></i> Kuis Evaluasi</Tab>
            </TabList>
            <TabPanels>
              
              <!-- Tab Materi -->
              <TabPanel value="materi" class="p-0">
                <div v-if="course.Materials?.[0]?.content_url" class="w-full h-[85vh] bg-slate-100">
                  
                  <!-- PDF Embed -->
                  <iframe 
                    v-if="course.Materials[0].type.toUpperCase() === 'PDF'" 
                    :src="'http://localhost:3001' + course.Materials[0].content_url" 
                    class="w-full h-full border-none"
                    title="PDF Viewer"
                  ></iframe>

                  <!-- Video Embed -->
                  <video 
                    v-else-if="course.Materials[0].type.toUpperCase() === 'VIDEO' || course.Materials[0].type.toUpperCase() === 'MP4'" 
                    :src="'http://localhost:3001' + course.Materials[0].content_url" 
                    controls 
                    class="w-full h-auto max-h-[800px] bg-slate-900"
                  ></video>

                  <!-- Generic File Download (If not PDF/Video) -->
                  <div v-else class="flex flex-col items-center justify-center h-full py-20">
                    <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                      <i class="pi pi-file text-4xl text-[#419CC3]"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-700 mb-2">File Tersedia</h3>
                    <p class="text-slate-500 mb-8 max-w-md text-center">Format file ini tidak dapat dipratinjau langsung di browser. Silakan unduh untuk melihat isinya.</p>
                    <a :href="'http://localhost:3001' + course.Materials[0].content_url" target="_blank" class="inline-block">
                      <Button icon="pi pi-download" label="Unduh File Sekarang" severity="primary" class="shadow-md !rounded-xl !py-3 !px-8 !font-bold" />
                    </a>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-24 bg-white">
                  <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <i class="pi pi-folder-open text-4xl text-slate-400"></i>
                  </div>
                  <h3 class="text-xl font-bold text-slate-700 mb-2">Belum ada lampiran materi</h3>
                  <p class="text-slate-500">Materi ini hanya berisi teks deskripsi tanpa file PDF/Video pendukung.</p>
                </div>
              </TabPanel>
              
              <!-- Tab Kuis -->
              <TabPanel value="kuis" class="p-8">
                <div v-if="course.Materials?.[0]?.Quiz">
                  <div class="mb-8 flex justify-between items-center bg-gradient-to-r from-[#89B4E1]/10 to-[#419CC3]/5 p-6 rounded-2xl border border-[#89B4E1]/30">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#419CC3]">
                        <i class="pi pi-sparkles text-xl"></i>
                      </div>
                      <div>
                        <h3 class="text-xl font-extrabold text-[#419CC3]">Daftar Soal Kuis</h3>
                        <p class="text-slate-600 mt-1">Kuis ini telah dihasilkan dan dipublikasikan untuk karyawan.</p>
                      </div>
                    </div>
                    <Tag :value="course.Materials[0].Quiz.Questions?.length + ' Soal'" severity="info" class="text-sm px-5 py-2 font-bold rounded-full shadow-sm" />
                  </div>
                  
                  <div class="space-y-6">
                    <div v-for="(q, idx) in course.Materials[0].Quiz.Questions" :key="q.id" class="bg-white border border-slate-200 hover:border-[#89B4E1] transition-colors rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] group">
                      <div class="flex gap-5">
                        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-[#419CC3]/10 group-hover:text-[#419CC3] transition-colors">
                          {{ idx + 1 }}
                        </div>
                        <div class="flex-1">
                          <h4 class="font-bold text-slate-800 text-lg mb-5 leading-relaxed">{{ q.question_text }}</h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="(opt, oIdx) in q.Options" :key="opt.id" 
                                :class="['flex items-start gap-3 p-4 rounded-xl border transition-all duration-200', opt.is_correct ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100']">
                              <i :class="['mt-0.5 text-xl', opt.is_correct ? 'pi pi-check-circle text-emerald-500' : 'pi pi-circle text-slate-300']"></i>
                              <span :class="['leading-relaxed text-sm', opt.is_correct ? 'font-bold text-emerald-800' : 'text-slate-600']">{{ opt.option_text }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-24 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div class="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="pi pi-question text-3xl text-[#419CC3]"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-slate-700 mb-2">Belum ada Kuis</h3>
                  <p class="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">Materi ini belum dilengkapi dengan evaluasi kuis AI. Buat sekarang untuk menguji pemahaman karyawan.</p>
                  <Button @click="router.push(`/library/generate-quiz?courseId=${course.id}`)" icon="pi pi-bolt" label="Generate Kuis Sekarang" severity="info" class="shadow-lg shadow-[#419CC3]/30 !rounded-xl !py-3 !px-6 !font-bold" />
                </div>
              </TabPanel>
              
            </TabPanels>
          </Tabs>
        </div>
        
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
</style>
