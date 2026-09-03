"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatePdfService = void 0;
const common_1 = require("@nestjs/common");
const generator_1 = require("@pdfme/generator");
const schemas_1 = require("@pdfme/schemas");
const fs_1 = require("fs");
const path_1 = require("path");
const certificate_template_service_1 = require("./certificate-template.service");
let CertificatePdfService = class CertificatePdfService {
    certificateTemplateService;
    constructor(certificateTemplateService) {
        this.certificateTemplateService = certificateTemplateService;
    }
    getDefaultPdfmeTemplate(namePosY = 95, fontSize = 32, fontColor = '#0F4F68') {
        return {
            basePdf: { width: 297, height: 210, padding: [0, 0, 0, 0] },
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
    buildTemplateFromMeta(meta, basePdf, ctx) {
        const PAGE_W = 297;
        const PAGE_H = 210;
        const PX_TO_PT = (PAGE_W / 800) / (25.4 / 72);
        const box = (xPct, yPct, w, h) => ({
            x: Math.max(0, (xPct / 100) * PAGE_W - w / 2),
            y: Math.max(0, (yPct / 100) * PAGE_H - h / 2),
        });
        const text = (name, xPct, yPct, sizePx, color, opts = {}) => {
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
        const schema = [];
        const inputs = {};
        const add = (field, value) => {
            schema.push(field);
            inputs[field.name] = value;
        };
        if (meta.show_title ?? true) {
            add(text('judul_sertifikat', meta.title_pos_x ?? 50, meta.title_pos_y ?? 22, meta.title_font_size ?? 24, meta.title_font_color ?? '#0F4F68', { spacing: 2, bold: true, height: 14 }), meta.title_text ?? 'SERTIFIKAT KELULUSAN');
            if (meta.title_subtext) {
                add(text('subjudul_sertifikat', meta.title_pos_x ?? 50, (meta.title_pos_y ?? 22) + 5, 11, meta.title_font_color ?? '#64748b'), meta.title_subtext);
            }
        }
        if (meta.show_cert_no ?? true) {
            add(text('nomor', meta.cert_no_pos_x ?? 82, meta.cert_no_pos_y ?? 11, meta.cert_no_font_size ?? 10.5, meta.cert_no_font_color ?? '#64748b', { width: 110 }), '__NOMOR__');
        }
        if (meta.show_intro ?? true) {
            add(text('keterangan_pembuka', meta.intro_pos_x ?? 50, meta.intro_pos_y ?? 33, meta.intro_font_size ?? 12, meta.intro_font_color ?? '#64748b'), meta.intro_text ?? 'Diberikan kepada:');
        }
        add(text('nama', meta.name_pos_x ?? 50, meta.name_pos_y ?? 44, meta.name_font_size ?? 36, meta.name_font_color ?? '#1e293b', { bold: true, height: 18 }), '__NAMA__');
        if (meta.show_course ?? true) {
            add(text('modul', meta.course_pos_x ?? 50, meta.course_pos_y ?? 58, meta.course_font_size ?? 14, meta.course_font_color ?? '#1e293b', { width: 230, height: 16 }), meta.course_custom_text?.replace('{course}', ctx.courseTitle) ??
                `Telah berhasil menyelesaikan dan lulus uji kompetensi kuis dengan nilai (${ctx.score}%) pada modul “${ctx.courseTitle}”`);
        }
        if (meta.show_date ?? true) {
            add(text('tanggal', meta.date_pos_x ?? 50, meta.date_pos_y ?? 70, meta.date_font_size ?? 11, meta.date_font_color ?? '#475569', { width: 110 }), '__TANGGAL__');
        }
        const signer = (idx, defX, defName, defRole) => {
            if ((meta[`show_signer${idx}`] ?? true) === false)
                return;
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
            add(text(`pengesah_${idx}`, x, y + 6.5, 10, color, { width: 90, height: 12, bold: true }), `${meta[`signer${idx}_name`] ?? defName}\n${meta[`signer${idx}_role`] ?? defRole}`);
        };
        signer(1, 25, 'Rian Hidayat, S.Psi', 'Head of TnD & Academy');
        signer(2, 75, 'Hendri Wijaya, B.Bus', 'Operations Director');
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
    readBasePdf(basePdfUrl) {
        if (!basePdfUrl || !basePdfUrl.toLowerCase().endsWith('.pdf'))
            return null;
        const filePath = (0, path_1.join)(process.cwd(), basePdfUrl.replace(/^\//, ''));
        if (!(0, fs_1.existsSync)(filePath))
            return null;
        return `data:application/pdf;base64,${(0, fs_1.readFileSync)(filePath).toString('base64')}`;
    }
    defaultInputs(cert, formattedDate, meta) {
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
    async generate(attemptId) {
        const all = await this.certificateTemplateService.getIssuedCertificates();
        const cert = all.find((c) => c.id.toLowerCase() === attemptId.toLowerCase() ||
            c.certificate_number.toLowerCase() === attemptId.toLowerCase() ||
            attemptId.toLowerCase().includes(c.id.substring(0, 8).toLowerCase()));
        if (!cert) {
            throw new common_1.NotFoundException(`Sertifikat untuk attempt '${attemptId}' tidak ditemukan.`);
        }
        const templateInDb = cert.template?.pdfme_template;
        const customBasePdf = this.readBasePdf(cert.template?.base_pdf_url);
        const formattedDate = new Date(cert.issue_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        let template;
        let inputs;
        if (templateInDb && templateInDb.schemas) {
            template = templateInDb;
            inputs = [this.defaultInputs(cert, formattedDate, templateInDb)];
        }
        else if (templateInDb || customBasePdf) {
            const built = this.buildTemplateFromMeta(templateInDb || {}, customBasePdf ?? { width: 297, height: 210, padding: [0, 0, 0, 0] }, { score: cert.score, courseTitle: cert.course_title });
            template = built.template;
            inputs = [
                Object.fromEntries(Object.entries(built.inputs).map(([k, v]) => [
                    k,
                    v
                        .replace('__NAMA__', cert.recipient_name)
                        .replace('__NOMOR__', `No: ${cert.certificate_number}`)
                        .replace('__TANGGAL__', `Jakarta, ${formattedDate}`)
                        .replace('__VERIFIKASI_URL__', `${process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3001}`}/certificate-templates/verify/${cert.id}`),
                ])),
            ];
        }
        else {
            template = this.getDefaultPdfmeTemplate(cert.template.name_pos_y ? (cert.template.name_pos_y / 100) * 210 : 95, cert.template.name_font_size || 32, cert.template.name_font_color || '#0F4F68');
            inputs = [this.defaultInputs(cert, formattedDate, templateInDb)];
        }
        const pdfUint8 = await (0, generator_1.generate)({
            template,
            inputs,
            plugins: { ...schemas_1.builtInPlugins, image: schemas_1.image, line: schemas_1.line, qrcode: schemas_1.barcodes.qrcode },
        });
        return Buffer.from(pdfUint8);
    }
};
exports.CertificatePdfService = CertificatePdfService;
exports.CertificatePdfService = CertificatePdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [certificate_template_service_1.CertificateTemplateService])
], CertificatePdfService);
//# sourceMappingURL=certificate-pdf.service.js.map