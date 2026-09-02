import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Save,
  RotateCcw,
  Palette,
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
  PenTool,
  ShieldCheck,
  Maximize2,
  X,
  Type,
  Move,
  QrCode,
  Calendar,
  Hash,
  Heading,
  AlignLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CertificateCanvas, CertificateData } from '@/components/certificate/CertificateCanvas';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { InlineSignaturePad } from '@/components/certificate/InlineSignaturePad';
import { getApiUrl, API_BASE_URL } from '@/lib/api';

interface CertificateTemplate {
  id: string;
  name: string;
  bg_image_url: string;
  base_pdf_url?: string | null;
  name_pos_x: number;
  name_pos_y: number;
  name_font_size: number;
  name_font_color: string;
  pdfme_template?: any;
  _count?: { Quizzes: number };
}

type SelectedElementKey =
  | 'title'
  | 'intro'
  | 'name'
  | 'course'
  | 'date'
  | 'certNo'
  | 'signer1'
  | 'signer2'
  | 'qr'
  | 'seal';

export const CertificateTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Active element currently being edited
  const [selectedElement, setSelectedElement] = useState<SelectedElementKey>('title');
  const [activeTab, setActiveTab] = useState<'elements' | 'signers' | 'background'>('elements');

  // Upload states
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isUploadingSig1, setIsUploadingSig1] = useState(false);
  const [isUploadingSig2, setIsUploadingSig2] = useState(false);

  // Editor Modal / Drawer state
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<CertificateTemplate>>({
    name: 'Template Sertifikat Baru',
    bg_image_url: 'theme:classic-navy',
    base_pdf_url: null,
    name_pos_x: 50,
    name_pos_y: 44,
    name_font_size: 34,
    name_font_color: '#1e293b',
  });

  // 1. Title State
  const [showTitle, setShowTitle] = useState(true);
  const [titleText, setTitleText] = useState('SERTIFIKAT KELULUSAN');
  const [titleSubtext, setTitleSubtext] = useState('Certificate of Completion & Excellence');
  const [titleX, setTitleX] = useState(50);
  const [titleY, setTitleY] = useState(22);
  const [titleSize, setTitleSize] = useState(24);
  const [titleColor, setTitleColor] = useState('#0F4F68');
  const [titleFontFamily, setTitleFontFamily] = useState<'sans' | 'serif' | 'cursive' | 'mono'>('sans');

  // 2. Intro State
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState('Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:');
  const [introX, setIntroX] = useState(50);
  const [introY, setIntroY] = useState(34);
  const [introSize, setIntroSize] = useState(12);
  const [introColor, setIntroColor] = useState('#64748b');

  // 3. Name State
  const [nameX, setNameX] = useState(50);
  const [nameY, setNameY] = useState(44);
  const [nameSize, setNameSize] = useState(36);
  const [nameColor, setNameColor] = useState('#1e293b');
  const [nameFontFamily, setNameFontFamily] = useState<'serif' | 'sans' | 'cursive' | 'mono'>('serif');

  // 4. Cert No State
  const [showCertNo, setShowCertNo] = useState(true);
  const [certNoX, setCertNoX] = useState(82);
  const [certNoY, setCertNoY] = useState(11);
  const [certNoSize, setCertNoSize] = useState(10.5);
  const [certNoColor, setCertNoColor] = useState('#64748b');

  // 5. Course / Description State
  const [showCourse, setShowCourse] = useState(true);
  const [courseX, setCourseX] = useState(50);
  const [courseY, setCourseY] = useState(58);
  const [courseSize, setCourseSize] = useState(14);
  const [courseColor, setCourseColor] = useState('#1e293b');
  const [courseText, setCourseText] = useState(
    'Telah berhasil menyelesaikan dan lulus uji kompetensi kuis pada modul “{course}”'
  );

  // 6. Date State
  const [showDate, setShowDate] = useState(true);
  const [dateX, setDateX] = useState(50);
  const [dateY, setDateY] = useState(70);
  const [dateSize, setDateSize] = useState(11);
  const [dateColor, setDateColor] = useState('#475569');

  // 7. Signers State
  const [showSigner1, setShowSigner1] = useState(true);
  const [signer1Role, setSigner1Role] = useState('Head of TnD & Academy');
  const [signer1Name, setSigner1Name] = useState('Rian Hidayat, S.Psi');
  const [signer1SigUrl, setSigner1SigUrl] = useState<string | null>(null);
  const [signer1X, setSigner1X] = useState(24);
  const [signer1Y, setSigner1Y] = useState(85);
  const [signer1Color, setSigner1Color] = useState('#1e293b');

  const [showSigner2, setShowSigner2] = useState(true);
  const [signer2Role, setSigner2Role] = useState('Operations Director');
  const [signer2Name, setSigner2Name] = useState('Hendri Wijaya, B.Bus');
  const [signer2SigUrl, setSigner2SigUrl] = useState<string | null>(null);
  const [signer2X, setSigner2X] = useState(76);
  const [signer2Y, setSigner2Y] = useState(85);
  const [signer2Color, setSigner2Color] = useState('#1e293b');

  // 8. QR & Seal State
  const [showQr, setShowQr] = useState(true);
  const [qrX, setQrX] = useState(91);
  const [qrY, setQrY] = useState(85);
  const [qrSize, setQrSize] = useState(48);

  const [showSeal, setShowSeal] = useState(false);
  const [sealX, setSealX] = useState(50);
  const [sealY, setSealY] = useState(82);

  const [showBorder, setShowBorder] = useState(false);

  // Full Screen Preview Modal
  const [previewData, setPreviewData] = useState<CertificateData | null>(null);

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const sig1FileInputRef = useRef<HTMLInputElement>(null);
  const sig2FileInputRef = useRef<HTMLInputElement>(null);

  const isCustomPdf = Boolean(editingTemplate.base_pdf_url);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/certificate-templates'));
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to load certificate templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const resetAllFields = (meta: any = {}, custom: boolean = false) => {
    setShowTitle(meta.show_title !== undefined ? meta.show_title : true);
    setTitleText(meta.title_text || 'SERTIFIKAT KELULUSAN');
    setTitleSubtext(meta.title_subtext !== undefined ? meta.title_subtext : 'Certificate of Completion & Excellence');
    setTitleX(meta.title_pos_x ?? 50);
    setTitleY(meta.title_pos_y ?? 22);
    setTitleSize(meta.title_font_size ?? (custom ? 24 : 24));
    setTitleColor(meta.title_font_color ?? '#0F4F68');
    setTitleFontFamily(meta.title_font_family ?? 'sans');

    setShowIntro(meta.show_intro !== undefined ? meta.show_intro : true);
    setIntroText(meta.intro_text || 'Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:');
    setIntroX(meta.intro_pos_x ?? 50);
    setIntroY(meta.intro_pos_y ?? (custom ? 33 : 34));
    setIntroSize(meta.intro_font_size ?? 12);
    setIntroColor(meta.intro_font_color ?? '#64748b');

    setNameX(meta.name_pos_x ?? 50);
    setNameY(meta.name_pos_y ?? (custom ? 44 : 46));
    setNameSize(meta.name_font_size ?? (custom ? 36 : 34));
    setNameColor(meta.name_font_color ?? (custom ? '#1e293b' : '#0F4F68'));
    setNameFontFamily(meta.name_font_family ?? 'serif');

    setShowCertNo(meta.show_cert_no !== undefined ? meta.show_cert_no : true);
    setCertNoX(meta.cert_no_pos_x ?? (custom ? 82 : 85));
    setCertNoY(meta.cert_no_pos_y ?? (custom ? 11 : 12));
    setCertNoSize(meta.cert_no_font_size ?? 10.5);
    setCertNoColor(meta.cert_no_font_color ?? '#64748b');

    setShowCourse(meta.show_course !== undefined ? meta.show_course : true);
    setCourseX(meta.course_pos_x ?? 50);
    setCourseY(meta.course_pos_y ?? (custom ? 58 : 60));
    setCourseSize(meta.course_font_size ?? (custom ? 14 : 13.5));
    setCourseColor(meta.course_font_color ?? '#1e293b');
    setCourseText(
      meta.course_custom_text ??
        'Telah berhasil menyelesaikan dan lulus uji kompetensi kuis pada modul “{course}”'
    );

    setShowDate(meta.show_date !== undefined ? meta.show_date : true);
    setDateX(meta.date_pos_x ?? (custom ? 50 : 20));
    setDateY(meta.date_pos_y ?? (custom ? 70 : 82));
    setDateSize(meta.date_font_size ?? 11);
    setDateColor(meta.date_font_color ?? '#475569');

    setShowSigner1(meta.show_signer1 !== undefined ? meta.show_signer1 : true);
    setSigner1Role(meta.signer1_role || 'Head of TnD & Academy');
    setSigner1Name(meta.signer1_name || 'Rian Hidayat, S.Psi');
    setSigner1SigUrl(meta.signer1_signature_url || null);
    setSigner1X(meta.signer1_pos_x ?? 24);
    setSigner1Y(meta.signer1_pos_y ?? 85);
    setSigner1Color(meta.signer1_font_color ?? '#1e293b');

    setShowSigner2(meta.show_signer2 !== undefined ? meta.show_signer2 : true);
    setSigner2Role(meta.signer2_role || 'Operations Director');
    setSigner2Name(meta.signer2_name || 'Hendri Wijaya, B.Bus');
    setSigner2SigUrl(meta.signer2_signature_url || null);
    setSigner2X(meta.signer2_pos_x ?? 76);
    setSigner2Y(meta.signer2_pos_y ?? 85);
    setSigner2Color(meta.signer2_font_color ?? '#1e293b');

    setShowQr(meta.show_qr !== undefined ? meta.show_qr : true);
    setQrX(meta.qr_pos_x ?? 91);
    setQrY(meta.qr_pos_y ?? 85);
    setQrSize(meta.qr_size ?? 48);

    setShowSeal(meta.show_seal !== undefined ? meta.show_seal : !custom);
    setSealX(meta.seal_pos_x ?? 50);
    setSealY(meta.seal_pos_y ?? 82);

    setShowBorder(meta.show_border !== undefined ? meta.show_border : !custom);
  };

  const handleOpenCreate = () => {
    setEditingTemplate({
      name: 'Template Sertifikat Baru',
      bg_image_url: 'theme:classic-navy',
      base_pdf_url: null,
      name_pos_x: 50,
      name_pos_y: 44,
      name_font_size: 34,
      name_font_color: '#0F4F68',
    });
    resetAllFields({}, false);
    setActiveTab('elements');
    setSelectedElement('title');
    setIsEditing(true);
  };

  const handleOpenEdit = (t: CertificateTemplate) => {
    setEditingTemplate({ ...t });
    const isCustom = Boolean(t.base_pdf_url || (t.bg_image_url && t.bg_image_url.startsWith('/uploads')));
    const meta = (t.pdfme_template as any) || {};
    resetAllFields(
      {
        ...meta,
        name_pos_x: t.name_pos_x,
        name_pos_y: t.name_pos_y,
        name_font_size: t.name_font_size,
        name_font_color: t.name_font_color,
      },
      isCustom
    );
    setActiveTab('elements');
    setSelectedElement('title');
    setIsEditing(true);
  };

  const handleUploadBgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploadingBg(true);
    try {
      const res = await fetch(getApiUrl('/certificate-templates/upload-bg'), {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setEditingTemplate((prev) => ({
          ...prev,
          base_pdf_url: data.url,
          bg_image_url: data.url,
        }));
        setShowBorder(false);
        setShowSeal(false);
        setActiveTab('elements');
      } else {
        alert('Gagal mengupload file background.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload.');
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleUploadSig = async (
    e: React.ChangeEvent<HTMLInputElement>,
    signerNum: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (signerNum === 1) setIsUploadingSig1(true);
    else setIsUploadingSig2(true);

    try {
      const res = await fetch(getApiUrl('/certificate-templates/upload-signature'), {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (signerNum === 1) {
          setSigner1SigUrl(data.url);
        } else {
          setSigner2SigUrl(data.url);
        }
      } else {
        alert('Gagal mengupload tanda tangan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload tanda tangan.');
    } finally {
      if (signerNum === 1) setIsUploadingSig1(false);
      else setIsUploadingSig2(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate.name?.trim()) {
      alert('Mohon isi nama template sertifikat.');
      return;
    }

    setIsSaving(true);
    try {
      const isUpdating = Boolean(editingTemplate.id);
      const url = isUpdating
        ? getApiUrl(`/certificate-templates/${editingTemplate.id}`)
        : getApiUrl('/certificate-templates');
      const method = isUpdating ? 'PUT' : 'POST';

      const pdfmeMetadata = {
        show_title: showTitle,
        title_text: titleText,
        title_subtext: titleSubtext,
        title_pos_x: titleX,
        title_pos_y: titleY,
        title_font_size: titleSize,
        title_font_color: titleColor,
        title_font_family: titleFontFamily,

        show_intro: showIntro,
        intro_text: introText,
        intro_pos_x: introX,
        intro_pos_y: introY,
        intro_font_size: introSize,
        intro_font_color: introColor,

        name_pos_x: nameX,
        name_pos_y: nameY,
        name_font_size: nameSize,
        name_font_color: nameColor,
        name_font_family: nameFontFamily,

        show_cert_no: showCertNo,
        cert_no_pos_x: certNoX,
        cert_no_pos_y: certNoY,
        cert_no_font_size: certNoSize,
        cert_no_font_color: certNoColor,

        show_course: showCourse,
        course_pos_x: courseX,
        course_pos_y: courseY,
        course_font_size: courseSize,
        course_font_color: courseColor,
        course_custom_text: courseText,

        show_date: showDate,
        date_pos_x: dateX,
        date_pos_y: dateY,
        date_font_size: dateSize,
        date_font_color: dateColor,

        show_signer1: showSigner1,
        signer1_role: signer1Role,
        signer1_name: signer1Name,
        signer1_signature_url: signer1SigUrl,
        signer1_pos_x: signer1X,
        signer1_pos_y: signer1Y,
        signer1_font_color: signer1Color,

        show_signer2: showSigner2,
        signer2_role: signer2Role,
        signer2_name: signer2Name,
        signer2_signature_url: signer2SigUrl,
        signer2_pos_x: signer2X,
        signer2_pos_y: signer2Y,
        signer2_font_color: signer2Color,

        show_qr: showQr,
        qr_pos_x: qrX,
        qr_pos_y: qrY,
        qr_size: qrSize,

        show_seal: showSeal,
        seal_pos_x: sealX,
        seal_pos_y: sealY,

        show_border: showBorder,
      };

      const payload = {
        ...editingTemplate,
        name_pos_x: nameX,
        name_pos_y: nameY,
        name_font_size: nameSize,
        name_font_color: nameColor,
        pdfme_template: pdfmeMetadata,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditing(false);
        loadTemplates();
      } else {
        alert('Gagal menyimpan template sertifikat.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (confirm(`Hapus template "${name}"?`)) {
      try {
        const res = await fetch(getApiUrl(`/certificate-templates/${id}`), {
          method: 'DELETE',
        });
        if (res.ok) {
          loadTemplates();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const THEMES = [
    {
      id: 'theme:classic-navy',
      name: 'Navy & Gold Classic',
      color: '#0F4F68',
      desc: 'Standar resmi TnD Academy dengan bingkai ganda emas klasik',
    },
    {
      id: 'theme:gold-executive',
      name: 'Gold Executive Modern',
      color: '#B45309',
      desc: 'Warna emas mewah untuk kelulusan managerial & supervisor',
    },
    {
      id: 'theme:emerald-specialist',
      name: 'Emerald Specialist',
      color: '#065F46',
      desc: 'Tema hijau botani untuk spesialis barista, roaster & beverage',
    },
    {
      id: 'theme:minimalist-light',
      name: 'Minimalist Clean',
      color: '#334155',
      desc: 'Desain minimalis modern SobatHR dengan tipografi kontemporer',
    },
  ];

  // Current Live Preview Certificate Data
  const currentPreviewData: CertificateData = {
    certificateNumber: 'CERT/TND/2026/07/A89B4C',
    recipientName: 'Cahaya Dewi',
    courseTitle: 'SOP Barista & Service Hospitality Standard',
    score: 95,
    issueDate: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    divisionName: 'Divisi Operasional & Barista',
    template: {
      name: editingTemplate.name,
      bg_image_url: editingTemplate.bg_image_url || 'theme:classic-navy',
      base_pdf_url: editingTemplate.base_pdf_url || undefined,

      show_title: showTitle,
      title_text: titleText,
      title_subtext: titleSubtext,
      title_pos_x: titleX,
      title_pos_y: titleY,
      title_font_size: titleSize,
      title_font_color: titleColor,
      title_font_family: titleFontFamily,

      show_intro: showIntro,
      intro_text: introText,
      intro_pos_x: introX,
      intro_pos_y: introY,
      intro_font_size: introSize,
      intro_font_color: introColor,

      name_pos_x: nameX,
      name_pos_y: nameY,
      name_font_size: nameSize,
      name_font_color: nameColor,
      name_font_family: nameFontFamily,

      show_cert_no: showCertNo,
      cert_no_pos_x: certNoX,
      cert_no_pos_y: certNoY,
      cert_no_font_size: certNoSize,
      cert_no_font_color: certNoColor,

      show_course: showCourse,
      course_pos_x: courseX,
      course_pos_y: courseY,
      course_font_size: courseSize,
      course_font_color: courseColor,
      course_custom_text: courseText,

      show_date: showDate,
      date_pos_x: dateX,
      date_pos_y: dateY,
      date_font_size: dateSize,
      date_font_color: dateColor,

      show_border: showBorder,
      show_qr: showQr,
      qr_pos_x: qrX,
      qr_pos_y: qrY,
      qr_size: qrSize,

      show_seal: showSeal,
      seal_pos_x: sealX,
      seal_pos_y: sealY,

      show_signer1: showSigner1,
      signer1_role: signer1Role,
      signer1_name: signer1Name,
      signer1_signature_url: signer1SigUrl || undefined,
      signer1_pos_x: signer1X,
      signer1_pos_y: signer1Y,
      signer1_font_color: signer1Color,

      show_signer2: showSigner2,
      signer2_role: signer2Role,
      signer2_name: signer2Name,
      signer2_signature_url: signer2SigUrl || undefined,
      signer2_pos_x: signer2X,
      signer2_pos_y: signer2Y,
      signer2_font_color: signer2Color,
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Desain & Pengaturan Template Sertifikat
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Upload desain PDF sendiri, sesuaikan letak judul, teks pengantar, nama, kolom tanda tangan, dan upload TTD digital.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenCreate}
            className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white font-bold text-xs gap-1.5 shadow-sm rounded-xl px-4 py-2.5"
          >
            <Plus className="w-4 h-4" /> Buat / Upload Template Baru
          </Button>
        </div>
      </div>

      {/* Template Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-4 py-12 text-center text-slate-400">
            Memuat daftar template sertifikat...
          </div>
        ) : (
          templates.map((t) => {
            const hasCustomBg = Boolean(
              t.base_pdf_url || (t.bg_image_url && t.bg_image_url.startsWith('/uploads'))
            );
            const themeMeta = THEMES.find((tm) => tm.id === t.bg_image_url);

            return (
              <Card
                key={t.id}
                className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Thumbnail */}
                <div
                  className="h-32 p-4 flex flex-col justify-between relative overflow-hidden text-white"
                  style={{
                    backgroundColor: themeMeta?.color || '#0F4F68',
                    backgroundImage: hasCustomBg
                      ? `linear-gradient(rgba(15, 79, 104, 0.8), rgba(15, 79, 104, 0.9))`
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      {hasCustomBg ? 'Custom Upload PDF/Img' : themeMeta?.name || 'Preset Theme'}
                    </span>
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>

                  <div className="z-10">
                    <h3 className="font-bold text-sm text-white line-clamp-1">{t.name}</h3>
                    <p className="text-[11px] text-white/80 mt-0.5">
                      {t._count?.Quizzes || 0} Kuis / Modul Terhubung
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <CardContent className="p-3 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreviewData({
                        certificateNumber: 'CERT/TND/2026/SAMPLE/001',
                        recipientName: 'Cahaya Dewi',
                        courseTitle: 'Modul Pelatihan Barista & Service Hospitality',
                        score: 95,
                        issueDate: '02 September 2026',
                        divisionName: 'Operasional Outlet',
                        template: {
                          ...t,
                          base_pdf_url: t.base_pdf_url || undefined,
                          ...(t.pdfme_template || {}),
                        },
                      })
                    }
                    className="flex-1 text-xs text-slate-700 gap-1 rounded-lg h-8"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleOpenEdit(t)}
                    className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs gap-1 rounded-lg h-8 font-bold px-3"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(t.id, t.name)}
                    className="text-rose-500 hover:bg-rose-50 rounded-lg h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Visual Editor Studio Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 md:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Top Header */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center font-bold shadow-xs">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Studio Desain Sertifikat
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isCustomPdf
                      ? 'Mode PDF Custom: Sesuaikan letak teks judul, pengantar, nama, tanggal, dan tanda tangan di atas desain Anda.'
                      : 'Mode Preset: Menggunakan template resmi bawaan sistem.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl text-xs h-9"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Batal
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white font-bold text-xs gap-1.5 rounded-xl h-9 px-5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Template'}
                </Button>
              </div>
            </div>

            {/* Studio Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Settings Panel (5 cols) */}
              <div className="lg:col-span-5 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
                {/* Main Tab Switcher */}
                <div className="grid grid-cols-3 p-2 bg-slate-100/90 border-b border-slate-200 text-xs font-bold gap-1">
                  <button
                    onClick={() => setActiveTab('elements')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'elements'
                        ? 'bg-white text-[#0F4F68] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Move className="w-3.5 h-3.5" /> Posisi Elemen
                  </button>

                  <button
                    onClick={() => setActiveTab('signers')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'signers'
                        ? 'bg-white text-[#0F4F68] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" /> TTD & Pejabat
                  </button>

                  <button
                    onClick={() => setActiveTab('background')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'background'
                        ? 'bg-white text-[#0F4F68] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Background PDF
                  </button>
                </div>

                {/* Tab Scrollable Body */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 text-slate-800">
                  {/* Template Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Nama Template
                    </label>
                    <Input
                      value={editingTemplate.name || ''}
                      onChange={(e) =>
                        setEditingTemplate((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Contoh: Sertifikat Kelulusan Barista Pratama"
                      className="bg-white h-8 text-xs"
                    />
                  </div>

                  {/* TAB 1: POSISI ELEMEN & SLIDERS */}
                  {activeTab === 'elements' && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Element Selector Pills */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Pilih Elemen Yang Ingin Diedit:
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                          <button
                            onClick={() => setSelectedElement('title')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'title'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Judul (Title)
                          </button>

                          <button
                            onClick={() => setSelectedElement('intro')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'intro'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Teks Pengantar
                          </button>

                          <button
                            onClick={() => setSelectedElement('name')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'name'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Nama Peserta
                          </button>

                          <button
                            onClick={() => setSelectedElement('course')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'course'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Modul/Teks
                          </button>

                          <button
                            onClick={() => setSelectedElement('date')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'date'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Tanggal
                          </button>

                          <button
                            onClick={() => setSelectedElement('certNo')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'certNo'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            No. Sertifikat
                          </button>

                          <button
                            onClick={() => setSelectedElement('signer1')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'signer1'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            TTD 1 (Kiri)
                          </button>

                          <button
                            onClick={() => setSelectedElement('signer2')}
                            className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                              selectedElement === 'signer2'
                                ? 'bg-[#0F4F68] text-white border-[#0F4F68]'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            TTD 2 (Kanan)
                          </button>
                        </div>
                      </div>

                      {/* Controls Card */}
                      <Card className="p-4 bg-white rounded-2xl border-slate-200 shadow-xs space-y-3.5">
                        {/* 1. JUDUL SERTIFIKAT (TITLE) */}
                        {selectedElement === 'title' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Judul Sertifikat (Title)
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showTitle}
                                  onChange={(e) => setShowTitle(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10.5px] font-bold text-slate-600">
                                Teks Judul Utama
                              </label>
                              <Input
                                value={titleText}
                                onChange={(e) => setTitleText(e.target.value)}
                                placeholder="SERTIFIKAT KELULUSAN / PENGHARGAAN"
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10.5px] font-bold text-slate-600">
                                Teks Sub-Judul (Kosongkan jika tidak perlu)
                              </label>
                              <Input
                                value={titleSubtext}
                                onChange={(e) => setTitleSubtext(e.target.value)}
                                placeholder="Certificate of Completion & Excellence"
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Horizontal (X)</span>
                                  <span>{titleX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={titleX}
                                  onChange={(e) => setTitleX(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Vertikal (Y)</span>
                                  <span>{titleY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="60"
                                  value={titleY}
                                  onChange={(e) => setTitleY(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Ukuran Font</span>
                                  <span>{titleSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="16"
                                  max="42"
                                  value={titleSize}
                                  onChange={(e) => setTitleSize(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={titleColor}
                                    onChange={(e) => setTitleColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={titleColor}
                                    onChange={(e) => setTitleColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. TEKS PENGANTAR (INTRO) */}
                        {selectedElement === 'intro' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Teks Pengantar (Introductory)
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showIntro}
                                  onChange={(e) => setShowIntro(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10.5px] font-bold text-slate-600">
                                Kalimat Pengantar
                              </label>
                              <Input
                                value={introText}
                                onChange={(e) => setIntroText(e.target.value)}
                                placeholder="Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:"
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{introX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={introX}
                                  onChange={(e) => setIntroX(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{introY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="70"
                                  value={introY}
                                  onChange={(e) => setIntroY(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Ukuran Font</span>
                                  <span>{introSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="9"
                                  max="20"
                                  value={introSize}
                                  onChange={(e) => setIntroSize(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={introColor}
                                    onChange={(e) => setIntroColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={introColor}
                                    onChange={(e) => setIntroColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. NAMA PESERTA */}
                        {selectedElement === 'name' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Nama Peserta
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Posisi X: {nameX}%, Y: {nameY}%
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-600">Posisi Horizontal (X)</span>
                                <span className="text-[#0F4F68]">{nameX}%</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="90"
                                value={nameX}
                                onChange={(e) => setNameX(Number(e.target.value))}
                                className="w-full accent-[#0F4F68]"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-600">Posisi Vertikal (Y)</span>
                                <span className="text-[#0F4F68]">{nameY}%</span>
                              </div>
                              <input
                                type="range"
                                min="15"
                                max="85"
                                value={nameY}
                                onChange={(e) => setNameY(Number(e.target.value))}
                                className="w-full accent-[#0F4F68]"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-600">Ukuran Huruf (Font Size)</span>
                                <span className="text-[#0F4F68]">{nameSize} px</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="56"
                                value={nameSize}
                                onChange={(e) => setNameSize(Number(e.target.value))}
                                className="w-full accent-[#0F4F68]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={nameColor}
                                    onChange={(e) => setNameColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={nameColor}
                                    onChange={(e) => setNameColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Gaya Font
                                </label>
                                <select
                                  value={nameFontFamily}
                                  onChange={(e) => setNameFontFamily(e.target.value as any)}
                                  className="w-full h-7 rounded border border-slate-200 bg-white px-2 text-xs"
                                >
                                  <option value="serif">Serif (Formal Elegan)</option>
                                  <option value="sans">Sans-Serif (Modern)</option>
                                  <option value="cursive">Kaligrafi (Artistik)</option>
                                  <option value="mono">Monospace (Teknis)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. MODUL / TEKS DESKRIPSI */}
                        {selectedElement === 'course' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Judul Modul / Keterangan
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showCourse}
                                  onChange={(e) => setShowCourse(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">
                                Format Teks ({'{course}'} diganti nama modul)
                              </label>
                              <Input
                                value={courseText}
                                onChange={(e) => setCourseText(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{courseX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={courseX}
                                  onChange={(e) => setCourseX(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{courseY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="20"
                                  max="90"
                                  value={courseY}
                                  onChange={(e) => setCourseY(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Ukuran Font</span>
                                  <span>{courseSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="26"
                                  value={courseSize}
                                  onChange={(e) => setCourseSize(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={courseColor}
                                    onChange={(e) => setCourseColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={courseColor}
                                    onChange={(e) => setCourseColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. TANGGAL */}
                        {selectedElement === 'date' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Tanggal Terbit
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showDate}
                                  onChange={(e) => setShowDate(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{dateX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={dateX}
                                  onChange={(e) => setDateX(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{dateY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="20"
                                  max="95"
                                  value={dateY}
                                  onChange={(e) => setDateY(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Ukuran Font</span>
                                  <span>{dateSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="8"
                                  max="20"
                                  value={dateSize}
                                  onChange={(e) => setDateSize(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={dateColor}
                                    onChange={(e) => setDateColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={dateColor}
                                    onChange={(e) => setDateColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 6. NOMOR SERTIFIKAT */}
                        {selectedElement === 'certNo' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Nomor Sertifikat
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showCertNo}
                                  onChange={(e) => setShowCertNo(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{certNoX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={certNoX}
                                  onChange={(e) => setCertNoX(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{certNoY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="90"
                                  value={certNoY}
                                  onChange={(e) => setCertNoY(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Ukuran Font</span>
                                  <span>{certNoSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="8"
                                  max="18"
                                  value={certNoSize}
                                  onChange={(e) => setCertNoSize(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                  Warna Teks
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={certNoColor}
                                    onChange={(e) => setCertNoColor(e.target.value)}
                                    className="w-7 h-7 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={certNoColor}
                                    onChange={(e) => setCertNoColor(e.target.value)}
                                    className="h-7 text-[11px] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 7. TTD 1 */}
                        {selectedElement === 'signer1' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Tanda Tangan 1 (Kiri)
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showSigner1}
                                  onChange={(e) => setShowSigner1(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{signer1X}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={signer1X}
                                  onChange={(e) => setSigner1X(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{signer1Y}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="40"
                                  max="95"
                                  value={signer1Y}
                                  onChange={(e) => setSigner1Y(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 8. TTD 2 */}
                        {selectedElement === 'signer2' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-bold text-[#0F4F68]">
                                Pengaturan: Tanda Tangan 2 (Kanan)
                              </span>
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={showSigner2}
                                  onChange={(e) => setShowSigner2(e.target.checked)}
                                  className="accent-[#0F4F68]"
                                />
                                Tampilkan
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi X</span>
                                  <span>{signer2X}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={signer2X}
                                  onChange={(e) => setSigner2X(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span>Posisi Y</span>
                                  <span>{signer2Y}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="40"
                                  max="95"
                                  value={signer2Y}
                                  onChange={(e) => setSigner2Y(Number(e.target.value))}
                                  className="w-full accent-[#0F4F68]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  )}

                  {/* TAB 2: TTD & PEJABAT */}
                  {activeTab === 'signers' && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Signer 1 */}
                      <Card className="rounded-2xl border-slate-200 p-3.5 bg-white space-y-2.5">
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="text-xs font-bold text-[#0F4F68]">
                            Penandatangan 1 (Sisi Kiri)
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-600">
                            Nama Kolom / Jabatan
                          </label>
                          <Input
                            value={signer1Role}
                            onChange={(e) => setSigner1Role(e.target.value)}
                            placeholder="Contoh: Head of TnD & Academy"
                            className="h-7 text-xs bg-slate-50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-600">
                            Nama Lengkap & Gelar
                          </label>
                          <Input
                            value={signer1Name}
                            onChange={(e) => setSigner1Name(e.target.value)}
                            placeholder="Contoh: Rian Hidayat, S.Psi"
                            className="h-7 text-xs bg-slate-50"
                          />
                        </div>

                        {/* Inline Signature Pad 1 */}
                        <div className="pt-2 border-t">
                          <InlineSignaturePad
                            signatureUrl={signer1SigUrl}
                            onSignatureChange={(url) => setSigner1SigUrl(url)}
                            onFileUpload={(e) => handleUploadSig(e, 1)}
                            isUploading={isUploadingSig1}
                          />
                        </div>
                      </Card>

                      {/* Signer 2 */}
                      <Card className="rounded-2xl border-slate-200 p-3.5 bg-white space-y-2.5">
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="text-xs font-bold text-[#0F4F68]">
                            Penandatangan 2 (Sisi Kanan)
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-600">
                            Nama Kolom / Jabatan
                          </label>
                          <Input
                            value={signer2Role}
                            onChange={(e) => setSigner2Role(e.target.value)}
                            placeholder="Contoh: Operations Director"
                            className="h-7 text-xs bg-slate-50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-bold text-slate-600">
                            Nama Lengkap & Gelar
                          </label>
                          <Input
                            value={signer2Name}
                            onChange={(e) => setSigner2Name(e.target.value)}
                            placeholder="Contoh: Hendri Wijaya, B.Bus"
                            className="h-7 text-xs bg-slate-50"
                          />
                        </div>

                        {/* Inline Signature Pad 2 */}
                        <div className="pt-2 border-t">
                          <InlineSignaturePad
                            signatureUrl={signer2SigUrl}
                            onSignatureChange={(url) => setSigner2SigUrl(url)}
                            onFileUpload={(e) => handleUploadSig(e, 2)}
                            isUploading={isUploadingSig2}
                          />
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* TAB 3: BACKGROUND & PDF UPLOAD */}
                  {activeTab === 'background' && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Custom Upload Card */}
                      <Card className="rounded-2xl border-dashed border-2 border-slate-300 p-4 bg-white hover:border-[#0F4F68] transition-colors">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-sky-50 text-[#0F4F68] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Upload File Desain PDF / Gambar Latar
                            </p>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">
                              Format: PDF, PNG, JPG (Disarankan Landscape A4)
                            </p>
                          </div>

                          <input
                            ref={bgFileInputRef}
                            type="file"
                            accept=".pdf,image/png,image/jpeg,image/jpg"
                            onChange={handleUploadBgFile}
                            className="hidden"
                          />

                          <Button
                            size="sm"
                            onClick={() => bgFileInputRef.current?.click()}
                            disabled={isUploadingBg}
                            className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs font-bold rounded-xl h-8 px-4"
                          >
                            {isUploadingBg ? 'Mengupload...' : 'Pilih File Desain...'}
                          </Button>

                          {editingTemplate.base_pdf_url && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-full justify-between">
                              <span className="truncate max-w-[200px]">
                                ✓ {editingTemplate.base_pdf_url.split('/').pop()}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingTemplate((prev) => ({
                                    ...prev,
                                    base_pdf_url: null,
                                    bg_image_url: 'theme:classic-navy',
                                  }));
                                  setShowBorder(true);
                                  setShowSeal(true);
                                }}
                                className="text-rose-500 hover:text-rose-700 text-[11px]"
                              >
                                Hapus / Ganti Preset
                              </button>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* Or Preset Theme */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Atau Pilih Tema Bawaan Sistem:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {THEMES.map((th) => {
                            const isSelected =
                              editingTemplate.bg_image_url === th.id &&
                              !editingTemplate.base_pdf_url;
                            return (
                              <button
                                key={th.id}
                                onClick={() => {
                                  setEditingTemplate((prev) => ({
                                    ...prev,
                                    bg_image_url: th.id,
                                    base_pdf_url: null,
                                  }));
                                  setShowBorder(true);
                                  setShowSeal(true);
                                }}
                                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-[#0F4F68] bg-sky-50/60 ring-2 ring-[#0F4F68]/20'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: th.color }}
                                  />
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0F4F68]" />}
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs font-bold text-slate-800">{th.name}</p>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                    {th.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Live Visual Canvas (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/95 flex flex-col items-center justify-center p-6 relative overflow-auto">
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-xl text-white text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">Live Visual Canvas</span>
                  <span className="text-[10px] text-slate-400">
                    (Klik elemen apa saja untuk langsung menggeser/mengedit posisinya)
                  </span>
                  <button
                    onClick={() => setPreviewData(currentPreviewData)}
                    className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" /> Fullscreen
                  </button>
                </div>

                <div className="max-w-full overflow-hidden flex items-center justify-center py-4">
                  <CertificateCanvas
                    data={currentPreviewData}
                    scale={0.92}
                    interactiveSelection={selectedElement}
                    onSelectElement={(key) => {
                      setSelectedElement(key as SelectedElementKey);
                      setActiveTab('elements');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      <CertificateModal
        isOpen={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        data={previewData}
      />
    </div>
  );
};
