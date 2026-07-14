# Panduan Mengatasi Docker & Server yang Terhenti (Force Restart Guide)

Dokumen ini adalah panduan ringkas langkah demi langkah yang dapat Anda ikuti apabila komputer/Mac Anda baru saja mengalami *restart*, mati mendadak, atau apabila aplikasi **Docker Desktop** mengalami *stuck* (tidak bisa dibuka/loading terus-menerus).

## 1. Mematikan Paksa (Force Kill) Docker yang Stuck
Seringkali, walaupun aplikasi Docker sudah di-close, ada proses-proses *background* yang masih tersangkut dan membuat Docker tidak bisa dibuka kembali. Buka aplikasi **Terminal** di Mac Anda, lalu jalankan perintah berikut secara berurutan:

```bash
# Mematikan seluruh layanan background Docker secara paksa
killall Docker "Docker Desktop" com.docker.backend com.docker.build com.docker.virtualization com.docker.helper
```

> [!NOTE]
> Jika muncul pesan `No matching processes belonging to you were found`, abaikan saja. Itu artinya proses tersebut memang sudah dalam keadaan mati.

## 2. Membuka Kembali Docker Desktop
Setelah semua proses bersih, buka kembali Docker melalui terminal:

```bash
open -a Docker
```
*(Tunggu sekitar 1-2 menit hingga ikon ikan paus Docker di menu bar atas Mac berhenti bergerak/animasi loading selesai).*

## 3. Menghidupkan Kontainer Database (PostgreSQL)
Setelah Mac me-restart, kontainer database terkadang dalam posisi berhenti (Exited). Nyalakan kembali kontainer database LMS Anda dengan perintah:

```bash
docker start tnd_postgres
```
*(Pastikan Anda juga menyalakan kontainer database HRIS jika diperlukan, misalnya `docker start hris_postgres` / sesuaikan dengan nama kontainernya).*

## 4. Menjalankan Kembali Server Backend & Frontend
Server lokal tidak berjalan otomatis setelah komputer menyala ulang. Buka terminal baru dan arahkan ke dalam *root* proyek Anda (`tnd-lms`).

**A. Menyalakan Backend (NestJS)**
```bash
cd backend
npm run start:dev
```

**B. Menyalakan Frontend (Vue)**
Buka *tab* terminal baru (tekan `Cmd + T`), lalu jalankan:
```bash
cd lms-frontend
npm run dev
```

---
🎉 **Selesai!** Jika semua langkah di atas dijalankan, sistem LMS dan HRIS Anda sudah terhubung kembali dan siap digunakan untuk *development* atau *testing*.
