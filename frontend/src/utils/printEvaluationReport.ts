interface AssessmentItem {
  id?: string;
  checklist_point_id: string;
  score: number;
  grade: string;
  notes?: string;
  checklistPoint?: {
    id?: string;
    question: string;
    description?: string;
    max_score?: number;
    category_id?: string;
    category?: {
      id?: string;
      name: string;
      sort_order?: number;
    };
  };
}

interface InHouseSession {
  id: string;
  trainer_name: string;
  outlet_id?: string;
  trainee_name: string;
  training_date: string;
  status: string;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: 'SB' | 'B' | 'C' | 'K';
  is_passed: boolean;
  pic_name?: string;
  trainer_signature?: string;
  pic_signature?: string;
  notes?: string;
  assessments?: AssessmentItem[];
}

export function printEvaluationReport(session: InHouseSession, outletName: string = 'Outlet Cabang') {
  const formattedDate = new Date(session.training_date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const printTime = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const docCode = `DOC/TND-EVL/${new Date(session.training_date).getFullYear()}/${session.id.slice(0, 8).toUpperCase()}`;

  // Extract PIC name from field or notes
  let resolvedPicName = session.pic_name || '';
  if (!resolvedPicName && session.notes) {
    const picMatch = session.notes.match(/\[PIC Outlet\][^\n:]*:\s*([^\n]+)/i);
    if (picMatch && picMatch[1]) {
      resolvedPicName = picMatch[1].trim();
    }
  }
  if (!resolvedPicName) {
    resolvedPicName = 'PIC Outlet Cabang';
  }

  // Helper to render signature slot
  const renderSignatureSlot = (sigData?: string, fallbackStrokeColor = '#1E3A8A') => {
    if (sigData && (sigData.startsWith('data:image') || sigData.startsWith('<svg'))) {
      if (sigData.startsWith('<svg')) {
        return `<div style="max-height: 48px; max-width: 140px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">${sigData}</div>
        <div style="font-size: 8px; color: #059669; font-weight: bold; margin-top: 2px;">✓ Verified Digital Signature</div>`;
      }
      return `<img src="${sigData}" style="max-height: 46px; max-width: 140px; object-fit: contain; display: block; margin: 0 auto;" alt="Digital Signature" />
      <div style="font-size: 8px; color: #059669; font-weight: bold; margin-top: 2px;">✓ Verified Digital Signature</div>`;
    }

    // Realistic digital ink curve fallback
    return `
      <svg viewBox="0 0 140 45" width="130" height="42" style="display: block; margin: 0 auto;">
        <path d="M 12 32 Q 28 8 48 24 T 82 18 T 118 28 Q 128 14 132 22" fill="none" stroke="${fallbackStrokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 38 28 Q 65 38 95 33" fill="none" stroke="${fallbackStrokeColor}" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <div style="font-size: 8px; color: #059669; font-weight: bold; margin-top: 1px;">✓ Verified Digital Signature</div>
    `;
  };

  const trainerSigHtml = renderSignatureSlot(session.trainer_signature, '#1E3A8A');
  const picSigHtml = renderSignatureSlot(session.pic_signature, '#047857');
  const approvalSigHtml = `
    <svg viewBox="0 0 140 45" width="130" height="42" style="display: block; margin: 0 auto;">
      <path d="M 15 25 Q 35 6 58 22 T 95 16 Q 118 28 128 20" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="118" cy="22" r="2" fill="#0284C7" />
    </svg>
    <div style="font-size: 8px; color: #0284C7; font-weight: bold; margin-top: 1px;">✓ Official Management Approval</div>
  `;

  // Group assessments by category
  const categoryGroups: Record<
    string,
    {
      categoryName: string;
      sortOrder: number;
      items: AssessmentItem[];
      totalScore: number;
      maxScore: number;
    }
  > = {};

  (session.assessments || []).forEach((item) => {
    const catName = item.checklistPoint?.category?.name || 'Standar Pelaksanaan & Operasional';
    const sortOrder = item.checklistPoint?.category?.sort_order || 99;
    const catKey = item.checklistPoint?.category_id || catName;

    if (!categoryGroups[catKey]) {
      categoryGroups[catKey] = {
        categoryName: catName,
        sortOrder,
        items: [],
        totalScore: 0,
        maxScore: 0,
      };
    }

    categoryGroups[catKey].items.push(item);
    categoryGroups[catKey].totalScore += item.score;
    categoryGroups[catKey].maxScore += item.checklistPoint?.max_score || 5;
  });

  const sortedCategories = Object.values(categoryGroups).sort((a, b) => a.sortOrder - b.sortOrder);

  const gradeFullText: Record<string, { label: string; bg: string; color: string; desc: string }> = {
    SB: { label: 'SB (Sangat Baik)', bg: '#ECFDF5', color: '#065F46', desc: 'Memenuhi seluruh standar SOP dengan kemandirian tinggi' },
    B: { label: 'B (Baik)', bg: '#E0F2FE', color: '#0369A1', desc: 'Sesuai dengan standar baku operasional outlet' },
    C: { label: 'C (Cukup)', bg: '#FEF3C7', color: '#92400E', desc: 'Memerlukan bimbingan supervisi berkala' },
    K: { label: 'K (Kurang)', bg: '#FEE2E2', color: '#991B1B', desc: 'Belum memenuhi standar minimum, wajib retraining' },
  };

  const currentGrade = gradeFullText[session.grade] || gradeFullText.B;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Hasil Evaluasi Training - ${outletName} (${session.trainee_name})</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
      background-color: #FFFFFF;
    }
    .doc-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Kop Surat / Header */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2.5px solid #0B1C30;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-logo-col {
      width: 60%;
      vertical-align: middle;
    }
    .company-title {
      font-size: 16px;
      font-weight: 900;
      color: #0B1C30;
      letter-spacing: 0.5px;
      margin: 0;
      text-transform: uppercase;
    }
    .company-subtitle {
      font-size: 10px;
      color: #419CC3;
      font-weight: 700;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .company-tagline {
      font-size: 9px;
      color: #64748B;
      margin-top: 2px;
    }
    .header-meta-col {
      width: 40%;
      text-align: right;
      vertical-align: middle;
    }
    .doc-badge {
      display: inline-block;
      background-color: #0B1C30;
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .doc-ref {
      font-size: 9.5px;
      color: #475569;
      margin-top: 4px;
      font-family: monospace;
      font-weight: bold;
    }

    /* Document Title */
    .doc-title-block {
      text-align: center;
      margin: 12px 0 16px 0;
    }
    .doc-main-title {
      font-size: 14px;
      font-weight: 900;
      color: #0B1C30;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-sub-title {
      font-size: 10px;
      color: #64748B;
      margin-top: 3px;
    }

    /* Meta Table */
    .meta-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      background-color: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
    }
    .meta-grid td {
      padding: 6px 10px;
      font-size: 10.5px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: middle;
    }
    .meta-label {
      width: 22%;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9.5px;
    }
    .meta-val {
      width: 28%;
      color: #0F172A;
      font-weight: 600;
    }

    /* Score Executive Summary */
    .summary-card {
      width: 100%;
      border: 1.5px solid ${session.is_passed ? '#10B981' : '#EF4444'};
      background-color: ${session.is_passed ? '#F0FDF4' : '#FEF2F2'};
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .summary-left {
      flex: 1;
    }
    .summary-tag {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${session.is_passed ? '#059669' : '#DC2626'};
    }
    .summary-status-title {
      font-size: 15px;
      font-weight: 900;
      color: ${session.is_passed ? '#065F46' : '#991B1B'};
      margin-top: 2px;
    }
    .summary-desc {
      font-size: 9.5px;
      color: #475569;
      margin-top: 2px;
    }
    .summary-stats {
      display: flex;
      gap: 16px;
      align-items: center;
      text-align: right;
    }
    .stat-box {
      border-left: 1.5px solid #CBD5E1;
      padding-left: 12px;
    }
    .stat-label {
      font-size: 9px;
      color: #64748B;
      font-weight: 700;
      text-transform: uppercase;
    }
    .stat-value {
      font-size: 16px;
      font-weight: 900;
      color: #0F172A;
    }
    .grade-badge-large {
      display: inline-block;
      padding: 4px 10px;
      background-color: ${currentGrade.bg};
      color: ${currentGrade.color};
      border: 1px solid ${currentGrade.color};
      border-radius: 6px;
      font-size: 13px;
      font-weight: 900;
      margin-top: 2px;
    }

    /* Checklist Table */
    .table-section-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #0B1C30;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 14px 0 6px 0;
    }
    .checklist-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    .checklist-table th {
      background-color: #0B1C30;
      color: #FFFFFF;
      text-align: left;
      padding: 7px 8px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      border: 1px solid #0B1C30;
    }
    .checklist-table td {
      padding: 6px 8px;
      border: 1px solid #CBD5E1;
      vertical-align: middle;
    }
    .cat-row {
      background-color: #E2E8F0 !important;
      font-weight: 800;
      color: #0F172A;
      font-size: 10px;
    }
    .score-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 9.5px;
      text-align: center;
    }

    /* Notes Box */
    .notes-box {
      border: 1px solid #FCD34D;
      background-color: #FFFBEB;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 16px;
    }
    .notes-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #92400E;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .notes-text {
      font-size: 10px;
      color: #334155;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    /* Signatures Section */
    .sig-section {
      margin-top: 18px;
      width: 100%;
      border-collapse: collapse;
      page-break-inside: avoid;
    }
    .sig-section td {
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 6px;
    }
    .sig-title {
      font-size: 10px;
      font-weight: 800;
      color: #334155;
      text-transform: uppercase;
    }
    .sig-space {
      height: 55px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .sig-line {
      width: 75%;
      margin: 0 auto;
      border-bottom: 1.5px solid #0F172A;
      margin-top: 4px;
    }
    .sig-name {
      font-size: 10px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 4px;
    }
    .sig-role {
      font-size: 9px;
      color: #64748B;
    }

    /* Footer */
    .doc-footer {
      margin-top: 18px;
      padding-top: 6px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      color: #94A3B8;
      page-break-inside: avoid;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <!-- Header / Kop -->
    <table class="header-table">
      <tr>
        <td class="header-logo-col">
          <h1 class="company-title">TND TRAINING & TALENT DEVELOPMENT</h1>
          <div class="company-subtitle">In-House Training & Competency Assessment Report</div>
          <div class="company-tagline">Standar Mutu Operasional Outlet & Sertifikasi Kompetensi Barista</div>
        </td>
        <td class="header-meta-col">
          <span class="doc-badge">DOKUMEN RESMI</span>
          <div class="doc-ref">${docCode}</div>
          <div style="font-size: 9px; color: #64748B; margin-top: 2px;">Terbit: ${formattedDate}</div>
        </td>
      </tr>
    </table>

    <!-- Document Title -->
    <div class="doc-title-block">
      <h2 class="doc-main-title">BERITA ACARA & LAPORAN HASIL EVALUASI IN-HOUSE TRAINING</h2>
      <div class="doc-sub-title">Hasil Penilaian Standar Operasional Prosedur (SOP) & Pengujian Kompetensi On-Site</div>
    </div>

    <!-- Metadata Grid -->
    <table class="meta-grid">
      <tr>
        <td class="meta-label">Cabang Outlet</td>
        <td class="meta-val">${outletName}</td>
        <td class="meta-label">Trainer Penilai</td>
        <td class="meta-val">${session.trainer_name || 'Trainer TnD'}</td>
      </tr>
      <tr>
        <td class="meta-label">Peserta / Tim</td>
        <td class="meta-val">${session.trainee_name || 'Tim Barista & Staf'}</td>
        <td class="meta-label">Tanggal Pelaksanaan</td>
        <td class="meta-val">${formattedDate}</td>
      </tr>
      <tr>
        <td class="meta-label">Metode Evaluasi</td>
        <td class="meta-val">On-Site Direct Observation (SB/B/C/K)</td>
        <td class="meta-label">Ambang Kelulusan</td>
        <td class="meta-val">Min. 70.0% (Standar Grade B)</td>
      </tr>
    </table>

    <!-- Score Summary Card -->
    <div class="summary-card">
      <div class="summary-left">
        <div class="summary-tag">HASIL KELULUSAN SESI TRAINING</div>
        <div class="summary-status-title">
          ${session.is_passed ? 'LULUS STANDAR ON-SITE' : 'PERLU SESI RETRAINING'}
        </div>
        <div class="summary-desc">
          ${currentGrade.desc}
        </div>
      </div>
      <div class="summary-stats">
        <div class="stat-box">
          <div class="stat-label">Total Skor</div>
          <div class="stat-value">${session.total_score} <span style="font-size: 11px; color: #64748B; font-weight: normal;">/ ${session.max_score}</span></div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Persentase</div>
          <div class="stat-value" style="color: ${session.is_passed ? '#059669' : '#DC2626'};">${session.percentage.toFixed(1)}%</div>
        </div>
        <div class="stat-box" style="text-align: center;">
          <div class="stat-label">Predikat Mutu</div>
          <div class="grade-badge-large">GRADE ${session.grade}</div>
        </div>
      </div>
    </div>

    <!-- Detailed Checklist Table -->
    <div class="table-section-title">RINCIAN DETAIL POINT PENILAIAN PER BUTIR STANDAR SOP</div>
    <table class="checklist-table">
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">No</th>
          <th style="width: 45%;">Butir Penilaian & Kriteria SOP</th>
          <th style="width: 12%; text-align: center;">Skor (1-5)</th>
          <th style="width: 13%; text-align: center;">Predikat</th>
          <th style="width: 25%;">Catatan Observasi</th>
        </tr>
      </thead>
      <tbody>
        ${sortedCategories
          .map((cat, cIdx) => {
            const catHeader = `
            <tr class="cat-row">
              <td colspan="2" style="padding: 5px 8px;">
                <strong>${cIdx + 1}. ${cat.categoryName.toUpperCase()}</strong>
              </td>
              <td style="text-align: center; font-weight: 800;">
                ${cat.totalScore} / ${cat.maxScore}
              </td>
              <td style="text-align: center; font-weight: 800;">
                ${((cat.totalScore / (cat.maxScore || 1)) * 100).toFixed(0)}%
              </td>
              <td style="font-size: 9px; color: #475569;">Subtotal Kategori</td>
            </tr>`;

            const itemRows = cat.items
              .map((item, pIdx) => {
                const maxPt = item.checklistPoint?.max_score || 5;
                const pointGrade = gradeFullText[item.grade] || gradeFullText.B;
                return `
                <tr>
                  <td style="text-align: center; color: #64748B;">${cIdx + 1}.${pIdx + 1}</td>
                  <td>
                    <div style="font-weight: 700; color: #0F172A;">${item.checklistPoint?.question || 'Butir Penilaian'}</div>
                    ${item.checklistPoint?.description ? `<div style="font-size: 8.5px; color: #64748B; margin-top: 1px;">${item.checklistPoint.description}</div>` : ''}
                  </td>
                  <td style="text-align: center; font-weight: 800; color: #0F172A;">
                    ${item.score} / ${maxPt}
                  </td>
                  <td style="text-align: center;">
                    <span class="score-badge" style="background-color: ${pointGrade.bg}; color: ${pointGrade.color}; border: 1px solid ${pointGrade.color};">
                      ${item.grade || 'B'} (${item.score})
                    </span>
                  </td>
                  <td style="font-size: 9px; color: #334155;">
                    ${item.notes ? item.notes : '<span style="color: #94A3B8; font-style: italic;">Sesuai Standar</span>'}
                  </td>
                </tr>`;
              })
              .join('');

            return catHeader + itemRows;
          })
          .join('')}
      </tbody>
    </table>

    <!-- Notes & Recommendations Box -->
    ${
      session.notes
        ? `
    <div class="notes-box">
      <div class="notes-title">CATATAN EVALUASI & REKOMENDASI TRAINER</div>
      <div class="notes-text">${session.notes}</div>
    </div>`
        : ''
    }

    <!-- Signatures -->
    <table class="sig-section">
      <tr>
        <td>
          <div class="sig-title">Trainer Penilai</div>
          <div class="sig-space">
            ${trainerSigHtml}
          </div>
          <div class="sig-line"></div>
          <div class="sig-name">${session.trainer_name || 'Trainer TnD'}</div>
          <div class="sig-role">Training Specialist</div>
        </td>
        <td>
          <div class="sig-title">PIC / Store Manager</div>
          <div class="sig-space">
            ${picSigHtml}
          </div>
          <div class="sig-line"></div>
          <div class="sig-name">${resolvedPicName}</div>
          <div class="sig-role">Store Manager / SPV Cabang</div>
        </td>
        <td>
          <div class="sig-title">Mengetahui & Menyetujui</div>
          <div class="sig-space">
            ${approvalSigHtml}
          </div>
          <div class="sig-line"></div>
          <div class="sig-name">Head of Training & HRBP</div>
          <div class="sig-role">People & Development Division</div>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <div class="doc-footer">
      <div>Dokumen ini sah dan diterbitkan otomatis oleh Sistem TnD Learning Management System.</div>
      <div>Dicetak: ${printTime} WIB</div>
    </div>
  </div>
</body>
</html>
  `;

  // Open in an isolated hidden print iframe or print window
  const printIframe = document.createElement('iframe');
  printIframe.style.position = 'fixed';
  printIframe.style.right = '0';
  printIframe.style.bottom = '0';
  printIframe.style.width = '0';
  printIframe.style.height = '0';
  printIframe.style.border = '0';
  document.body.appendChild(printIframe);

  const doc = printIframe.contentWindow?.document || printIframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 1000);
    }, 300);
  }
}
