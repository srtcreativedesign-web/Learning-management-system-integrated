import './assets/tailwind.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const SobatHRPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#f0f7fb',
            100: '#e1eff7',
            200: '#c3e0f0',
            300: '#a6d0e8',
            400: '#6ea1c9',
            500: '#419cc3', // Main Primer
            600: '#3a8bb0',
            700: '#317594',
            800: '#275e77',
            900: '#204d61',
            950: '#163544'
        }
    }
});

const app = createApp(App)

app.use(MotionPlugin)

app.use(PrimeVue, {
    theme: {
        preset: SobatHRPreset,
        options: {
            darkModeSelector: 'system'
        }
    }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
