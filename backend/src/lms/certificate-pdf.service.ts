import { Injectable, NotFoundException } from '@nestjs/common';
import { generate } from '@pdfme/generator';
import { builtInPlugins } from '@pdfme/schemas';
import { CertificateTemplateService } from './certificate-template.service';
import { BLANK_PDF } from '@pdfme/common';

@Injectable()
export class CertificatePdfService {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService
  ) {}

  /**
   * Membuat default pdfme template (A4 Landscape) jika template di database belum diset oleh admin
   */
  private getDefaultPdfmeTemplate(namePosY: number = 95, fontSize: number = 32, fontColor: string = '#0F4F68') {
    return {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'header_instansi',
            type: 'text',
            position: { x: 20, y: 22 },
            width: 257,
            height: 10,
            alignment: 'center',
            fontSize: 12,
            fontColor: '#0F4F68',
            characterSpacing: 2,
            lineHeight: 1,
            fontWeight: 'bold',
          },
          {
            name: 'judul_sertifikat',
            type: 'text',
            position: { x: 20, y: 35 },
            width: 257,
            height: 16,
            alignment: 'center',
            fontSize: 26,
            fontColor: '#0F4F68',
            characterSpacing: 4,
            fontWeight: 'bold',
          },
          {
            name: 'nomor',
            type: 'text',
            position: { x: 20, y: 52 },
            width: 257,
            height: 8,
            alignment: 'center',
            fontSize: 10,
            fontColor: '#64748b',
          },
          {
            name: 'keterangan_pembuka',
            type: 'text',
            position: { x: 20, y: 68 },
            width: 257,
            height: 8,
            alignment: 'center',
            fontSize: 11,
            fontColor: '#475569',
          },
          {
            name: 'nama',
            type: 'text',
            position: { x: 20, y: namePosY },
            width: 257,
            height: 16,
            alignment: 'center',
            fontSize: fontSize,
            fontColor: fontColor,
            fontWeight: 'bold',
          },
          {
            name: 'keterangan_modul',
            type: 'text',
            position: { x: 30, y: 115 },
            width: 237,
            height: 14,
            alignment: 'center',
            fontSize: 11,
            fontColor: '#334155',
            lineHeight: 1.3,
          },
          {
            name: 'modul',
            type: 'text',
            position: { x: 30, y: 130 },
            width: 237,
            height: 14,
            alignment: 'center',
            fontSize: 14,
            fontColor: '#0F4F68',
            fontWeight: 'bold',
          },
          {
            name: 'nilai',
            type: 'text',
            position: { x: 30, y: 146 },
            width: 237,
            height: 8,
            alignment: 'center',
            fontSize: 11,
            fontColor: '#059669',
            fontWeight: 'bold',
          },
          {
            name: 'tanggal',
            type: 'text',
            position: { x: 30, y: 168 },
            width: 80,
            height: 8,
            alignment: 'center',
            fontSize: 10,
            fontColor: '#475569',
          },
          {
            name: 'pengesah_1',
            type: 'text',
            position: { x: 30, y: 182 },
            width: 80,
            height: 8,
            alignment: 'center',
            fontSize: 10,
            fontColor: '#0F4F68',
            fontWeight: 'bold',
          },
          {
            name: 'pengesah_2',
            type: 'text',
            position: { x: 187, y: 182 },
            width: 80,
            height: 8,
            alignment: 'center',
            fontSize: 10,
            fontColor: '#0F4F68',
            fontWeight: 'bold',
          },
        ],
      ],
    };
  }

  async generate(attemptId: string): Promise<Buffer> {
    const all = await this.certificateTemplateService.getIssuedCertificates();
    const cert = all.find(
      (c) =>
        c.id.toLowerCase() === attemptId.toLowerCase() ||
        c.certificate_number.toLowerCase() === attemptId.toLowerCase() ||
        attemptId.toLowerCase().includes(c.id.substring(0, 8).toLowerCase())
    );

    if (!cert) {
      throw new NotFoundException(`Sertifikat untuk attempt '${attemptId}' tidak ditemukan.`);
    }

    const templateInDb = (cert.template as any)?.pdfme_template;
    const template =
      templateInDb && templateInDb.schemas
        ? templateInDb
        : this.getDefaultPdfmeTemplate(
            cert.template.name_pos_y ? (cert.template.name_pos_y / 100) * 210 : 95,
            cert.template.name_font_size || 32,
            cert.template.name_font_color || '#0F4F68'
          );

    const formattedDate = new Date(cert.issue_date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const signer1Name = templateInDb?.signer1_name || 'Rian Hidayat, S.Psi';
    const signer1Role = templateInDb?.signer1_role || 'Head of TnD & Academy';
    const signer2Name = templateInDb?.signer2_name || 'Hendri Wijaya, B.Bus';
    const signer2Role = templateInDb?.signer2_role || 'Operations Director';

    const inputs = [
      {
        header_instansi: 'PT SOBAT KULINER INDONESIA — TND ACADEMY',
        judul_sertifikat: 'SERTIFIKAT KELULUSAN',
        nomor: `No: ${cert.certificate_number}`,
        keterangan_pembuka: 'Diberikan kepada:',
        nama: cert.recipient_name,
        keterangan_modul: 'Telah berhasil menyelesaikan dan lulus uji kompetensi standar operasional pada modul:',
        modul: `“${cert.course_title}”`,
        nilai: `Hasil Evaluasi: LULUS (Skor ${cert.score}%)`,
        tanggal: `Jakarta, ${formattedDate}`,
        pengesah_1: `${signer1Name}\n${signer1Role}`,
        pengesah_2: `${signer2Name}\n${signer2Role}`,
      },
    ];

    const pdfUint8 = await generate({
      template,
      inputs,
      plugins: builtInPlugins,
    });

    return Buffer.from(pdfUint8);
  }
}
