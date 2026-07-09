# Panduan Pengembangan & Debugging Mobile App (React Native + Expo)

Dokumen ini adalah referensi cepat untuk menjalankan, menguji, dan men-*debug* aplikasi mobile `mobile-app` di dalam ekosistem SobatHR. Aplikasi kita dibangun menggunakan Expo, sehingga proses *running* di perangkat fisik maupun emulator menjadi sangat mudah.

---

## 1. Menjalankan Aplikasi (*Running*)

Sebelum memulai, pastikan Anda sudah berada di dalam direktori proyek mobile:
```bash
cd mobile-app
```

### A. Di Perangkat Fisik (Sangat Direkomendasikan)
Cara termudah dan paling akurat untuk menguji aplikasi adalah langsung di HP Anda.
1. Unduh aplikasi **Expo Go** dari App Store (iOS) atau Google Play Store (Android).
2. Jalankan perintah berikut di terminal komputer Anda:
   ```bash
   npx expo start
   ```
3. Terminal akan memunculkan sebuah **QR Code**.
4. Buka aplikasi Expo Go di HP Anda, atau gunakan aplikasi Kamera bawaan (khusus iOS), lalu pindai (*scan*) QR Code tersebut.
5. *Voila!* Aplikasi akan langsung berjalan di layar ponsel Anda dan otomatis memperbarui diri (*hot-reload*) setiap Anda menyimpan perubahan kode.

### B. Di Emulator iOS (Mac)
Jika Anda tidak ingin menggunakan HP, Anda bisa memakai Simulator bawaan Xcode.
1. Pastikan **Xcode** sudah terpasang.
2. Jalankan perintah:
   ```bash
   npx expo start -i
   ```
   *(Atau tekan tombol `i` di terminal jika `npx expo start` sudah berjalan)*
3. Simulator iPhone akan otomatis terbuka dan memuat aplikasi.

### C. Di Emulator Android
1. Buka **Android Studio** dan jalankan *Virtual Device* (AVD) yang sudah Anda buat melalui menu *Device Manager*.
2. Setelah emulator menyala, jalankan perintah:
   ```bash
   npx expo start -a
   ```
   *(Atau tekan tombol `a` di terminal jika `npx expo start` sudah berjalan)*
3. Expo akan otomatis memasang dan membuka aplikasi di emulator Android Anda.

---

## 2. Proses Debugging

Expo menyediakan menu pengembang (*Developer Menu*) bawaan yang sangat kuat.

### Cara Membuka Developer Menu:
*   **Di Perangkat Fisik:** Goyangkan (*shake*) ponsel Anda secara fisik.
*   **Di iOS Simulator:** Tekan `Cmd ⌘ + D` atau `Cmd ⌘ + Ctrl + Z`.
*   **Di Android Emulator:** Tekan `Cmd ⌘ + M` (Mac) atau `Ctrl + M` (Windows).

### Fitur Debugging Utama:
1.  **Toggle Element Inspector:** Menginspeksi tata letak, warna, dan *margin* komponen secara langsung (mirip Inspect Element di web). Sangat berguna untuk men-debug NativeWind/Tailwind.
2.  **Open JS Debugger:** Akan membuka tab peramban Chrome tempat Anda bisa melihat `console.log()` dan memonitor aktivitas jaringan (*Network Request*).

---

## 3. Pemecahan Masalah Umum (*Troubleshooting*)

**Kasus:** Aplikasi macet (*crash*), perubahan kode/Tailwind tidak muncul, atau muncul pesan galat (*error*) aneh dari Metro bundler.

**Solusi Jitu:** Kosongkan *cache* Metro bundler. Matikan proses yang sedang berjalan (tekan `Ctrl + C`), lalu jalankan perintah ini:
```bash
npx expo start -c
```
*(Flag `-c` artinya membersihkan cache sepenuhnya dan membangun ulang modul proyek)*
