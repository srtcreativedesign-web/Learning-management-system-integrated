# Task: Rank Rewards (hadiah per level gamifikasi)

## Context

Mobile app SobatHR (`sobat-hr/sobat-mobile`) menampilkan halaman "Kuis & Ujian" dengan card
"Progres Levelling Anda" (rank + XP + progress bar). Di bawah card itu sekarang ada section baru
"Hadiah Setiap Level" yang menampilkan daftar rank beserta hadiahnya (voucher makan, voucher
belanja, dsb), dengan rank yang sudah tercapai ditandai unlock dan rank saat ini diberi badge
"Level Anda".

Data reward ini **harus bisa diatur oleh admin dari sisi tnd-lms** (bukan hardcode di mobile
app), supaya HR bisa mengubah nilai/nominal hadiah tanpa perlu update aplikasi mobile.

Backend `sobat-api` (Laravel) sudah proxy siap pakai di `LmsService::getRankRewards()` /
`KnowledgeHubController::getRankRewards()`, memanggil:

```
GET {LMS_BASE_URL}/api/gamification/rank-rewards
```

Endpoint ini **belum ada** di tnd-lms — sobat-api saat ini fallback ke data statis
(`LmsService::defaultRankRewards()`) supaya mobile app tidak kosong/error sementara endpoint ini
belum dibuat. Begitu endpoint di bawah ini live, sobat-api otomatis pakai data dari LMS tanpa
perlu perubahan apa pun di sisi Laravel/mobile.

## Rank yang harus dipakai (JANGAN diubah namanya)

Sumber kebenaran ada di `src/gamification/gamification.service.ts`, fungsi `determineRank()`:

```ts
export function determineRank(xp: number): string {
  if (xp <= 100) return 'Pemula';
  if (xp <= 300) return 'Pembelajar Aktif';
  if (xp <= 600) return 'Karyawan Terampil';
  if (xp <= 1000) return 'Master Pengetahuan';
  return 'Pakar SobatHR';
}
```

`rank_name` di model/endpoint baru **harus persis sama string-nya** dengan nilai di atas — mobile
app mencocokkan rank secara string untuk highlight "Level Anda".

## Yang perlu dibuat

### 1. Prisma model `RankReward`

Tambahkan ke `prisma/schema.prisma`:

```prisma
model RankReward {
  id                 String   @id @default(uuid())
  rank_name          String   @unique
  min_xp             Int
  reward_title       String
  reward_description String?
  is_active          Boolean  @default(true)
  created_at         DateTime @default(now())
  updated_at         DateTime @updatedAt

  @@map("rank_rewards")
}
```

Buat migration (`npx prisma migrate dev --name add_rank_rewards`), lalu seed 5 baris default ini
(nilai sama persis dengan fallback di `sobat-api/app/Services/LmsService.php` supaya transisi
mulus, HR bisa ubah nominalnya belakangan lewat admin panel):

| rank_name | min_xp | reward_title | reward_description |
|---|---|---|---|
| Pemula | 0 | Badge Digital Pemula | Lencana digital penanda awal perjalanan belajar Anda. |
| Pembelajar Aktif | 100 | Voucher Makan Rp 50.000 | Berlaku di seluruh outlet perusahaan. |
| Karyawan Terampil | 300 | Voucher Makan Rp 100.000 | Berlaku di seluruh outlet perusahaan. |
| Master Pengetahuan | 600 | Voucher Belanja Rp 200.000 | Voucher belanja dari partner perusahaan. |
| Pakar SobatHR | 1000 | Merchandise Eksklusif + Sertifikat | Merchandise resmi perusahaan dan sertifikat digital pencapaian tertinggi. |

### 2. Endpoint publik (dipanggil sobat-api)

Tambahkan ke `src/gamification/gamification.controller.ts`:

```ts
@Get('rank-rewards')
@ApiOperation({ summary: 'Get reward list per rank/level' })
async getRankRewards() {
  return this.gamificationService.getRankRewards();
}
```

Dan di `gamification.service.ts`:

```ts
async getRankRewards() {
  return this.prisma.rankReward.findMany({
    where: { is_active: true },
    orderBy: { min_xp: 'asc' },
  });
}
```

Response array item **harus** punya field: `rank_name` (string), `min_xp` (number),
`reward_title` (string), `reward_description` (string, boleh null/kosong). Field lain (id,
is_active, timestamps) boleh ikut terbawa, sobat-api hanya membaca 4 field di atas.

### 3. Admin CRUD (opsional, untuk HR mengubah hadiah tanpa akses database langsung)

Kalau tnd-lms sudah punya admin panel untuk resource lain (Course/Quiz), tambahkan CRUD serupa
untuk `RankReward` di controller admin yang sama (list/create/update/delete), dengan validasi:
- `rank_name` harus salah satu dari 5 nilai `determineRank()` di atas (jangan biarkan admin bikin
  rank baru sembarangan — kalau butuh rank baru, itu perubahan terpisah yang juga harus disinkron
  ke `determineRank()` dan ke mobile app).
- `min_xp` harus non-negatif, idealnya divalidasi urut sesuai threshold `determineRank()`.

## Yang TIDAK perlu dikerjakan

- Tidak perlu ubah `determineRank()` atau logika XP/rank yang sudah ada.
- Tidak perlu sentuh sobat-api atau sobat-mobile — keduanya sudah siap konsumsi endpoint ini.
- Tidak perlu bikin endpoint auth-protected khusus — endpoint lain di controller ini
  (`profile/:hrisUserId`, `leaderboard`) juga publik tanpa guard, ikuti pola yang sama untuk
  konsistensi (auth end-user sudah ditangani di level sobat-api sebelum proxy ke sini).

## Cara verifikasi

```bash
curl http://localhost:3001/api/gamification/rank-rewards
```

Harus balas array 5 object sesuai tabel di atas. Setelah itu, dari sisi sobat-api tinggal jalankan
lagi (tidak perlu deploy ulang) — `LmsService::getRankRewards()` akan otomatis memakai data ini,
bukan fallback statis lagi.
