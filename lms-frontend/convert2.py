import json

# Tailwind CSS classes map
typography = {
    "body-lg": {"font-size": "18px", "line-height": "28px", "letter-spacing": "0.01em", "font-weight": "400"},
    "headline-lg": {"font-size": "30px", "line-height": "38px", "letter-spacing": "-0.01em", "font-weight": "600"},
    "label-md": {"font-size": "14px", "line-height": "20px", "letter-spacing": "0.05em", "font-weight": "500"},
    "body-md": {"font-size": "16px", "line-height": "24px", "letter-spacing": "0.01em", "font-weight": "400"},
    "display-lg": {"font-size": "48px", "line-height": "56px", "letter-spacing": "-0.02em", "font-weight": "700"},
    "label-sm": {"font-size": "12px", "line-height": "16px", "letter-spacing": "0.05em", "font-weight": "500"},
    "display-sm": {"font-size": "36px", "line-height": "44px", "letter-spacing": "-0.02em", "font-weight": "700"},
    "headline-md": {"font-size": "24px", "line-height": "32px", "letter-spacing": "-0.01em", "font-weight": "600"}
}

colors = {
    "on-surface": "#d4e4fa",
    "on-secondary-fixed-variant": "#3f465c",
    "primary-fixed-dim": "#4cd7f6",
    "inverse-on-surface": "#233143",
    "surface-container-highest": "#273647",
    "on-primary-fixed-variant": "#004e5c",
    "error": "#ffb4ab",
    "primary": "#4cd7f6",
    "outline-variant": "#3d494c",
    "on-error": "#690005",
    "tertiary-container": "#9ca7be",
    "on-tertiary": "#263143",
    "tertiary-fixed-dim": "#bcc7de",
    "surface-dim": "#051424",
    "secondary-container": "#3f465c",
    "secondary-fixed-dim": "#bec6e0",
    "on-tertiary-container": "#313c4f",
    "surface": "#051424",
    "primary-container": "#06b6d4",
    "on-background": "#d4e4fa",
    "on-secondary-container": "#adb4ce",
    "inverse-surface": "#d4e4fa",
    "surface-tint": "#4cd7f6",
    "surface-container": "#122131",
    "on-secondary": "#283044",
    "surface-container-low": "#0d1c2d",
    "background": "#051424",
    "surface-container-high": "#1c2b3c",
    "inverse-primary": "#00687a",
    "on-secondary-fixed": "#131b2e",
    "error-container": "#93000a",
    "secondary": "#bec6e0",
    "on-error-container": "#ffdad6",
    "surface-container-lowest": "#010f1f",
    "surface-variant": "#273647",
    "on-primary-container": "#00424f",
    "on-primary-fixed": "#001f26",
    "on-tertiary-fixed-variant": "#3c475a",
    "on-primary": "#003640",
    "secondary-fixed": "#dae2fd",
    "on-tertiary-fixed": "#111c2d",
    "primary-fixed": "#acedff",
    "tertiary": "#bcc7de",
    "on-surface-variant": "#bcc9cd",
    "outline": "#869397",
    "surface-bright": "#2c3a4c",
    "tertiary-fixed": "#d8e3fb"
}

tailwind_css = """@import "tailwindcss";

@theme {
"""

for k, v in colors.items():
    tailwind_css += f"  --color-{k}: {v};\n"

tailwind_css += "}\n\n"

for k, v in typography.items():
    tailwind_css += f"""@utility text-{k} {{
  font-family: 'Inter', sans-serif;
  font-size: {v['font-size']};
  line-height: {v['line-height']};
  letter-spacing: {v['letter-spacing']};
  font-weight: {v['font-weight']};
}}
@utility font-{k} {{
  font-family: 'Inter', sans-serif;
}}
"""

