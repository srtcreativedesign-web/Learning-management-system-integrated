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
    async generate(attemptId) {
        const all = await this.certificateTemplateService.getIssuedCertificates();
        const cert = all.find((c) => c.id.toLowerCase() === attemptId.toLowerCase() ||
            c.certificate_number.toLowerCase() === attemptId.toLowerCase() ||
            attemptId.toLowerCase().includes(c.id.substring(0, 8).toLowerCase()));
        if (!cert) {
            throw new common_1.NotFoundException(`Sertifikat untuk attempt '${attemptId}' tidak ditemukan.`);
        }
        const templateInDb = cert.template?.pdfme_template;
        const template = templateInDb && templateInDb.schemas
            ? templateInDb
            : this.getDefaultPdfmeTemplate(cert.template.name_pos_y ? (cert.template.name_pos_y / 100) * 210 : 95, cert.template.name_font_size || 32, cert.template.name_font_color || '#0F4F68');
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
        const pdfUint8 = await (0, generator_1.generate)({
            template,
            inputs,
            plugins: schemas_1.builtInPlugins,
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