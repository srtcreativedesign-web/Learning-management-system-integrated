
# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# TnD LMS & AUDIT MANAGEMENT SYSTEM

---

## 1. Executive Summary & Vision

**TnD LMS & Audit Management System** (Training and Development Learning Management System) adalah platform terintegrasi berbasis web dan mobile yang dirancang untuk mengelola seluruh siklus pelatihan karyawan, standarisasi operasional (SOP), evaluasi kompetensi berbasis kecerdasan buatan (AI), gamifikasi karyawan, serta audit kepatuhan outlet/lapangan secara real-time.

Platform ini terintegrasi langsung dengan ekosistem **SobatHR (Laravel HRIS)** untuk sinkronisasi data master karyawan, divisi, dan outlet, serta pelaporan kelulusan melalui webhook sertifikat otomatis.

---

## 2. Target Users & Stakeholders

| Role | Deskripsi & Tanggung Jawab Utama |
| :--- | :--- |
| **Training & Development (TnD) Admin / Instruktur** | Mengunggah materi kursus (PDF/Video), men-generate soal kuis menggunakan AI, mengatur standar kelulusan, memantau riwayat kuis, dan mengelola poin XP/peringkat. |
| **Auditor / Quality Assurance (QA)** | Melakukan inspeksi kepatuhan di outlet, mengisi checklist audit operasional, mengunggah bukti foto temuan, dan menerbitkan laporan inspeksi. |
| **HR & Management** | Memantau KPI pembelajaran organisasi, tingkat partisipasi karyawan, leaderboard XP, serta sinkronisasi data HRIS. |
| **Karyawan / Trainee (Mobile User)** | Membaca modul pelatihan, mengerjakan kuis interaktif, membaca langkah kerja SOP, meraih poin XP, dan mendapatkan sertifikat kompetensi. |

---

## 3. System Architecture & Tech Stack

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|  - Web Admin: React 18, Vite, Tailwind CSS v3, Radix UI, TanStack Query |
|  - Mobile Client: SobatHR App (Flutter / React Native / Web View)       |
+------------------------------------+------------------------------------+
                                     | (REST API / JSON / JWT)
                                     v
+-------------------------------------------------------------------------+
|                                BACKEND                                  |
|  - Framework: NestJS 11 + TypeScript                                    |
|  - ORM: Prisma ORM v7                                                   |
|  - Asynchronous Webhook Dispatcher (Fire-and-Forget, 5s Timeout)        |
+-------------------+-----------------+-------------------+---------------+
                    |                 |                   |
                    v                 v                   v
            +---------------+  +--------------+  +------------------+
            |  PostgreSQL   |  |   Groq AI    |  |   Laravel HRIS   |
            |   Database    |  |  (LLM Engine)|  |    (SobatHR)     |
            +---------------+  +--------------+  +------------------+
```

### 3.1 Technology Stack
- **Frontend Admin Panel**: React 18, Vite, TypeScript, Tailwind CSS v3, Radix UI Primitives, TanStack React Query v5, Chart.js, Lucide Icons, GSAP Context.
- **Backend API**: NestJS 11, TypeScript, Prisma ORM 7, RxJS, Axios, PDF-Parse, Multer.
- **AI & Machine Learning Engine**: Groq Cloud SDK (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`).
- **Database**: PostgreSQL with Prisma Schema migrations & seeders.
- **Integration**: RESTful Webhooks (JSON, Non-blocking Fire-and-Forget).

---

## 4. Core Functional Modules

### 4.1 Modul 1: Pustaka Materi & Kursus (Course Management)
- **Upload Materi Multi-Format**: Mendukung modul pembelajaran format PDF dan Video Pelatihan.
- **Ekstraksi Konten Otomatis**: Backend secara otomatis mengekstrak teks dari PDF materi untuk diolah oleh sistem AI.
- **Pelacakan Durasi Baca (*Min Read Time*)**: Memastikan karyawan membaca materi sesuai batas waktu minimum sebelum dapat mengakses kuis evaluasi.
- **Reward Points (XP)**: Pengaturan reward XP untuk setiap modul yang berhasil diselesaikan dan lulus kuis.

