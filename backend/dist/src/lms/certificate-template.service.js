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
exports.CertificateTemplateService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let CertificateTemplateService = class CertificateTemplateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(data) {
        return this.prisma.certificateTemplate.create({
            data: {
                name: data.name,
                bg_image_url: data.bg_image_url || 'theme:classic-navy',
                base_pdf_url: data.base_pdf_url || null,
                pdfme_template: data.pdfme_template || null,
                name_pos_x: Number(data.name_pos_x ?? 50),
                name_pos_y: Number(data.name_pos_y ?? 45),
                name_font_size: Number(data.name_font_size ?? 32),
                name_font_color: data.name_font_color || '#1e293b',
            },
        });
    }
    async getAllTemplates() {
        const templates = await this.prisma.certificateTemplate.findMany({
            include: {
                _count: {
                    select: { Quizzes: true },
                },
            },
            orderBy: { id: 'asc' },
        });
        if (templates.length === 0) {
            await this.seedDefaultTemplates();
            return this.prisma.certificateTemplate.findMany({
                include: {
                    _count: {
                        select: { Quizzes: true },
                    },
                },
            });
        }
        return templates;
    }
    async getTemplateById(id) {
        const template = await this.prisma.certificateTemplate.findUnique({
            where: { id },
            include: {
                Quizzes: {
                    include: {
                        Material: {
                            include: {
                                Course: true,
                            },
                        },
                    },
                },
            },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template tidak ditemukan');
        }
        return template;
    }
    async updateTemplate(id, data) {
        const existing = await this.prisma.certificateTemplate.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Template tidak ditemukan');
        }
        return this.prisma.certificateTemplate.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.bg_image_url && { bg_image_url: data.bg_image_url }),
                ...(data.base_pdf_url !== undefined && { base_pdf_url: data.base_pdf_url }),
                ...(data.pdfme_template !== undefined && { pdfme_template: data.pdfme_template }),
                ...(data.name_pos_x !== undefined && { name_pos_x: Number(data.name_pos_x) }),
                ...(data.name_pos_y !== undefined && { name_pos_y: Number(data.name_pos_y) }),
                ...(data.name_font_size !== undefined && { name_font_size: Number(data.name_font_size) }),
                ...(data.name_font_color && { name_font_color: data.name_font_color }),
            },
        });
    }
    async deleteTemplate(id) {
        const existing = await this.prisma.certificateTemplate.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Template tidak ditemukan');
        }
        return this.prisma.certificateTemplate.delete({
            where: { id },
        });
    }
    async seedDefaultTemplates() {
        const defaults = [
            {
                name: 'Template Elegan Klasik (Navy & Gold)',
                bg_image_url: 'theme:classic-navy',
                name_pos_x: 50,
                name_pos_y: 45,
                name_font_size: 34,
                name_font_color: '#0F4F68',
            },
            {
                name: 'Template Modern Executive (Gold Border)',
                bg_image_url: 'theme:gold-executive',
                name_pos_x: 50,
                name_pos_y: 44,
                name_font_size: 36,
                name_font_color: '#1e293b',
            },
            {
                name: 'Template Spesialis F&B Barista (Emerald)',
                bg_image_url: 'theme:emerald-specialist',
                name_pos_x: 50,
                name_pos_y: 46,
                name_font_size: 32,
                name_font_color: '#064e3b',
            },
            {
                name: 'Template Minimalist Clean (SobatHR Light)',
                bg_image_url: 'theme:minimalist-light',
                name_pos_x: 50,
                name_pos_y: 45,
                name_font_size: 32,
                name_font_color: '#334155',
            },
        ];
        for (const item of defaults) {
            await this.prisma.certificateTemplate.create({
                data: item,
            });
        }
    }
    async getIssuedCertificates() {
        const passedAttempts = await this.prisma.employeeQuizAttempt.findMany({
            where: { is_passed: true },
            include: {
                User: true,
                Quiz: {
                    include: {
                        Template: true,
                        Material: {
                            include: {
                                Course: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        const defaultTemplate = {
            id: 'default-template',
            name: 'Template Standar Kelulusan TnD',
            bg_image_url: 'theme:classic-navy',
            name_pos_x: 50,
            name_pos_y: 45,
            name_font_size: 34,
            name_font_color: '#0F4F68',
        };
        return passedAttempts.map((attempt) => {
            const courseTitle = attempt.Quiz?.Material?.Course?.title ||
                attempt.Quiz?.Material?.content_url ||
                'Modul Pelatihan Standar Operasional';
            const template = attempt.Quiz?.Template || defaultTemplate;
            const certYear = new Date(attempt.created_at).getFullYear();
            const certMonth = String(new Date(attempt.created_at).getMonth() + 1).padStart(2, '0');
            const certShortId = attempt.id.substring(0, 8).toUpperCase();
            const certificateNumber = `CERT/TND/${certYear}/${certMonth}/${certShortId}`;
            return {
                id: attempt.id,
                certificate_number: certificateNumber,
                user_id: attempt.user_id,
                recipient_name: attempt.User?.full_name || 'Karyawan TnD',
                recipient_email: attempt.User?.email || 'karyawan@sobathr.com',
                recipient_division: attempt.User?.role || 'Operasional Barista',
                course_id: attempt.Quiz?.Material?.course_id || null,
                course_title: courseTitle,
                quiz_id: attempt.quiz_id,
                score: Math.round(attempt.score),
                xp_awarded: attempt.xp_awarded,
                issue_date: attempt.created_at,
                is_verified: true,
                template: {
                    id: template.id,
                    name: template.name,
                    bg_image_url: template.bg_image_url,
                    name_pos_x: template.name_pos_x,
                    name_pos_y: template.name_pos_y,
                    name_font_size: template.name_font_size,
                    name_font_color: template.name_font_color,
                },
            };
        });
    }
    async verifyCertificate(identifier) {
        const all = await this.getIssuedCertificates();
        const found = all.find((c) => c.id.toLowerCase() === identifier.toLowerCase() ||
            c.certificate_number.toLowerCase() === identifier.toLowerCase() ||
            identifier.toLowerCase().includes(c.id.substring(0, 8).toLowerCase()));
        if (!found) {
            throw new common_1.NotFoundException('Sertifikat tidak ditemukan atau belum terverifikasi');
        }
        return {
            valid: true,
            certificate: found,
            issuer: 'TnD Learning Management System — PT Sobat Kuliner Indonesia',
            verification_timestamp: new Date().toISOString(),
        };
    }
    async getUserCertificates(userId) {
        const all = await this.getIssuedCertificates();
        return all.filter((c) => c.user_id === userId);
    }
    async getUserCertificatesContract(hrisUserId) {
        const userShadow = await this.prisma.userShadow.findFirst({
            where: {
                OR: [{ hris_user_id: String(hrisUserId) }, { id: String(hrisUserId) }],
            },
        });
        if (!userShadow) {
            return { data: [] };
        }
        const all = await this.getIssuedCertificates();
        const userCerts = all.filter((c) => c.user_id === userShadow.id);
        const data = userCerts.map((cert) => ({
            id: cert.id,
            certificate_number: cert.certificate_number,
            course_title: cert.course_title,
            score: cert.score,
            completed_at: new Date(cert.issue_date).toISOString(),
            file_url: `/certificate-templates/issued/${cert.id}/pdf`,
        }));
        return { data };
    }
};
exports.CertificateTemplateService = CertificateTemplateService;
exports.CertificateTemplateService = CertificateTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], CertificateTemplateService);
//# sourceMappingURL=certificate-template.service.js.map