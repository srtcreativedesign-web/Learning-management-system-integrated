import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CertificateCanvas, CertificateData } from './CertificateCanvas';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-cert/${data.certificateNumber || 'CERT-TND'}`;
    navigator.clipboard.writeText(url);
    alert('Tautan verifikasi sertifikat berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#419CC3]/10 text-[#419CC3] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Sertifikat Resmi Kelulusan
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {data.certificateNumber || 'CERT/TND/2026/07/A89B4C'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs text-slate-600 gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Salin Tautan</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs gap-1.5 font-bold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Scrollable if needed, responsive scaling) */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100/70 print:bg-white print:p-0 min-h-0">
          <div className="w-full flex items-center justify-center">
            {/* Scale canvas slightly for desktop modal */}
            <CertificateCanvas data={data} scale={0.95} />
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Sertifikat ini diakui secara resmi dalam sistem HRIS & TnD SobatHR.
            </span>
          </div>
          <span className="font-medium text-slate-400 text-[11px]">
            Format Standar A4 Landscape
          </span>
        </div>
      </div>
    </div>
  );
};