### 4.2 Modul 2: AI-Powered Quiz Generator & Evaluasi
- **Dropdown Pemilihan Materi**: Instruktur dapat memilih modul materi yang sudah diunggah di database.
- **Generasi Soal Otomatis oleh AI**:
  - AI membaca seluruh isi teks dokumen materi.
  - Menghasilkan ringkasan (*summary*) komprehensif dari materi.
  - Memproduksi **5 butir soal pilihan ganda** relevan dengan 3–4 opsi pilihan dan 1 kunci jawaban yang tepat.
- **Editor & Review Kuis**: Instruktur dapat menyunting teks soal, mengubah teks pilihan, serta mengubah kunci jawaban secara fleksibel sebelum publikasi.
- **Passing Score & Scoring System**: Konfigurasi nilai minimum kelulusan (default: 80).
- **Anti-Cheating API**: Endpoint pengambilan soal untuk sisi mobile menyembunyikan flag `is_correct` agar tidak dapat dimanipulasi di sisi klien.

### 4.3 Modul 3: Integrasi SobatHR & Webhook Sertifikat
- **Sinkronisasi Data Shadow (HRIS Sync)**:
  - Sinkronisasi Karyawan (`UserShadow`): Nama lengkap, email, tanggal bergabung, rank, dan akumulasi XP.
  - Sinkronisasi Divisi (`DivisionShadow`) dan Outlet Organisasi (`Outlet`).
- **Non-Blocking Fire-and-Forget Webhook**:
  - Ketika karyawan lulus kuis (`is_passed: true`), backend LMS langsung mentrigger webhook ke Laravel HRIS (`POST /api/webhooks/lms/certificate-trigger`) secara asinkron tanpa menahan (*await*) response ke klien.
  - Payload nested terstandarisasi:
    ```json
    {
      "event": "quiz.passed",
      "data": {
        "user_id": "UUID-LMS",
        "hris_user_id": "HRIS-ID",
        "quiz_id": "UUID-QUIZ",
        "attempt_id": "UUID-ATTEMPT",
        "score": 85,
        "is_passed": true
      }
    }
    ```
  - Dilengkapi timeout eksplisit (5 detik) untuk mencegah deadlock antar-layanan.

### 4.4 Modul 4: Gamifikasi, Rank & Leaderboard
- **Tiering Peringkat Otomatis**:
  - `0 - 100 XP`: **Pemula**
  - `101 - 300 XP`: **Pembelajar Aktif**
  - `301 - 600 XP`: **Karyawan Terampil**
  - `601 - 1000 XP`: **Master Pengetahuan**
  - `> 1000 XP`: **Pakar SobatHR**
- **Papan Peringkat (Leaderboard)**: Menampilkan ranking karyawan tertinggi berdasarkan total XP per divisi maupun global.
- **XP Audit Trail**: Pencatatan histori perubahan XP, baik yang didapat dari kursus maupun penyesuaian manual oleh admin dengan keterangan alasan.

### 4.5 Modul 5: Sistem Audit Lapangan & Manajemen Outlet
- **Manajemen Outlet & Perangkat**: Data koordinat GPS (latitude, longitude), kode perangkat mesin kasir, dan status outlet.
- **Checklist Builder**: Konfigurasi template inspeksi berkategori dengan bobot dan kriteria pertanyaan dinamis.
- **Alur Inspeksi Audit**:
  - Status inspeksi: `draft` -> `submitted` -> `approved`.
  - Pencatatan temuan (*findings*) dengan status kepatuhan (`is_compliant`), catatan auditor, foto bukti temuan, dan status sinkronisasi offline-online.
- **Laporan & Evaluasi Audit**: Analitik kepatuhan per outlet dan per kategori checklist.

