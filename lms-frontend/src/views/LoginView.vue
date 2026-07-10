<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const isSubmitting = ref(false);
const isSuccess = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    isSuccess.value = true;
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  }, 1500);
};
</script>

<template>
<div class="flex flex-col min-h-screen items-center justify-center bg-tertiary overflow-hidden">

  <!-- Main Content Canvas -->
  <main class="relative z-10 w-full max-w-md px-4 md:px-0">
    <!-- Brand Identity Section -->
    <div class="flex flex-col items-center mb-8">
      <div class="mb-4 flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
        <span class="material-symbols-outlined text-primary text-[32px]">corporate_fare</span>
      </div>
      <h1 class="text-2xl font-bold text-primary tracking-tight">TND SYSTEM</h1>
      <p class="text-sm text-text-main/70 mt-1">Kelola masa depan SDM Anda hari ini</p>
    </div>

    <!-- Login Card -->
    <div class="bg-white rounded-lg p-8 login-card-shadow border border-gray-200">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-text-main">Masuk ke Akun</h2>
        <p class="text-sm text-text-main/70">Gunakan kredensial resmi perusahaan Anda</p>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Email Field -->
        <div class="space-y-1">
          <label class="text-sm font-semibold text-text-main flex items-center gap-1" for="email">
            <span class="material-symbols-outlined text-[16px]">alternate_email</span>
            Email Karyawan
          </label>
          <input v-model="email" class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm text-text-main placeholder:text-gray-400 input-focus-ring transition-all duration-200" id="email" placeholder="nama@perusahaan.com" required type="email"/>
        </div>

        <!-- Password Field -->
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="text-sm font-semibold text-text-main flex items-center gap-1" for="password">
              <span class="material-symbols-outlined text-[16px]">lock</span>
              Kata Sandi
            </label>
            <a class="text-sm font-medium text-primary hover:underline transition-all" href="#">Lupa sandi?</a>
          </div>
          <div class="relative">
            <input v-model="password" class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white text-sm text-text-main placeholder:text-gray-400 input-focus-ring transition-all duration-200" id="password" placeholder="••••••••" required :type="showPassword ? 'text' : 'password'"/>
            <button class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors" @click="togglePassword" type="button">
              <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <!-- Remember Me & Policy -->
        <div class="flex items-center gap-2">
          <input v-model="rememberMe" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20" id="remember" type="checkbox"/>
          <label class="text-sm font-medium text-text-main/70" for="remember">Tetap masuk di perangkat ini</label>
        </div>

        <!-- Action Button -->
        <button class="w-full h-[48px] bg-primary text-white font-bold text-sm rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm" type="submit" :disabled="isSubmitting">
          <template v-if="isSubmitting">
            <span class="animate-spin material-symbols-outlined">progress_activity</span>
          </template>
          <template v-else-if="isSuccess">
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Berhasil</span>
          </template>
          <template v-else>
            <span>Masuk</span>
            <span class="material-symbols-outlined text-[18px]">login</span>
          </template>
        </button>
      </form>

      <!-- Social Login / Alternative (Subtle) -->
      <div class="mt-8 text-center space-y-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-4 text-gray-500">Atau</span></div>
        </div>
        <button class="w-full h-[48px] border border-gray-300 rounded-lg font-bold text-sm text-text-main hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3">
          <div class="w-5 h-5 bg-contain bg-center bg-no-repeat" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg')"></div>
          Masuk dengan SSO Perusahaan
        </button>
      </div>
    </div>

    <!-- Footer / Legal Links -->
    <footer class="mt-8 text-center space-y-4">
      <p class="text-sm font-medium text-text-main/70">
          Belum punya akun? <a class="text-primary font-bold hover:underline" href="#">Hubungi HRD</a>
      </p>
      <div class="flex justify-center gap-6">
        <a class="text-sm font-medium text-gray-500 hover:text-text-main transition-colors" href="#">Bantuan</a>
        <a class="text-sm font-medium text-gray-500 hover:text-text-main transition-colors" href="#">Privasi</a>
        <a class="text-sm font-medium text-gray-500 hover:text-text-main transition-colors" href="#">Syarat Layanan</a>
      </div>
    </footer>
  </main>
</div>
</template>
