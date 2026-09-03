import { Injectable, NotFoundException } from '@nestjs/common';
import { generate } from '@pdfme/generator';
import { builtInPlugins, image, line, barcodes } from '@pdfme/schemas';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CertificateTemplateService } from './certificate-template.service';

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
      // A4 landscape (297x210mm). BLANK_PDF milik pdfme itu A4 portrait,
      // sedangkan seluruh schema di bawah ditata untuk lebar 297mm.
      basePdf: { width: 297, height: 210, padding: [0, 0, 0, 0] as [number, number, number, number] },
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

  /**
   * Template dari editor web menyimpan metadata layout milik CertificateCanvas
   * (posisi persen di kanvas 800x560, ukuran font px), bukan schema pdfme.
   * Di sini metadata itu diterjemahkan ke schema pdfme di atas halaman
   * 297x210mm, plus latar PDF yang di-upload admin, supaya PDF sama dengan
   * pratinjau di web. Elemen gambar (tanda tangan, seal, QR) belum ikut.
   */
  private buildTemplateFromMeta(meta: any, basePdf: any, ctx: { score: number; courseTitle: string }) {
    const PAGE_W = 297;
    const PAGE_H = 210;
    // Kanvas web 800px = 297mm, dan font px di kanvas itu -> pt di PDF.
    const PX_TO_PT = (PAGE_W / 800) / (25.4 / 72);

    const box = (xPct: number, yPct: number, w: number, h: number) => ({
      x: Math.max(0, (xPct / 100) * PAGE_W - w / 2),
      y: Math.max(0, (yPct / 100) * PAGE_H - h / 2),
    });

    const text = (
      name: string,
      xPct: number,
      yPct: number,
      sizePx: number,
      color: string,
      opts: { width?: number; height?: number; spacing?: number; bold?: boolean } = {}
    ) => {
      const width = opts.width ?? 200;
      const height = opts.height ?? Math.max(8, sizePx * PX_TO_PT * 0.5);
      return {
        name,
        type: 'text',
        position: box(xPct, yPct, width, height),
        width,
        height,
        alignment: 'center',
        verticalAlignment: 'middle',
        fontSize: sizePx * PX_TO_PT,
        fontColor: color,
        lineHeight: 1.2,
        characterSpacing: opts.spacing ?? 0,
        ...(opts.bold ? { fontWeight: 'bold' } : {}),
      };
    };

    const schema: any[] = [];
    const inputs: Record<string, string> = {};
    const add = (field: any, value: string) => {
      schema.push(field);
      inputs[field.name] = value;
    };

    if (meta.show_title ?? true) {
      add(
        text('judul_sertifikat', meta.title_pos_x ?? 50, meta.title_pos_y ?? 22, meta.title_font_size ?? 24, meta.title_font_color ?? '#0F4F68', { spacing: 2, bold: true, height: 14 }),
        meta.title_text ?? 'SERTIFIKAT KELULUSAN'
      );
      if (meta.title_subtext) {
        add(
          text('subjudul_sertifikat', meta.title_pos_x ?? 50, (meta.title_pos_y ?? 22) + 5, 11, meta.title_font_color ?? '#64748b'),
          meta.title_subtext
        );
      }
    }

    if (meta.show_cert_no ?? true) {
      add(
        text('nomor', meta.cert_no_pos_x ?? 82, meta.cert_no_pos_y ?? 11, meta.cert_no_font_size ?? 10.5, meta.cert_no_font_color ?? '#64748b', { width: 110 }),
        '__NOMOR__'
      );
    }

    if (meta.show_intro ?? true) {
      add(
        text('keterangan_pembuka', meta.intro_pos_x ?? 50, meta.intro_pos_y ?? 33, meta.intro_font_size ?? 12, meta.intro_font_color ?? '#64748b'),
        meta.intro_text ?? 'Diberikan kepada:'
      );
    }

    add(
      text('nama', meta.name_pos_x ?? 50, meta.name_pos_y ?? 44, meta.name_font_size ?? 36, meta.name_font_color ?? '#1e293b', { bold: true, height: 18 }),
      '__NAMA__'
    );

    if (meta.show_course ?? true) {
      add(
        text('modul', meta.course_pos_x ?? 50, meta.course_pos_y ?? 58, meta.course_font_size ?? 14, meta.course_font_color ?? '#1e293b', { width: 230, height: 16 }),
        // {course} adalah placeholder yang dipakai editor web, sama seperti di CertificateCanvas.
        (meta.course_custom_text as string | undefined)?.replace('{course}', ctx.courseTitle) ??
          `Telah berhasil menyelesaikan dan lulus uji kompetensi kuis dengan nilai (${ctx.score}%) pada modul “${ctx.courseTitle}”`
      );
    }

    if (meta.show_date ?? true) {
      add(
        text('tanggal', meta.date_pos_x ?? 50, meta.date_pos_y ?? 70, meta.date_font_size ?? 11, meta.date_font_color ?? '#475569', { width: 110 }),
        '__TANGGAL__'
      );
    }

    // Blok pengesah mengikuti susunan di web: tanda tangan, garis, lalu nama & jabatan.
    const signer = (idx: 1 | 2, defX: number, defName: string, defRole: string) => {
      if ((meta[`show_signer${idx}`] ?? true) === false) return;
      const x = meta[`signer${idx}_pos_x`] ?? defX;
      const y = meta[`signer${idx}_pos_y`] ?? 85;
      const color = meta[`signer${idx}_font_color`] ?? '#0F4F68';
      const signature = meta[`signer${idx}_signature_url`];

      if (signature) {
        const w = 34;
        const h = 12;
        schema.push({
          name: `ttd_${idx}`,
          type: 'image',
          position: box(x, y - 4.5, w, h),
          width: w,
          height: h,
        });
        inputs[`ttd_${idx}`] = signature;
      }

      const lineW = 44;
      schema.push({
        name: `garis_ttd_${idx}`,
        type: 'line',
        position: box(x, y + 1.5, lineW, 0.3),
        width: lineW,
        height: 0.3,
        color: '#cbd5e1',
      });
      inputs[`garis_ttd_${idx}`] = '';

      add(
        text(`pengesah_${idx}`, x, y + 6.5, 10, color, { width: 90, height: 12, bold: true }),
        `${meta[`signer${idx}_name`] ?? defName}\n${meta[`signer${idx}_role`] ?? defRole}`
      );
    };

    signer(1, 25, 'Rian Hidayat, S.Psi', 'Head of TnD & Academy');
    signer(2, 75, 'Hendri Wijaya, B.Bus', 'Operations Director');

    // QR verifikasi: isinya URL endpoint verify, bukan hiasan seperti di pratinjau web.
    if (meta.show_qr ?? false) {
      const size = (meta.qr_size ?? 48) * (PAGE_W / 800);
      schema.push({
        name: 'qr_verifikasi',
        type: 'qrcode',
        position: box(meta.qr_pos_x ?? 91, meta.qr_pos_y ?? 85, size, size),
        width: size,
        height: size,
        backgroundColor: '#ffffff',
        barColor: '#0f172a',
      });
      inputs['qr_verifikasi'] = '__VERIFIKASI_URL__';
    }

    return { template: { basePdf, schemas: [schema] }, inputs };
  }

  /** Baca PDF latar yang di-upload admin (path /uploads/... relatif ke root backend). */
  private readBasePdf(basePdfUrl?: string | null): string | null {
    if (!basePdfUrl || !basePdfUrl.toLowerCase().endsWith('.pdf')) return null;
    const filePath = join(process.cwd(), basePdfUrl.replace(/^\//, ''));
    if (!existsSync(filePath)) return null;
    return `data:application/pdf;base64,${readFileSync(filePath).toString('base64')}`;
  }

  /** Isi field untuk layout schema pdfme (template lama & default). */
  private defaultInputs(cert: any, formattedDate: string, meta: any) {
    return {
      header_instansi: 'PT SOBAT KULINER INDONESIA — TND ACADEMY',
      judul_sertifikat: 'SERTIFIKAT KELULUSAN',
      nomor: `No: ${cert.certificate_number}`,
      keterangan_pembuka: 'Diberikan kepada:',
      nama: cert.recipient_name,
      keterangan_modul: 'Telah berhasil menyelesaikan dan lulus uji kompetensi standar operasional pada modul:',
      modul: `“${cert.course_title}”`,
      nilai: `Hasil Evaluasi: LULUS (Skor ${cert.score}%)`,
      tanggal: `Jakarta, ${formattedDate}`,
      pengesah_1: `${meta?.signer1_name || 'Rian Hidayat, S.Psi'}\n${meta?.signer1_role || 'Head of TnD & Academy'}`,
      pengesah_2: `${meta?.signer2_name || 'Hendri Wijaya, B.Bus'}\n${meta?.signer2_role || 'Operations Director'}`,
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
    const customBasePdf = this.readBasePdf((cert.template as any)?.base_pdf_url);

    const formattedDate = new Date(cert.issue_date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Tiga kemungkinan template, dari yang paling spesifik:
    // 1. schema pdfme asli, 2. metadata editor web (+latar upload), 3. default polos.
    let template: any;
    let inputs: any[];

    if (templateInDb && templateInDb.schemas) {
      template = templateInDb;
      inputs = [this.defaultInputs(cert, formattedDate, templateInDb)];
    } else if (templateInDb || customBasePdf) {
      const built = this.buildTemplateFromMeta(
        templateInDb || {},
        customBasePdf ?? { width: 297, height: 210, padding: [0, 0, 0, 0] },
        { score: cert.score, courseTitle: cert.course_title }
      );
      template = built.template;
      inputs = [
        Object.fromEntries(
          Object.entries(built.inputs).map(([k, v]) => [
            k,
            v
              .replace('__NAMA__', cert.recipient_name)
              .replace('__NOMOR__', `No: ${cert.certificate_number}`)
              .replace('__TANGGAL__', `Jakarta, ${formattedDate}`)
              .replace(
                '__VERIFIKASI_URL__',
                `${process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3001}`}/certificate-templates/verify/${cert.id}`  // nomor sertifikat mengandung '/', jadi pakai id
              ),
          ])
        ),
      ];
    } else {
      template = this.getDefaultPdfmeTemplate(
        cert.template.name_pos_y ? (cert.template.name_pos_y / 100) * 210 : 95,
        cert.template.name_font_size || 32,
        cert.template.name_font_color || '#0F4F68'
      );
      inputs = [this.defaultInputs(cert, formattedDate, templateInDb)];
    }

    const pdfUint8 = await generate({
      template,
      inputs,
      // builtInPlugins hanya berisi Text; tanda tangan, garis, dan QR perlu didaftarkan sendiri.
      plugins: { ...builtInPlugins, image, line, qrcode: barcodes.qrcode },
    });

    return Buffer.from(pdfUint8);
  }
}
