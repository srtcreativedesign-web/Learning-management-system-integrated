import re

html_content = """<div class="hidden lg:flex lg:w-1/2 relative bg-surface-dim overflow-hidden items-center justify-center border-r border-white/5">
<!-- Background Ambient Glows -->
<div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[120px]"></div>
<div class="relative z-10 w-full max-w-2xl px-margin-desktop text-center">
<div class="floating-art">
<img alt="Abstract HR Ecosystem Visual" class="w-full h-auto drop-shadow-[0_0_50px_rgba(76,215,246,0.3)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFL53o3dmms0oCPnpeUq2MhH7lXiPYgKpaHprgsKUT1Kx_GJaU6_OKqcAkcqcG257rFA0I5tv9rjKnzCwQEMUW80Rc2uekvStV9eYBtIVStPegk6AI8FnM5OMXd0ImpAAFw4V3tUVI6KOFaYisC3G0ZbuHFN2LBh4Wu30VQlGlgNtCn_CBj6OdDLxqp22MS2aLFzFjMsQ6zJcqOiA0b42uz7Qi2JFT9-nOrN5F54xhDq54p8Ks2G6ME3QpHQieWVGBzFT6zFX9cu0"/>
</div>
<div class="mt-xl space-y-md">
<h2 class="font-display-sm text-display-sm text-primary tracking-tight">The Future of Workforce Intelligence</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                    Orchestrate your human capital with precision elegance. Integrated learning, performance, and talent management in one unified space.
                </p>
</div>
</div>
</div>
<!-- Right Column: Login Form -->
<div class="w-full lg:w-1/2 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl bg-surface">
<div class="w-full max-w-[480px]">
<!-- Header/Logo -->
<div class="mb-xl text-center lg:text-left">
<div class="inline-flex items-center gap-base mb-md">
<span class="material-symbols-outlined text-primary text-[40px]" style="font-variation-settings: 'FILL' 1;">hub</span>
<h1 class="font-display-sm text-display-sm font-bold text-primary tracking-tighter">SobatHR</h1>
</div>
<p class="font-headline-md text-headline-md text-on-surface">Selamat Datang Kembali</p>
<p class="font-body-md text-body-md text-on-surface-variant mt-xs">Masuk ke dashboard enterprise Anda</p>
</div>
<!-- Login Card -->
<div class="glass-panel rounded-xl p-md md:p-lg">
<form class="space-y-md" @submit.prevent="handleLogin">
<!-- Email Field -->
<div class="space-y-xs">
<label class="font-label-md text-label-md text-on-surface-variant transition-colors" for="email">Email Perusahaan</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
<input v-model="email" class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-md pl-12 pr-md font-body-md text-on-surface focus:outline-none input-focus-ring transition-all placeholder:text-outline" id="email" placeholder="nama@perusahaan.com" type="email" required />
</div>
</div>
<!-- Password Field -->
<div class="space-y-xs">
<div class="flex justify-between items-end">
<label class="font-label-md text-label-md text-on-surface-variant transition-colors" for="password">Kata Sandi</label>
<a class="font-label-sm text-label-sm text-primary hover:underline transition-all" href="#">Lupa Kata Sandi?</a>
</div>
<div class="relative">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
<input v-model="password" class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-md pl-12 pr-12 font-body-md text-on-surface focus:outline-none input-focus-ring transition-all placeholder:text-outline" id="password" placeholder="••••••••" :type="showPassword ? 'text' : 'password'" required />
<button type="button" @click.prevent="togglePassword" class="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
  <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
</button>
</div>
</div>
<!-- Remember Me -->
<div class="flex items-center gap-sm pt-xs">
<label class="relative inline-flex items-center cursor-pointer">
<input v-model="rememberMe" class="sr-only peer" type="checkbox" value=""/>
<div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
</label>
<span class="font-label-md text-label-md text-on-surface-variant">Ingat Saya</span>
</div>
<!-- Primary Action -->
<button class="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-lg cyan-glow-button flex items-center justify-center gap-sm mt-md" type="submit" :disabled="isSubmitting">
<template v-if="isSubmitting">
  <span class="material-symbols-outlined animate-spin">progress_activity</span>
</template>
<template v-else-if="isSuccess">
  <span class="material-symbols-outlined">check_circle</span>
  <span>Berhasil</span>
</template>
<template v-else>
  <span>Masuk</span>
  <span class="material-symbols-outlined">arrow_forward</span>
</template>
</button>
<!-- Divider -->
<div class="relative flex items-center py-base">
<div class="flex-grow border-t border-white/5"></div>
<span class="flex-shrink mx-md font-label-sm text-label-sm text-outline uppercase tracking-widest">Atau</span>
<div class="flex-grow border-t border-white/5"></div>
</div>
<!-- SSO Action -->
<button class="w-full glass-panel hover:bg-white/5 text-on-surface font-label-md text-label-md py-md rounded-lg flex items-center justify-center gap-sm transition-all" type="button">
<svg class="w-5 h-5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
</svg>
<span>Masuk dengan SSO Perusahaan</span>
</button>
</form>
</div>
<!-- Footer -->
<footer class="mt-xl flex flex-wrap justify-center lg:justify-start gap-md border-t border-white/5 pt-md">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Help Center</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Compliance</a>
</footer>
<div class="mt-lg text-center lg:text-left">
<p class="font-label-sm text-label-sm text-outline">© 2024 SobatHR Enterprise. Secure Environment.</p>
</div>
</div>
</div>"""

spacing_map = {
    "-md": "-6",
    " md:": " md:",
    "-margin-desktop": "-16",
    "-base": "-2",
    "-lg": "-12",
    "-sm": "-3",
    "-xs": "-1",
    "-xl": "-20",
    "-margin-mobile": "-5"
}

import re

def replace_spacing(match):
    prefix = match.group(1)
    suffix = match.group(2)
    if "-" + suffix in spacing_map:
        return prefix + spacing_map["-" + suffix]
    return match.group(0)

# Replace class attributes
for k, v in spacing_map.items():
    if k.startswith("-"):
        html_content = re.sub(r'([a-z]+)' + k + r'\b', r'\1' + v, html_content)
        html_content = re.sub(r'([a-z]+-[a-z]+)' + k + r'\b', r'\1' + v, html_content)

print(html_content)

with open("converted.html", "w") as f:
    f.write(html_content)
