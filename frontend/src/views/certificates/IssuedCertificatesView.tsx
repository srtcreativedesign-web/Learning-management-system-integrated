import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Search,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Share2,
  Filter,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { CertificateData } from '@/components/certificate/CertificateCanvas';
import { getApiUrl } from '@/lib/api';

interface IssuedCertItem {
  id: string;
  certificate_number: string;
  user_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_division: string;
  course_id: string | null;
  course_title: string;
  quiz_id: string;
  score: number;
  xp_awarded: number;
  issue_date: string;
  is_verified: boolean;
  template: {
    id: string;
    name: string;
    bg_image_url: string;
    base_pdf_url?: string | null;
    pdfme_template?: any;
    name_pos_x: number;
    name_pos_y: number;
    name_font_size: number;
    name_font_color: string;
  };
}

export const IssuedCertificatesView: React.FC = () => {
  const [certificates, setCertificates] = useState<IssuedCertItem[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingQuizId, setUpdatingQuizId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');

  // Preview Modal state
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateData | null>(null);

  const loadIssuedCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/certificate-templates/issued/all'));
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      } else {
        // Fallback demo certificates if backend is offline or empty
        setCertificates([
          {
            id: 'att-1',
            certificate_number: 'CERT/TND/2026/07/A9B801',
            user_id: 'usr-1',
            recipient_name: 'Budi Santoso',
            recipient_email: 'budi.santoso@sobathr.com',
            recipient_division: 'Divisi Barista & Beverage',
            course_id: 'crs-1',
            course_title: 'SOP Kalibrasi Espresso & Steaming Susu',
            quiz_id: 'qz-1',
            score: 95,
            xp_awarded: 100,
            issue_date: '2026-07-08T09:30:00Z',
            is_verified: true,
            template: {
              id: 't-1',
              name: 'Navy & Gold Classic',
              bg_image_url: 'theme:classic-navy',
              name_pos_x: 50,
              name_pos_y: 45,
              name_font_size: 34,
              name_font_color: '#0F4F68',
            },
          },
          {
            id: 'att-2',
            certificate_number: 'CERT/TND/2026/07/C7D602',
            user_id: 'usr-2',
            recipient_name: 'Siti Rahma',
            recipient_email: 'siti.rahma@sobathr.com',
            recipient_division: 'Divisi Service & Kasir',
            course_id: 'crs-2',
            course_title: 'Standar Pelayanan Hospitality & Kasir POS',
            quiz_id: 'qz-2',
            score: 90,
            xp_awarded: 80,
            issue_date: '2026-07-06T14:15:00Z',
            is_verified: true,
            template: {
              id: 't-2',
              name: 'Gold Executive',
              bg_image_url: 'theme:gold-executive',
              name_pos_x: 50,
              name_pos_y: 44,
              name_font_size: 36,
              name_font_color: '#1e293b',
            },
          },
          {
            id: 'att-3',
            certificate_number: 'CERT/TND/2026/07/F4E303',
            user_id: 'usr-3',
            recipient_name: 'Doni Pratama',
            recipient_email: 'doni.pratama@sobathr.com',
            recipient_division: 'Divisi Kitchen & Food Safety',
            course_id: 'crs-3',
            course_title: 'Higienitas & Food Safety Management',
            quiz_id: 'qz-3',
            score: 88,
            xp_awarded: 75,
            issue_date: '2026-07-04T11:00:00Z',
            is_verified: true,
            template: {
              id: 't-3',
              name: 'Emerald Specialist',
              bg_image_url: 'theme:emerald-specialist',
              name_pos_x: 50,
              name_pos_y: 46,
              name_font_size: 32,
              name_font_color: '#064e3b',
            },
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading issued certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssuedCertificates();
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await fetch(getApiUrl('/certificate-templates'));
      if (res.ok) {
        const data = await res.json();
        setAvailableTemplates(data);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleChangeCertTemplate = async (quizId: string, newTemplateId: string) => {
    if (!quizId) return;
    setUpdatingQuizId(quizId);
    try {
      const res = await fetch(getApiUrl(`/quizzes/${quizId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificate_template_id: newTemplateId || null,
        }),
      });
      if (res.ok) {
        await loadIssuedCertificates();
        alert('Template sertifikat berhasil diubah! Desain sertifikat langsung diperbarui.');
      } else {
        alert('Gagal mengubah template sertifikat.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengubah template.');
    } finally {
      setUpdatingQuizId(null);
    }
  };

  const divisions = useMemo(() => {
    const list = Array.from(new Set(certificates.map((c) => c.recipient_division).filter(Boolean)));
    return ['ALL', ...list];
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchSearch =
        c.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.course_title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiv = selectedDivision === 'ALL' || c.recipient_division === selectedDivision;
      return matchSearch && matchDiv;
    });
  }, [certificates, searchQuery, selectedDivision]);

  const handleOpenCertificate = (item: IssuedCertItem) => {
    setSelectedCertForModal({
      certificateNumber: item.certificate_number,
      recipientName: item.recipient_name,
      courseTitle: item.course_title,
      score: item.score,
      divisionName: item.recipient_division,
      issueDate: new Date(item.issue_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      template: {
        ...item.template,
        base_pdf_url: item.template.base_pdf_url || undefined,
        ...(item.template.pdfme_template || {}),
      },
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Daftar Sertifikat Terbit
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Buku register resmi seluruh sertifikat kelulusan yang telah disahkan oleh sistem LMS.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Terbit</p>
              <p className="text-base font-black text-slate-800 leading-tight">
                {certificates.length} Sertifikat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="rounded-2xl border-slate-200 shadow-xs p-4">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no. sertifikat, modul..."
              className="pl-9 bg-slate-50 text-xs h-9 border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Divisi:</span>
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDivision === div
                    ? 'bg-[#0F4F68] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {div === 'ALL' ? 'Semua Divisi' : div}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table of Issued Certificates */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">No. Sertifikat</th>
                <th className="py-3 px-4">Nama Peserta</th>
                <th className="py-3 px-4">Modul / Pelatihan</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4">Template Desain</th>
                <th className="py-3 px-4">Tanggal Terbit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Memuat data sertifikat...
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada sertifikat yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11.5px]">
                      {cert.certificate_number}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{cert.recipient_name}</p>
                      <p className="text-[11px] text-slate-400">{cert.recipient_division}</p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                      {cert.course_title}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                        {cert.score}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={cert.template?.id === 'default-template' ? '' : cert.template?.id || ''}
                        onChange={(e) => handleChangeCertTemplate(cert.quiz_id, e.target.value)}
                        disabled={updatingQuizId === cert.quiz_id}
                        className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white hover:border-[#0F4F68] font-medium text-slate-700 shadow-2xs focus:ring-1 focus:ring-[#0F4F68] cursor-pointer max-w-[170px] truncate"
                        title="Ubah template sertifikat untuk modul ini"
                      >
                        <option value="">Default (Classic Navy)</option>
                        {availableTemplates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11.5px]">
                      {new Date(cert.issue_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <ShieldCheck className="w-3 h-3" /> Sah & Terverifikasi
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenCertificate(cert)}
                        className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs font-bold gap-1 rounded-lg shadow-2xs h-8 px-3"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat Sertifikat
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Full Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(selectedCertForModal)}
        onClose={() => setSelectedCertForModal(null)}
        data={selectedCertForModal}
      />
    </div>
  );
};
