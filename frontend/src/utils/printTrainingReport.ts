export interface TrainingReportPrintData {
  periodLabel: string;
  summary: {
    totalTrainingEvents: number;
    totalPassedEvents: number;
    overallPassRate: number;
    totalTraineesTrained: number;
    totalXpAwarded: number;
    online: {
      totalAttempts: number;
      passedAttempts: number;
      passRate: number;
      avgScore: number;
    };
    inHouse: {
      totalSessions: number;
      passedSessions: number;
      passRate: number;
      avgPercentage: number;
      gradeDistribution: { SB: number; B: number; C: number; K: number };
    };
  };
  coursePerformance: Array<{
    title: string;
    totalAttempts: number;
    passedCount: number;
    passRate: number;
    avgScore: number;
  }>;
  outletPerformance: Array<{
    outletName: string;
    totalSessions: number;
    passedCount: number;
    passRate: number;
    avgPercentage: number;
  }>;
  recentRecords: Array<{
    date: string;
    traineeName: string;
    typeLabel: string;
    title: string;
    score: number;
    grade: string;
    isPassed: boolean;
    trainerName?: string | null;
  }>;
}

export function printTrainingReport(data: TrainingReportPrintData) {
  const printTime = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const docCode = `DOC/TND-REP/${new Date().getFullYear()}/${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Rekapitulasi Training - TnD LMS</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          font-size: 11px;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #0284c7;
          padding-bottom: 12px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .brand-title {
          font-size: 18px;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .doc-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 2px;
        }
        .meta-text {
          font-size: 10px;
          color: #64748b;
          text-align: right;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .kpi-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }
        .kpi-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 4px;
        }
        .kpi-value {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }
        .kpi-sub {
          font-size: 9px;
          color: #0284c7;
          margin-top: 2px;
        }
        .section-title {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
          margin-top: 14px;
          margin-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
        }
        th {
          background: #f1f5f9;
          color: #475569;
          font-weight: 700;
          font-size: 10px;
          text-align: left;
          padding: 6px 8px;
          border: 1px solid #cbd5e1;
        }
        td {
          padding: 5px 8px;
          border: 1px solid #e2e8f0;
          font-size: 10px;
        }
        tr:nth-child(even) td {
          background-color: #f8fafc;
        }
        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
        }
        .badge-passed {
          background: #dcfce7;
          color: #166534;
        }
        .badge-failed {
          background: #ffe4e6;
          color: #9f1239;
        }
        .signature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 30px;
          page-break-inside: avoid;
        }
        .sig-box {
          border-top: 1px dashed #94a3b8;
          padding-top: 60px;
          text-align: center;
          font-size: 10px;
        }
        .sig-title {
          font-weight: 700;
          color: #0f172a;
        }
        .footer {
          margin-top: 20px;
          font-size: 8px;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand-title">TnD Learning Management System</div>
          <div class="doc-title">Laporan Eksekutif Rekapitulasi Pelatihan & Kompetensi</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 3px;">Periode: <strong>${data.periodLabel}</strong></div>
        </div>
        <div class="meta-text">
          <div>No. Dokumen: <strong>${docCode}</strong></div>
          <div>Dicetak pada: ${printTime}</div>
          <div>Status: <strong>Resmi (Terverifikasi)</strong></div>
        </div>
      </div>

      <!-- KPI Overview -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Pelatihan</div>
          <div class="kpi-value">${data.summary.totalTrainingEvents}</div>
          <div class="kpi-sub">${data.summary.online.totalAttempts} Kuis + ${data.summary.inHouse.totalSessions} In-House</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Tingkat Kelulusan</div>
          <div class="kpi-value">${data.summary.overallPassRate}%</div>
          <div class="kpi-sub">${data.summary.totalPassedEvents} Peserta Lulus</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Karyawan Terlatih</div>
          <div class="kpi-value">${data.summary.totalTraineesTrained}</div>
          <div class="kpi-sub">Total Peserta Unik</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Reward XP</div>
          <div class="kpi-value">${data.summary.totalXpAwarded.toLocaleString('id-ID')} XP</div>
          <div class="kpi-sub">Poin Gamifikasi</div>
        </div>
      </div>

      <!-- Comparison Modality -->
      <div class="section-title">1. Ringkasan Performa Modalitas Pelatihan</div>
      <table>
        <thead>
          <tr>
            <th>Kategori Modalitas</th>
            <th style="text-align:center;">Total Sesi/Pengerjaan</th>
            <th style="text-align:center;">Jumlah Lulus</th>
            <th style="text-align:center;">Tingkat Kelulusan (%)</th>
            <th style="text-align:center;">Rata-rata Nilai</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Online E-Learning (LMS Quiz)</strong></td>
            <td style="text-align:center;">${data.summary.online.totalAttempts}</td>
            <td style="text-align:center;">${data.summary.online.passedAttempts}</td>
            <td style="text-align:center;"><strong>${data.summary.online.passRate}%</strong></td>
            <td style="text-align:center;">${data.summary.online.avgScore} / 100</td>
          </tr>
          <tr>
            <td><strong>In-House Training (Praktik Outlet)</strong></td>
            <td style="text-align:center;">${data.summary.inHouse.totalSessions}</td>
            <td style="text-align:center;">${data.summary.inHouse.passedSessions}</td>
            <td style="text-align:center;"><strong>${data.summary.inHouse.passRate}%</strong></td>
            <td style="text-align:center;">${data.summary.inHouse.avgPercentage}%</td>
          </tr>
        </tbody>
      </table>

      <!-- Top Courses -->
      ${
        data.coursePerformance.length > 0
          ? `
        <div class="section-title">2. Performa Modul Pelatihan Online</div>
        <table>
          <thead>
            <tr>
              <th>Judul Modul Kursus</th>
              <th style="text-align:center;">Total Pengerjaan</th>
              <th style="text-align:center;">Lulus</th>
              <th style="text-align:center;">Pass Rate</th>
              <th style="text-align:center;">Rata-rata Skor</th>
            </tr>
          </thead>
          <tbody>
            ${data.coursePerformance
              .slice(0, 6)
              .map(
                (c) => `
              <tr>
                <td>${c.title}</td>
                <td style="text-align:center;">${c.totalAttempts}</td>
                <td style="text-align:center;">${c.passedCount}</td>
                <td style="text-align:center;">${c.passRate}%</td>
                <td style="text-align:center;">${c.avgScore}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      <!-- Top Outlets -->
      ${
        data.outletPerformance.length > 0
          ? `
        <div class="section-title">3. Evaluasi Pelatihan Outlet Cabang</div>
        <table>
          <thead>
            <tr>
              <th>Nama Outlet Cabang</th>
              <th style="text-align:center;">Total Sesi Praktik</th>
              <th style="text-align:center;">Sesi Lulus</th>
              <th style="text-align:center;">Pass Rate</th>
              <th style="text-align:center;">Rata-rata Nilai</th>
            </tr>
          </thead>
          <tbody>
            ${data.outletPerformance
              .slice(0, 6)
              .map(
                (o) => `
              <tr>
                <td>${o.outletName}</td>
                <td style="text-align:center;">${o.totalSessions}</td>
                <td style="text-align:center;">${o.passedCount}</td>
                <td style="text-align:center;">${o.passRate}%</td>
                <td style="text-align:center;">${o.avgPercentage}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      <!-- Recent Records Sample -->
      ${
        data.recentRecords.length > 0
          ? `
        <div class="section-title">4. Catatan Riwayat Pelatihan Terkini</div>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Peserta</th>
              <th>Tipe & Judul Training</th>
              <th style="text-align:center;">Skor / Grade</th>
              <th style="text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.recentRecords
              .slice(0, 10)
              .map(
                (r) => `
              <tr>
                <td>${new Date(r.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td><strong>${r.traineeName}</strong></td>
                <td><span style="color:#0284c7;font-size:9px;">[${r.typeLabel}]</span> ${r.title}</td>
                <td style="text-align:center;"><strong>${r.score}</strong> (${r.grade})</td>
                <td style="text-align:center;">
                  <span class="badge ${r.isPassed ? 'badge-passed' : 'badge-failed'}">
                    ${r.isPassed ? 'LULUS' : 'REMIDI'}
                  </span>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : ''
      }

      <!-- Signatures -->
      <div class="signature-grid">
        <div class="sig-box">
          <div class="sig-title">Disusun Oleh:</div>
          <div style="color: #64748b; margin-top: 4px;">TnD Specialist / Trainer</div>
        </div>
        <div class="sig-box">
          <div class="sig-title">Ditinjau Oleh:</div>
          <div style="color: #64748b; margin-top: 4px;">HRBP Manager</div>
        </div>
        <div class="sig-box">
          <div class="sig-title">Disetujui Oleh:</div>
          <div style="color: #64748b; margin-top: 4px;">Head of People & Culture</div>
        </div>
      </div>

      <div class="footer">
        Dokumen ini dibuat otomatis oleh Sistem Informasi Training & Development LMS. Dicetak pada ${printTime}.
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
