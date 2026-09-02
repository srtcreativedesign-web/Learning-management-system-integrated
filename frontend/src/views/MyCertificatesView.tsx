import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { CertificateData } from '@/components/certificate/CertificateCanvas';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';

export const MyCertificatesView: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateData | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadUserCertificates = async () => {
    setIsLoading(true);
    try {
      // First try specific user endpoint, or fallback to all issued filtered
      const userId = user?.id || 'usr-1';
      const res = await fetch(getApiUrl(`/certificate-templates/user/${userId}`));
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        const resAll = await fetch(getApiUrl('/certificate-templates/issued/all'));
        if (resAll.ok) {
          const allData = await resAll.json();
          // Filter if matches user name or return sample list for demo
          setCertificates(allData);
        }
      }
    } catch (err) {
      console.error('Failed to load user certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserCertificates();
  }, [user]);

  const handleDownloadPdf = async (cert: any) => {
    setDownloadingId(cert.id);
    try {
      const pdfUrl = getApiUrl(`/certificate-templates/issued/${cert.id}/pdf`);
      const res = await fetch(pdfUrl);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sertifikat-${cert.certificate_number.replace(/\//g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Fallback open certificate modal for direct print
        handleOpenModal(cert);
      }
    } catch {
      handleOpenModal(cert);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenModal = (cert: any) => {
    setSelectedCertForModal({
      certificateNumber: cert.certificate_number,
      recipientName: cert.recipient_name || user?.name || 'Karyawan TnD',
      courseTitle: cert.course_title,
      score: cert.score,
      divisionName: cert.recipient_division || 'Operasional Outlet',
      issueDate: new Date(cert.issue_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      template: cert.template,
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Sertifikat Saya
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Koleksi sertifikat resmi kelulusan modul pelatihan & uji kompetensi Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">
            {certificates.length} Sertifikat Terverifikasi
          </span>
        </div>
      </div>

      {/* Grid of Certificates */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <p className="text-sm font-medium">Memuat sertifikat kelulusan Anda...</p>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-700">Belum Ada Sertifikat</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Selesaikan modul pelatihan dan lulus ujian kuis dengan nilai minimum untuk mendapatkan sertifikat resmi.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Top Certificate Thumbnail Strip */}
              <div className="bg-gradient-to-r from-[#0F4F68] to-[#419CC3] p-5 text-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xs pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-bold uppercase bg-white/15 px-2 py-0.5 rounded-full">
                    {cert.certificate_number}
                  </span>
                  <span className="text-[11px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                    Skor {cert.score}%
                  </span>
                </div>

                <h3 className="font-bold text-base mt-3 line-clamp-2 leading-snug">
                  {cert.course_title}
                </h3>
              </div>

              {/* Card Details */}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(cert.issue_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resmi
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(cert)}
                    className="flex-1 text-xs text-slate-700 gap-1.5 rounded-xl h-9 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDownloadPdf(cert)}
                    disabled={downloadingId === cert.id}
                    className="flex-1 bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs font-bold gap-1.5 rounded-xl h-9 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingId === cert.id ? 'Memproses...' : 'Unduh PDF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(selectedCertForModal)}
        onClose={() => setSelectedCertForModal(null)}
        data={selectedCertForModal}
      />
    </div>
  );
};