tailwind_css += """
body {
    background-color: #051424;
    color: #d4e4fa;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
}
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    display: inline-block;
    vertical-align: middle;
}
.glass-panel {
    background: rgba(30, 41, 59, 0.4);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.cyan-glow-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 0 rgba(6, 182, 212, 0);
}
.cyan-glow-button:hover {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
    transform: translateY(-1px);
}
.cyan-glow-button:active {
    transform: scale(0.98);
}
.input-focus-ring:focus {
    border-color: #4cd7f6;
    box-shadow: 0 0 0 2px rgba(76, 215, 246, 0.2);
    outline: none;
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
}
.floating-art {
    animation: float 8s ease-in-out infinite;
}
"""

with open('src/assets/tailwind.css', 'w') as f:
    f.write(tailwind_css)

with open('new_login.html', 'r') as f:
    html = f.read()

# Extract inner body content
import re
body_match = re.search(r'<body[^>]*>(.*)<!-- Micro-interaction', html, re.DOTALL)
if body_match:
    template = body_match.group(1)
    
    # Replace the spacing variables with literal values
    spacing = {
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
    
    # Only replace for gap, p, px, py, m, mx, my, mt, mb, ml, mr, w, h, space-y, space-x, right, left, top, bottom, rounded
    props = ['gap', 'p', 'px', 'py', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'w', 'h', 'space-y', 'space-x', 'right', 'left', 'top', 'bottom', 'rounded']
    
    for k, v in spacing.items():
        if k.startswith("-"):
            for p in props:
                template = re.sub(r'\b' + p + k + r'\b', p + v, template)
                template = re.sub(r'\b' + p + k + r' ', p + v + ' ', template)
                template = re.sub(r'\b' + p + k + r'"', p + v + '"', template)
    
    # Inject Vue script
    vue_file = f"""<script setup lang="ts">
import {{ ref }} from 'vue';
import {{ useRouter }} from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const isSubmitting = ref(false);
const isSuccess = ref(false);

const togglePassword = () => {{
  showPassword.value = !showPassword.value;
}};

const handleLogin = () => {{
  isSubmitting.value = true;
  
  // Simulate API call
  setTimeout(() => {{
    isSubmitting.value = false;
    isSuccess.value = true;
    
    // Redirect to dashboard
    setTimeout(() => {{
      router.push('/dashboard');
    }}, 1000);
  }}, 1500);
}};
</script>

<template>
  <div class="flex min-h-screen bg-surface">
{template}
  </div>
</template>
"""

    # Add v-models
    vue_file = vue_file.replace('id="email"', 'id="email" v-model="email" required')
    vue_file = vue_file.replace('id="password"', 'id="password" v-model="password" :type="showPassword ? \'text\' : \'password\'" required')
    vue_file = vue_file.replace('value=""', 'value="" v-model="rememberMe"')
    
    # Add form handler
    vue_file = vue_file.replace('onsubmit="event.preventDefault();"', '@submit.prevent="handleLogin"')
    
    # Password toggle button
    vue_file = vue_file.replace('type="password"', '')
    vue_file = vue_file.replace('<span class="material-symbols-outlined absolute left-6', '<span class="material-symbols-outlined absolute left-6 pointer-events-none')
    
    # Add toggle button to password field
    pw_field = """<input class="w-full bg-surface-container-lowest border border-outline-variant rounded-12 py-6 pl-12 pr-12 font-body-md text-on-surface focus:outline-none input-focus-ring transition-all placeholder:text-outline" id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="••••••••" />
<button type="button" @click.prevent="togglePassword" class="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
  <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
</button>"""
    vue_file = re.sub(r'<input class="w-full [^"]+" id="password" v-model="password"[^>]+>', pw_field, vue_file)
    
    # Button state
    btn = """<button class="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-6 rounded-12 cyan-glow-button flex items-center justify-center gap-3" type="submit" :disabled="isSubmitting">
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
</button>"""
    vue_file = re.sub(r'<button class="w-full bg-primary-container[^>]+>.*?</button>', btn, vue_file, flags=re.DOTALL)
    
    with open('src/views/LoginView.vue', 'w') as f:
        f.write(vue_file)
