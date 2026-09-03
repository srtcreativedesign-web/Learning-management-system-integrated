import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import logoTnd from '@/assets/logo tnd.png';
import { API_BASE_URL } from '@/lib/api';

export interface CertificateData {
  certificateNumber?: string;
  recipientName: string;
  courseTitle: string;
  score?: number;
  issueDate?: string;
  divisionName?: string;
  template?: {
    name?: string;
    bg_image_url?: string;
    base_pdf_url?: string;
    pdfme_template?: any;

    // 1. Judul Sertifikat (Title)
    show_title?: boolean;
    title_text?: string;
    title_subtext?: string;
    title_pos_x?: number;
    title_pos_y?: number;
    title_font_size?: number;
    title_font_color?: string;
    title_font_family?: string;

    // 2. Teks Pengantar (Intro)
    show_intro?: boolean;
    intro_text?: string;
    intro_pos_x?: number;
    intro_pos_y?: number;
    intro_font_size?: number;
    intro_font_color?: string;
    intro_font_family?: string;

    // 3. Nama Peserta
    name_pos_x?: number;
    name_pos_y?: number;
    name_font_size?: number;
    name_font_color?: string;
    name_font_family?: string;
    name_align?: 'center' | 'left' | 'right';

    // 4. Nomor Sertifikat
    show_cert_no?: boolean;
    cert_no_pos_x?: number;
    cert_no_pos_y?: number;
    cert_no_font_size?: number;
    cert_no_font_color?: string;

    // 5. Modul / Deskripsi
    show_course?: boolean;
    course_pos_x?: number;
    course_pos_y?: number;
    course_font_size?: number;
    course_font_color?: string;
    course_custom_text?: string;

    // 6. Tanggal Terbit
    show_date?: boolean;
    date_pos_x?: number;
    date_pos_y?: number;
    date_font_size?: number;
    date_font_color?: string;

    // 7. Instansi / Header Logo
    show_header_logo?: boolean;
    header_logo_pos_x?: number;
    header_logo_pos_y?: number;

    // 8. Tanda Tangan 1 (Kiri)
    show_signer1?: boolean;
    signer1_role?: string;
    signer1_name?: string;
    signer1_signature_url?: string;
    signer1_pos_x?: number;
    signer1_pos_y?: number;
    signer1_font_color?: string;

    // 9. Tanda Tangan 2 (Kanan)
    show_signer2?: boolean;
    signer2_role?: string;
    signer2_name?: string;
    signer2_signature_url?: string;
    signer2_pos_x?: number;
    signer2_pos_y?: number;
    signer2_font_color?: string;

    // 10. QR & Seal
    show_qr?: boolean;
    qr_pos_x?: number;
    qr_pos_y?: number;
    qr_size?: number;

    show_seal?: boolean;
    seal_pos_x?: number;
    seal_pos_y?: number;
    seal_size?: number;

    show_border?: boolean;
  };
}

interface CertificateCanvasProps {
  data: CertificateData;
  scale?: number;
  showBorder?: boolean;
  interactiveSelection?: string | null;
  onSelectElement?: (elementKey: string) => void;
}

