Project Guide: SobatHR LMS & Audit Expansion

Dokumen ini berfungsi sebagai pedoman pengembangan untuk tim IT dalam membangun ekosistem pembelajaran (LMS) dan audit internal.

1. Project Blueprint (Arsitektur & Filosofi)

Visi: Mengubah SobatHR menjadi Super App karyawan dengan fitur pembelajaran terintegrasi dan sistem audit lapangan yang tangguh (offline-first).

Arsitektur: Hybrid Monolithic-Microservices. LMS & Audit memiliki backend terpisah (Nest.js + PostgreSQL) namun tetap terintegrasi secara fungsional (SSO/API) dengan Laravel HRIS.

Prinsip Utama:

Document-First: Fokus pada konten PDF untuk fase MVP.

Offline-First: Aplikasi Audit wajib berfungsi penuh di area tanpa internet.

Seamless SSO: Integrasi token HRIS ke seluruh platform baru.

2. Product Requirements Document (PRD) - MVP

A. Komponen Sistem

LMS Web Admin (Vue.js 3): Panel manajemen untuk tim TnD.

SobatHR Mobile (Existing - Flutter): Modul akses belajar karyawan.

Audit App (React Native): Aplikasi mobile khusus auditor (Offline-first).

API Gateway (Nest.js): Jembatan data dan logika bisnis LMS/Audit.

B. Fitur Utama (User Stories)

Admin TnD: Upload materi (PDF), buat kuis, assign kursus berdasarkan division_id.

Karyawan: Learning Dashboard, baca materi (watermark NIK secara dinamis di sisi klien/frontend untuk meminimalisir beban server), kuis & sertifikat otomatis.

Auditor: Checklist dinamis, foto temuan (lokal), generate CAPA Ticket. (Catatan: Proses upload foto secara offline dilakukan sebagai background task terpisah dari pengiriman data teks inspeksi untuk mencegah antrean sinkronisasi tersumbat).

3. Design Infrastructure

A. Stack Teknologi

Backend: Nest.js (TypeScript) + PostgreSQL.

Web Admin: Vue.js 3 + Pinia + TailwindCSS.

Mobile Audit: React Native (Expo) + WatermelonDB (Offline storage).

Storage: S3-Compatible Storage (AWS S3 atau MinIO). Wajib mengimplementasikan Pre-signed URLs dengan waktu kedaluwarsa singkat (misal 15 menit) untuk semua dokumen PDF demi keamanan dan mencegah kebocoran materi.

B. Design System (UI/UX Guidelines)

Agar konsisten dengan SobatHR, terapkan standar berikut:

Color Palette:

Primary: Gunakan brand color SobatHR (misal: Indigo-600).

Action (Audit): Emerald-500 (Success) & Amber-500 (Warning).

Typography: Sans-serif (Inter atau sistem bawaan OS) untuk keterbacaan tinggi di mobile.

Component Library:

Gunakan TailwindCSS utility classes untuk fleksibilitas.

Wajib memiliki Shared Component untuk: Button, DataTable, FormInput, Badge, dan Modal.

Mobile Audit UI: Gunakan desain High Contrast untuk kemudahan penggunaan di lapangan (cahaya terik).

Consistency: Semua interaksi loading menggunakan Skeleton Screen untuk performa yang terasa lebih cepat.

4. Struktur Database (Schema Design)

Sistem LMS & Audit menggunakan database terpisah namun memiliki Shadow Tables (Sync Data dari HRIS).
*Penting: Gunakan pendekatan Event-Driven (seperti Webhook dari Laravel HRIS ke API Nest.js) untuk memperbarui data Shadow Tables secara real-time, hindari penggunaan sinkronisasi berbasis cron harian agar data pegawai selalu akurat.*

A. Master Data (Sync from HRIS)

users_shadow: id, hris_user_id, full_name, email

divisions_shadow: id, hris_division_id, name

B. LMS Tables

courses: id, title, description, thumbnail_url

course_materials: id, course_id, type (pdf/quiz), content_url, min_read_time

employee_course_progress: id, user_id, course_id, status (enrolled, completed)

employee_quiz_attempts: id, user_id, quiz_id, score, is_passed

C. Audit Tables

audit_templates: id, title, version

audit_checklists: id, template_id, question_text

audit_inspections: id, auditor_id, division_id, status

audit_findings: id, inspection_id, checklist_id, notes, photo_path (local storage path & remote S3 URL), is_compliant, sync_status (pending/syncing/synced/failed), last_modified_at

5. Roadmap & Milestones (14 Minggu)

Minggu 1-2: Foundation & API Auth. Setup Nest.js, DB, dan integrasi SSO HRIS. Segera rancang API contract (Swagger/OpenAPI) agar tim Frontend dan Mobile dapat mulai pengembangan secara paralel dari hari pertama.

Minggu 3-5: LMS Core Engine. Modul upload materi (PDF) dan tracker progres.

Minggu 6-8: Audit Module. Checklist builder dan App Audit (React Native). (Catatan: Alokasikan waktu QA/UAT yang signifikan untuk pengujian sinkronisasi offline-first dan penanganan konflik).

Minggu 9-10: Quiz & Gamification. Logika kuis dan sertifikat.

Minggu 11-12: Super App Integration. Embedding LMS ke aplikasi SobatHR.

Minggu 13-14: Uji Coba & Deployment. QA Testing dan UAT.

6. Strict Coding Standards & Architecture

A. Pendekatan Komponen (Front-End & Mobile)
Wajib mematuhi pola Component-Driven Development. Halaman (Pages/Screens) DILARANG keras berisi komponen UI yang kotor (hardcoded).
- `components/ui`: Khusus untuk komponen dasar yang murni (Dumb Components) seperti Button, InputField, Card, Badge. Komponen ini tidak boleh melakukan pemanggilan API.
- `components/[feature]`: Khusus untuk komponen gabungan yang terkait dengan suatu fitur, contohnya `components/auth/LoginHeader`.
- Halaman (di Vue atau direktori `app/` di Expo Router) HANYA bertugas sebagai wadah (container) yang merakit komponen-komponen ini dan menangani logika bisnis (API Calls, State Management).

B. Pendekatan Berlapis (Backend Nest.js / MVC)
Logic DILARANG keras ditumpuk pada satu berkas. Ikuti pemisahan struktur (Separation of Concerns) secara tegas:
- Controllers (`*.controller.ts`): HANYA berfungsi sebagai pintu gerbang. Tugasnya menerima permintaan HTTP (Request), memvalidasi DTO, memanggil Service, dan mengembalikan Respons (HTTP Status). Dilarang menaruh logika bisnis kompleks di sini.
- Services (`*.service.ts`): Tempat di mana seluruh logika bisnis (algoritma aplikasi) bersarang.
- Prisma/Repository: Sentralisasi semua akses langsung ke database. Service akan berinteraksi dengan Prisma untuk operasi pangkalan data.