import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import logoTnd from '@/assets/logo tnd.png';

export interface CertificateData {
  certificateNumber?: string;
  recipientName: string;
  courseTitle: string;
  score?: number;
  issueDate?: string;
  divisionName?: string;
  trainerOrIssuerName?: string;
  template?: {
    name?: string;
    bg_image_url?: string;
    name_pos_x?: number;
    name_pos_y?: number;
    name_font_size?: number;
    name_font_color?: string;
  };
}

interface CertificateCanvasProps {
  data: CertificateData;
  scale?: number;
  showBorder?: boolean;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  data,
  scale = 1,
  showBorder = true,
}) => {
  const {
    certificateNumber = 'CERT/TND/2026/07/A89B4C',
    recipientName = 'Budi Santoso',
    courseTitle = 'Standar Operasional Prosedur Barista & Kalibrasi Mesin Espresso',
    score = 95,
    issueDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    divisionName = 'Divisi Operasional & Barista',
    trainerOrIssuerName = 'Rian Hidayat, S.Psi (HRBP & Head of TnD)',
    template,
  } = data;

  const theme = template?.bg_image_url || 'theme:classic-navy';
  const nameX = template?.name_pos_x ?? 50;
  const nameY = template?.name_pos_y ?? 46;
  const nameFontSize = template?.name_font_size ?? 34;
  const nameFontColor = template?.name_font_color || '#0F4F68';

  const isGoldTheme = theme.includes('gold');
  const isEmeraldTheme = theme.includes('emerald');
  const isMinimalistTheme = theme.includes('minimalist');

  // Background gradient & border palettes
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

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
      className="print:transform-none select-none transition-transform duration-200"
    >
      {/* 4:3 Aspect Ratio Certificate Document (Width: 800px, Height: 560px standard vector canvas) */}
      <div
        className={`relative w-[800px] h-[560px] bg-gradient-to-br ${bgGradient} text-slate-800 rounded-lg shadow-xl overflow-hidden print:shadow-none print:w-full print:h-full`}
        style={{
          boxSizing: 'border-box',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative Watermark & Corner Ornaments */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${outerBorderColor} 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Outer Ornamental Frame */}
        {showBorder && (
          <div
            className="absolute inset-4 rounded-md pointer-events-none"
            style={{
              border: `3px double ${outerBorderColor}`,
            }}
          >
            {/* Inner Gold Thin Border */}
            <div
              className="absolute inset-1.5 rounded-sm"
              style={{
                border: `1px solid ${innerBorderColor}`,
              }}
            />
          </div>
        )}

        {/* Corner Corner Pieces */}
        <div
          className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 pointer-events-none"
          style={{ borderColor: innerBorderColor }}
        />
        <div
          className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 pointer-events-none"
          style={{ borderColor: innerBorderColor }}
        />
        <div
          className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 pointer-events-none"
          style={{ borderColor: innerBorderColor }}
        />
        <div
          className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 pointer-events-none"
          style={{ borderColor: innerBorderColor }}
        />

        {/* Header: Logo & Organization Title */}
        <div className="pt-9 px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white shadow-xs p-1 border border-slate-200/80 flex items-center justify-center">
              <img src={logoTnd} alt="TnD Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 leading-none">
                PT SOBAT KULINER INDONESIA
              </p>
              <p className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                Training & Development Academy LMS
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
                color: outerBorderColor,
              }}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Sertifikat Terverifikasi Resmi</span>
            </div>
            <p className="text-[8.5px] font-mono text-slate-400 mt-1">
              No: {certificateNumber}
            </p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mt-5">
          <h2
            className="text-2xl font-black uppercase tracking-[0.25em] text-slate-900"
            style={{ color: outerBorderColor }}
          >
            SERTIFIKAT KELULUSAN
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <div className="w-16 h-[1.5px]" style={{ backgroundColor: innerBorderColor }} />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Certificate of Completion & Excellence
            </p>
            <div className="w-16 h-[1.5px]" style={{ backgroundColor: innerBorderColor }} />
          </div>
        </div>

        {/* Body intro */}
        <div className="text-center mt-3">
          <p className="text-[12px] text-slate-500 font-medium italic">
            Diberikan dengan hormat dan apresiasi setinggi-tingginya kepada:
          </p>
        </div>

        {/* Dynamic Recipient Name (with coordinates & styling) */}
        <div
          className="w-full text-center px-8 transition-all"
          style={{
            marginTop: `${(nameY - 44) * 5}px`,
          }}
        >
          <h3
            className="font-black tracking-tight drop-shadow-xs"
            style={{
              fontSize: `${nameFontSize}px`,
              color: nameFontColor,
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            {recipientName}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
            {divisionName}
          </p>
          <div
            className="w-44 h-[2px] mx-auto mt-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${innerBorderColor}, transparent)`,
            }}
          />
        </div>

        {/* Course / Achievement statement */}
        <div className="text-center px-14 mt-3">
          <p className="text-[11.5px] text-slate-600 leading-relaxed max-w-xl mx-auto">
            Telah berhasil menyelesaikan seluruh materi pelatihan, evaluasi standar kerja operasional, dan lulus uji kompetensi kuis dengan nilai kelulusan prima{' '}
            <strong className="text-slate-900 font-bold">({score}%)</strong> pada modul:
          </p>
          <p
            className="text-[13.5px] font-bold text-slate-800 mt-1 max-w-lg mx-auto line-clamp-2"
            style={{ color: outerBorderColor }}
          >
            “{courseTitle}”
          </p>
        </div>

        {/* Footer with Signatures, QR Code & Official Seal */}
        <div className="absolute bottom-6 left-12 right-12 flex items-end justify-between">
          {/* Left: Issued Date & Signer 1 */}
          <div className="text-center w-48">
            <p className="text-[9.5px] text-slate-500 font-medium">
              Jakarta, {issueDate}
            </p>
            <div className="h-10 flex items-center justify-center my-0.5">
              <span
                className="text-lg italic font-bold opacity-80"
                style={{
                  fontFamily: "'Brush Script MT', 'Brush Script Std', cursive",
                  color: outerBorderColor,
                }}
              >
                Rian Hidayat
              </span>
            </div>
            <div className="w-full h-[1px] bg-slate-300" />
            <p className="text-[10px] font-bold text-slate-800 mt-1">
              {trainerOrIssuerName}
            </p>
            <p className="text-[8.5px] text-slate-500">Head of TnD & Academy</p>
          </div>

          {/* Center: Gold Official Seal Stamp */}
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center p-1.5 shadow-md border-2 border-dashed"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: innerBorderColor,
              }}
            >
              <div
                className="w-full h-full rounded-full flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: sealColor }}
              >
                <Award className="w-5 h-5 text-amber-300" />
                <span className="text-[6.5px] font-black tracking-widest uppercase mt-0.5">
                  OFFICIAL
                </span>
              </div>
            </div>
            <p className="text-[8px] font-bold text-slate-400 mt-1 tracking-wider uppercase">
              TnD Seal of Excellence
            </p>
          </div>

          {/* Right: Operations Director & QR Verification Code */}
          <div className="flex items-center gap-3 w-52 justify-end">
            <div className="text-center flex-1">
              <p className="text-[9.5px] text-slate-500 font-medium">Disahkan Oleh</p>
              <div className="h-10 flex items-center justify-center my-0.5">
                <span
                  className="text-lg italic font-bold opacity-80"
                  style={{
                    fontFamily: "'Brush Script MT', 'Brush Script Std', cursive",
                    color: outerBorderColor,
                  }}
                >
                  Hendri Wijaya
                </span>
              </div>
              <div className="w-full h-[1px] bg-slate-300" />
              <p className="text-[10px] font-bold text-slate-800 mt-1">
                Hendri Wijaya, B.Bus
              </p>
              <p className="text-[8.5px] text-slate-500">Operations Director</p>
            </div>

            {/* QR Mockup for verification */}
            <div className="p-1 rounded-md bg-white border border-slate-200 shadow-xs flex flex-col items-center shrink-0">
              <div className="w-11 h-11 bg-slate-900 rounded-xs p-1 flex flex-col justify-between">
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
              <span className="text-[6.5px] font-mono font-bold text-slate-500 mt-0.5">
                SCAN VERIFY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