export const resolveCertificateImageUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  data,
  scale = 1,
  showBorder: propShowBorder,
  interactiveSelection,
  onSelectElement,
}) => {
  const {
    certificateNumber = 'CERT/TND/2026/07/A89B4C',
    recipientName = 'Budi Santoso',
    courseTitle = 'Standar Operasional Prosedur Barista & Pelayanan Pelanggan',
    score = 95,
    issueDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    divisionName = 'Divisi Operasional & Barista',
    template,
  } = data;

  const [sig1Error, setSig1Error] = React.useState(false);
  const [sig2Error, setSig2Error] = React.useState(false);

  const theme = template?.bg_image_url || 'theme:classic-navy';
  const rawCustomBgUrl =
    template?.base_pdf_url ||
    (theme.startsWith('/uploads') || theme.startsWith('http') || theme.startsWith('data:') ? theme : null);
  const customBgUrl = resolveCertificateImageUrl(rawCustomBgUrl);

  // Metadata parser
  const meta = (template?.pdfme_template as any) || {};

  // 1. Judul Sertifikat (Title)
  const showTitle = template?.show_title ?? meta.show_title ?? true;
  const titleText = template?.title_text ?? meta.title_text ?? 'SERTIFIKAT KELULUSAN';
  const titleSubtext = template?.title_subtext ?? meta.title_subtext ?? 'Certificate of Completion & Excellence';
  const titleX = template?.title_pos_x ?? meta.title_pos_x ?? 50;
  const titleY = template?.title_pos_y ?? meta.title_pos_y ?? (customBgUrl ? 22 : 22);
  const titleSize = template?.title_font_size ?? meta.title_font_size ?? (customBgUrl ? 24 : 24);
  const titleColor = template?.title_font_color ?? meta.title_font_color ?? (customBgUrl ? '#0F4F68' : '#0F4F68');
  const titleFontFamily = template?.title_font_family ?? meta.title_font_family ?? 'sans';

  // 2. Teks Pengantar (Intro)
  const showIntro = template?.show_intro ?? meta.show_intro ?? true;
  const introText = template?.intro_text ?? meta.intro_text ?? 'Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:';
  const introX = template?.intro_pos_x ?? meta.intro_pos_x ?? 50;
  const introY = template?.intro_pos_y ?? meta.intro_pos_y ?? (customBgUrl ? 33 : 34);
  const introSize = template?.intro_font_size ?? meta.intro_font_size ?? 12;
  const introColor = template?.intro_font_color ?? meta.intro_font_color ?? '#64748b';

  // 3. Nama Peserta
  const nameX = template?.name_pos_x ?? meta.name_pos_x ?? 50;
  const nameY = template?.name_pos_y ?? meta.name_pos_y ?? (customBgUrl ? 44 : 46);
  const nameFontSize = template?.name_font_size ?? meta.name_font_size ?? (customBgUrl ? 36 : 34);
  const nameFontColor = template?.name_font_color ?? meta.name_font_color ?? (customBgUrl ? '#1e293b' : '#0F4F68');
  const nameFontFamily = template?.name_font_family ?? meta.name_font_family ?? 'serif';
  const nameAlign = template?.name_align ?? meta.name_align ?? 'center';

  // 4. Nomor Sertifikat
  const showCertNo = template?.show_cert_no ?? meta.show_cert_no ?? true;
  const certNoX = template?.cert_no_pos_x ?? meta.cert_no_pos_x ?? (customBgUrl ? 82 : 85);
  const certNoY = template?.cert_no_pos_y ?? meta.cert_no_pos_y ?? (customBgUrl ? 11 : 12);
  const certNoSize = template?.cert_no_font_size ?? meta.cert_no_font_size ?? 10.5;
  const certNoColor = template?.cert_no_font_color ?? meta.cert_no_font_color ?? '#64748b';

  // 5. Modul / Deskripsi
  const showCourse = template?.show_course ?? meta.show_course ?? true;
  const courseX = template?.course_pos_x ?? meta.course_pos_x ?? 50;
  const courseY = template?.course_pos_y ?? meta.course_pos_y ?? (customBgUrl ? 58 : 60);
  const courseSize = template?.course_font_size ?? meta.course_font_size ?? (customBgUrl ? 14 : 13.5);
  const courseColor = template?.course_font_color ?? meta.course_font_color ?? '#1e293b';
  const courseCustomText = template?.course_custom_text ?? meta.course_custom_text ?? `Telah berhasil menyelesaikan dan lulus uji kompetensi kuis dengan nilai (${score}%) pada modul “${courseTitle}”`;

  // 6. Tanggal Terbit
  const showDate = template?.show_date ?? meta.show_date ?? true;
  const dateX = template?.date_pos_x ?? meta.date_pos_x ?? (customBgUrl ? 50 : 20);
  const dateY = template?.date_pos_y ?? meta.date_pos_y ?? (customBgUrl ? 70 : 82);
  const dateSize = template?.date_font_size ?? meta.date_font_size ?? 11;
  const dateColor = template?.date_font_color ?? meta.date_font_color ?? '#475569';

  // 7. Header Logo
  const showHeaderLogo = template?.show_header_logo ?? meta.show_header_logo ?? (customBgUrl ? false : true);
  const headerLogoX = template?.header_logo_pos_x ?? meta.header_logo_pos_x ?? 18;
  const headerLogoY = template?.header_logo_pos_y ?? meta.header_logo_pos_y ?? 11;

  // 8. Signer 1
  const showSigner1 = template?.show_signer1 ?? meta.show_signer1 ?? true;
  const signer1Role = template?.signer1_role ?? meta.signer1_role ?? 'Head of TnD & Academy';
  const signer1Name = template?.signer1_name ?? meta.signer1_name ?? 'Rian Hidayat, S.Psi';
  const signer1SigRaw = template?.signer1_signature_url ?? meta.signer1_signature_url ?? null;
  const signer1SigUrl = resolveCertificateImageUrl(signer1SigRaw);
  const signer1X = template?.signer1_pos_x ?? meta.signer1_pos_x ?? 24;
  const signer1Y = template?.signer1_pos_y ?? meta.signer1_pos_y ?? 85;
  const signer1Color = template?.signer1_font_color ?? meta.signer1_font_color ?? '#1e293b';

  // 9. Signer 2
  const showSigner2 = template?.show_signer2 ?? meta.show_signer2 ?? true;
  const signer2Role = template?.signer2_role ?? meta.signer2_role ?? 'Operations Director';
  const signer2Name = template?.signer2_name ?? meta.signer2_name ?? 'Hendri Wijaya, B.Bus';
  const signer2SigRaw = template?.signer2_signature_url ?? meta.signer2_signature_url ?? null;
  const signer2SigUrl = resolveCertificateImageUrl(signer2SigRaw);
  const signer2X = template?.signer2_pos_x ?? meta.signer2_pos_x ?? 76;
  const signer2Y = template?.signer2_pos_y ?? meta.signer2_pos_y ?? 85;
  const signer2Color = template?.signer2_font_color ?? meta.signer2_font_color ?? '#1e293b';

  React.useEffect(() => {
    setSig1Error(false);
  }, [signer1SigUrl]);

  React.useEffect(() => {
    setSig2Error(false);
  }, [signer2SigUrl]);

  // 10. QR & Seal
  const showQr = template?.show_qr ?? meta.show_qr ?? true;
  const qrX = template?.qr_pos_x ?? meta.qr_pos_x ?? 91;
  const qrY = template?.qr_pos_y ?? meta.qr_pos_y ?? 85;
  const qrSize = template?.qr_size ?? meta.qr_size ?? 48;

  const showSeal = template?.show_seal ?? meta.show_seal ?? (customBgUrl ? false : true);
  const sealX = template?.seal_pos_x ?? meta.seal_pos_x ?? 50;
  const sealY = template?.seal_pos_y ?? meta.seal_pos_y ?? 82;

  const showBorder =
    propShowBorder !== undefined
      ? propShowBorder
      : template?.show_border ?? meta.show_border ?? (customBgUrl ? false : true);

  const isGoldTheme = theme.includes('gold');
  const isEmeraldTheme = theme.includes('emerald');
  const isMinimalistTheme = theme.includes('minimalist');

  let outerBorderColor = '#0F4F68';
  let innerBorderColor = '#D4AF37';
  let bgGradient = 'from-slate-50 via-white to-sky-50/40';
  let sealColor = '#0F4F68';
  let accentColor = '#419CC3';

  if (isGoldTheme) {
    outerBorderColor = '#854D0E';
    innerBorderColor = '#EAB308';
    bgGradient = 'from-amber-50/60 via-white to-yellow-50/40';
    sealColor = '#B45309';
    accentColor = '#D97706';
  } else if (isEmeraldTheme) {
    outerBorderColor = '#064E3B';
    innerBorderColor = '#10B981';
    bgGradient = 'from-emerald-50/50 via-white to-teal-50/30';
    sealColor = '#065F46';
    accentColor = '#059669';
  } else if (isMinimalistTheme) {
    outerBorderColor = '#334155';
    innerBorderColor = '#94A3B8';
    bgGradient = 'from-white via-slate-50/50 to-white';
    sealColor = '#475569';
    accentColor = '#0284C7';
  }

  const resolveFontFamily = (family: string) => {
    if (family === 'serif') return "'Georgia', 'Playfair Display', 'Times New Roman', serif";
    if (family === 'cursive') return "'Brush Script MT', 'Great Vibes', cursive";
    if (family === 'mono') return "'Courier New', monospace";
    return "'Inter', system-ui, -apple-system, sans-serif";
  };

  const renderSelectionRing = (key: string) => {
    if (interactiveSelection === key) {
      return 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent bg-blue-500/10 rounded-sm cursor-pointer';
    }
    return onSelectElement ? 'hover:outline-dashed hover:outline-1 hover:outline-blue-400 cursor-pointer' : '';
  };

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
      className="print:transform-none select-none transition-transform duration-200"
    >
      {/* 4:3 Aspect Ratio (800 x 560 Standard Vector Canvas) */}
      <div
        className={`relative w-[800px] h-[560px] ${
          customBgUrl ? 'bg-white' : `bg-gradient-to-br ${bgGradient}`
        } text-slate-800 rounded-lg shadow-xl overflow-hidden print:shadow-none print:w-full print:h-full`}
        style={{
          boxSizing: 'border-box',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* ======================================================== */}
        {/* BACKGROUND LAYER                                         */}
        {/* ======================================================== */}
        {customBgUrl ? (
          customBgUrl.toLowerCase().includes('.pdf') ? (
            <iframe
              src={`${customBgUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="absolute inset-0 w-full h-full border-0 pointer-events-none z-0"
            />
          ) : (
            <img
              src={customBgUrl}
              alt="Custom Certificate Design"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            />
          )
        ) : (
          /* Watermark pattern only for preset theme */
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${outerBorderColor} 2px, transparent 2px)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* Optional Border */}
        {showBorder && (
          <div
            className="absolute inset-4 rounded-md pointer-events-none z-10"
            style={{ border: `3px double ${outerBorderColor}` }}
          >
            <div
              className="absolute inset-1.5 rounded-sm"
              style={{ border: `1px solid ${innerBorderColor}` }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* HEADER LOGO & INSTANSI                                   */}
        {/* ======================================================== */}
        {showHeaderLogo && (
          <div
            onClick={() => onSelectElement?.('headerLogo')}
            className={`absolute z-20 flex items-center gap-3 ${renderSelectionRing('headerLogo')}`}
            style={{
              left: `${headerLogoX}%`,
              top: `${headerLogoY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-white shadow-xs p-1 border border-slate-200/80 flex items-center justify-center">
              <img src={logoTnd} alt="TnD Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[10.5px] font-black uppercase tracking-widest text-slate-800 leading-none">
                PT SOBAT KULINER INDONESIA
              </p>
              <p className="text-[8.5px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                Training & Development Academy LMS
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. JUDUL SERTIFIKAT (TITLE)                              */}
        {/* ======================================================== */}
        {showTitle && (
          <div
            onClick={() => onSelectElement?.('title')}
            className={`absolute z-20 text-center transition-all p-1 ${renderSelectionRing('title')}`}
            style={{
              left: `${titleX}%`,
              top: `${titleY}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '90%',
            }}
          >
            <h2
              className="font-black uppercase tracking-[0.22em] leading-tight"
              style={{
                fontSize: `${titleSize}px`,
                color: titleColor,
                fontFamily: resolveFontFamily(titleFontFamily),
              }}
            >
              {titleText}
            </h2>
            {titleSubtext && (
              <div className="flex items-center justify-center gap-2.5 mt-1">
                <div className="w-12 h-[1px]" style={{ backgroundColor: innerBorderColor }} />
                <p className="text-[10.5px] font-semibold uppercase tracking-widest text-slate-500">
                  {titleSubtext}
                </p>
                <div className="w-12 h-[1px]" style={{ backgroundColor: innerBorderColor }} />
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. TEKS PENGANTAR (INTRO)                                */}
        {/* ======================================================== */}
        {showIntro && (
          <div
            onClick={() => onSelectElement?.('intro')}
            className={`absolute z-20 text-center transition-all p-1 ${renderSelectionRing('intro')}`}
            style={{
              left: `${introX}%`,
              top: `${introY}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '85%',
            }}
          >
            <p
              className="font-medium italic leading-tight"
              style={{
                fontSize: `${introSize}px`,
                color: introColor,
              }}
            >
              {introText}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. NAMA PESERTA                                          */}
        {/* ======================================================== */}
        <div
          onClick={() => onSelectElement?.('name')}
          className={`absolute z-20 transition-all p-1.5 ${renderSelectionRing('name')}`}
          style={{
            left: `${nameX}%`,
            top: `${nameY}%`,
            transform: 'translate(-50%, -50%)',
            textAlign: nameAlign,
            maxWidth: '90%',
          }}
        >
          <h3
            className="font-bold tracking-tight drop-shadow-2xs leading-tight whitespace-nowrap"
            style={{
              fontSize: `${nameFontSize}px`,
              color: nameFontColor,
              fontFamily: resolveFontFamily(nameFontFamily),
            }}
          >
            {recipientName}
          </h3>
          {!customBgUrl && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
                {divisionName}
              </p>
              <div
                className="w-44 h-[2px] mx-auto mt-2 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${innerBorderColor}, transparent)`,
                }}
              />
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. NOMOR SERTIFIKAT                                      */}
        {/* ======================================================== */}
        {showCertNo && (
          <div
            onClick={() => onSelectElement?.('certNo')}
            className={`absolute z-20 transition-all p-1 ${renderSelectionRing('certNo')}`}
            style={{
              left: `${certNoX}%`,
              top: `${certNoY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <p
              className="font-mono font-bold tracking-wider whitespace-nowrap"
              style={{
                fontSize: `${certNoSize}px`,
                color: certNoColor,
              }}
            >
              No: {certificateNumber}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. MODUL / DESKRIPSI PENCAPAIAN                          */}
        {/* ======================================================== */}
        {showCourse && (
          <div
            onClick={() => onSelectElement?.('course')}
            className={`absolute z-20 transition-all p-1 text-center ${renderSelectionRing('course')}`}
            style={{
              left: `${courseX}%`,
              top: `${courseY}%`,
              transform: 'translate(-50%, -50%)',
              maxWidth: '85%',
            }}
          >
            <p
              className="font-medium leading-relaxed"
              style={{
                fontSize: `${courseSize}px`,
                color: courseColor,
              }}
            >
              {courseCustomText.replace('{course}', courseTitle)}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. TANGGAL TERBIT                                        */}
        {/* ======================================================== */}
        {showDate && (
          <div
            onClick={() => onSelectElement?.('date')}
            className={`absolute z-20 transition-all p-1 ${renderSelectionRing('date')}`}
            style={{
              left: `${dateX}%`,
              top: `${dateY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <p
              className="font-medium whitespace-nowrap"
              style={{
                fontSize: `${dateSize}px`,
                color: dateColor,
              }}
            >
              Jakarta, {issueDate}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. SIGNER 1 (KIRI)                                       */}
        {/* ======================================================== */}
        {showSigner1 && (
          <div
            onClick={() => onSelectElement?.('signer1')}
            className={`absolute z-20 transition-all p-1.5 text-center w-52 ${renderSelectionRing('signer1')}`}
            style={{
              left: `${signer1X}%`,
              top: `${signer1Y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="h-10 flex items-center justify-center my-0.5">
              {signer1SigUrl && !sig1Error ? (
                <img
                  src={signer1SigUrl}
                  alt="Tanda Tangan 1"
                  className="h-9 max-w-[130px] object-contain select-none pointer-events-none"
                  onError={() => setSig1Error(true)}
                />
              ) : (
                <span
                  className="text-xl italic font-bold opacity-85 select-none"
                  style={{
                    fontFamily: "'Brush Script MT', 'Great Vibes', cursive",
                    color: signer1Color,
                  }}
                >
                  {signer1Name ? signer1Name.split(',')[0] : 'Tanda Tangan'}
                </span>
              )}
            </div>
            <div className="w-full h-[1px] bg-slate-300" />
            <p
              className="text-[10.5px] font-bold mt-1 whitespace-nowrap"
              style={{ color: signer1Color }}
            >
              {signer1Name}
            </p>
            <p className="text-[9px] font-medium text-slate-500 line-clamp-1">
              {signer1Role}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 8. SIGNER 2 (KANAN)                                      */}
        {/* ======================================================== */}
        {showSigner2 && (
          <div
            onClick={() => onSelectElement?.('signer2')}
            className={`absolute z-20 transition-all p-1.5 text-center w-52 ${renderSelectionRing('signer2')}`}
            style={{
              left: `${signer2X}%`,
              top: `${signer2Y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="h-10 flex items-center justify-center my-0.5">
              {signer2SigUrl && !sig2Error ? (
                <img
                  src={signer2SigUrl}
                  alt="Tanda Tangan 2"
                  className="h-9 max-w-[130px] object-contain select-none pointer-events-none"
                  onError={() => setSig2Error(true)}
                />
              ) : (
                <span
                  className="text-xl italic font-bold opacity-85 select-none"
                  style={{
                    fontFamily: "'Brush Script MT', 'Great Vibes', cursive",
                    color: signer2Color,
                  }}
                >
                  {signer2Name ? signer2Name.split(',')[0] : 'Tanda Tangan'}
                </span>
              )}
            </div>
            <div className="w-full h-[1px] bg-slate-300" />
            <p
              className="text-[10.5px] font-bold mt-1 whitespace-nowrap"
              style={{ color: signer2Color }}
            >
              {signer2Name}
            </p>
            <p className="text-[9px] font-medium text-slate-500 line-clamp-1">
              {signer2Role}
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 9. STEMPEL SEAL                                          */}
        {/* ======================================================== */}
        {showSeal && (
          <div
            onClick={() => onSelectElement?.('seal')}
            className={`absolute z-20 transition-all flex flex-col items-center ${renderSelectionRing('seal')}`}
            style={{
              left: `${sealX}%`,
              top: `${sealY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center p-1 shadow-md border-2 border-dashed bg-white"
              style={{ borderColor: innerBorderColor }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: sealColor }}
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span className="text-[6px] font-black tracking-widest uppercase mt-0.5">
                  OFFICIAL
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 10. QR CODE VERIFIKASI                                   */}
        {/* ======================================================== */}
        {showQr && (
          <div
            onClick={() => onSelectElement?.('qr')}
            className={`absolute z-20 transition-all ${renderSelectionRing('qr')}`}
            style={{
              left: `${qrX}%`,
              top: `${qrY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="p-1 rounded-md bg-white border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
              <div
                className="bg-slate-900 rounded-xs p-1 flex flex-col justify-between"
                style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
              >
                <div className="flex justify-between">
                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                </div>
                <div className="w-2 h-2 bg-amber-400 self-center rounded-xs" />
                <div className="flex justify-between">
                  <div className="w-2.5 h-2.5 bg-white rounded-xs" />
                  <div className="w-1.5 h-1.5 bg-white rounded-xs self-end" />
                </div>
              </div>
              <span className="text-[5.5px] font-mono font-bold text-slate-500 mt-0.5">
                SCAN VERIFY
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