### 4.6 Modul 6: Pustaka Standar Operasional Prosedur (SOP)
- **Kategorisasi Dokumen**: Pembagian SOP Head Office vs SOP Operasional Outlet.
- **Ekstraksi Poin SOP oleh AI**: Dokumen PDF SOP panjang diekstrak otomatis menjadi kartu-kartu langkah kerja (*step-by-step*) terstruktur yang mudah dipahami karyawan.
- **Viewer Interaktif**: Tampilan panduan visual SOP langkah demi langkah untuk referensi cepat di tempat kerja.

---

## 5. Database Schema & Data Models

### Entitas Utama:
1. **`UserShadow` / `DivisionShadow`**: Mirror master data HRIS dengan kolom gamifikasi (`total_xp`, `current_rank`).
2. **`Course` & `CourseMaterial`**: Modul materi pelatihan beserta URL aset dan batas waktu minimum baca.
3. **`Quiz`, `QuizQuestion`, `QuizOption`**: Struktur hierarkis kuis evaluasi.
4. **`CertificateTemplate`**: Template desain sertifikat kelulusan berbasis koordinat dinamis.
5. **`EmployeeQuizAttempt` & `EmployeeCourseProgress`**: Histori pengerjaan kuis, skor kelulusan, dan detail jawaban peserta.
6. **`AuditTemplate`, `AuditChecklist`, `AuditInspection`, `AuditFinding`**: Transaksi inspeksi lapangan beserta bukti kepatuhan.
7. **`SopDocument` & `SopPoint`**: Dokumen SOP dan poin langkah kerja hasil ekstraksi AI.
8. **`XpAuditTrail`**: Log audit jejak perolehan dan penyesuaian poin XP karyawan.

---

## 6. Non-Functional & Security Requirements

1. **Keamanan & Integritas Soal (Anti-Tampering)**:
   - Endpoint kuis publik/mobile tidak mengembalikan kolom `is_correct` pada pilihan jawaban.
   - Penilaian skor dan pemberian reward XP diverifikasi secara sentral di server (*server-side evaluation*).
2. **Kinerja & Skalabilitas (*High Availability*)**:
   - Webhook keluar menggunakan mekanisme *fire-and-forget* dengan timeout 5 detik untuk mencegah antrian terhambat.
   - Query data analitik dan tabel menggunakan indexing pada kolom relasi (UUID/ID).
3. **Desain & Responsivitas UI**:
   - Sidebar navigasi mendukung mode penuh dan mode ciut (*icon-collapsed mode*) dengan centering presisi dan visual high-contrast.
   - Komponen tabel, kartu KPI, dan chart dibuat mandiri (*reusable components*).
4. **Resiliensi AI (*Graceful Fallback*)**:
   - Integrasi model LLM dilengkapi multi-model fallback (`openai/gpt-oss-120b` -> `openai/gpt-oss-20b` -> `qwen/qwen3.6-27b`) untuk menjamin 99.9% uptime generasi kuis.

---

## 7. Release Milestones & Roadmap

| Fase | Target Delivery | Deliverables Utama |
| :--- | :--- | :--- |
| **Fase 1 (Selesai)** | Core LMS & Admin Panel | React + Vite UI, Modul Kursus, NestJS Backend, Prisma Database Schema, Reusable Components. |
| **Fase 2 (Selesai)** | Integrasi AI & Webhook | AI Quiz Generator Groq, Ekstraksi SOP AI, Webhook Non-blocking ke Laravel HRIS, Gamifikasi Tiering. |
| **Fase 3 (Aktif)** | Audit & Mobile Integration | Inspeksi Audit Lapangan, Mobile Quiz Submission di SobatHR, Evaluasi Real-time. |
| **Fase 4 (Roadmap)** | Advanced Analytics & Offline PWA | Laporan Prediktif AI untuk tren kelemahan modul, Mode Offline Audit PWA dengan Sinkronisasi Background. |
