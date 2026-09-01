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
exports.ChecklistService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ChecklistService = class ChecklistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    inspectionsStore = [
        {
            id: 'insp-1',
            outlet_id: '1',
            outlet_name: 'Outlet Kemang',
            auditor_name: 'Dian Permata',
            inspection_date: '2026-07-08T10:00:00.000Z',
            compliance_score: 95,
            is_compliant: true,
            total_items: 20,
            ok_items: 19,
            nok_items: 1,
            findings: [
                {
                    point_text: 'Suhu chiller penyimpanan di luar batas toleransi',
                    notes: 'Suhu 8°C (standar maks 4°C)',
                    is_compliant: false,
                },
            ],
        },
        {
            id: 'insp-2',
            outlet_id: '2',
            outlet_name: 'Outlet Sudirman',
            auditor_name: 'Dian Permata',
            inspection_date: '2026-07-05T14:30:00.000Z',
            compliance_score: 70,
            is_compliant: false,
            total_items: 20,
            ok_items: 14,
            nok_items: 6,
            findings: [
                {
                    point_text: 'Alat pemadam kebakaran (APAR) kedaluwarsa',
                    notes: 'Kadaluwarsa per Juni 2026',
                    is_compliant: false,
                },
                {
                    point_text: 'Jalur evakuasi terhalang tumpukan kardus stok',
                    notes: 'Tumpukan barang menutupi pintu belakang',
                    is_compliant: false,
                },
            ],
        },
        {
            id: 'insp-3',
            outlet_id: '3',
            outlet_name: 'Outlet Kelapa Gading',
            auditor_name: 'Dian Permata',
            inspection_date: '2026-07-03T09:15:00.000Z',
            compliance_score: 92,
            is_compliant: true,
            total_items: 20,
            ok_items: 18,
            nok_items: 2,
            findings: [
                {
                    point_text: 'Pekerja tidak menggunakan celemek & hairnet',
                    notes: '2 barista belum memakai hairnet',
                    is_compliant: false,
                },
            ],
        },
        {
            id: 'insp-4',
            outlet_id: '4',
            outlet_name: 'Outlet BSD City',
            auditor_name: 'Dian Permata',
            inspection_date: '2026-07-01T11:00:00.000Z',
            compliance_score: 88,
            is_compliant: true,
            total_items: 20,
            ok_items: 17,
            nok_items: 3,
            findings: [
                {
                    point_text: 'Dokumen izin sanitasi belum diperbarui',
                    notes: 'Masa berlaku habis',
                    is_compliant: false,
                },
            ],
        },
    ];
    async getCategories() {
        let categories = await this.prisma.auditCategory.findMany({
            include: {
                checklists: {
                    orderBy: { sort_order: 'asc' },
                },
            },
            orderBy: { sort_order: 'asc' },
        });
        if (categories.length === 0) {
            const defaultData = [
                {
                    name: 'K3, Keselamatan & Kelayakan Kerja',
                    sort_order: 0,
                    points: [
                        'Ketersediaan dan masa berlaku APAR (Alat Pemadam Api Ringan) dalam kondisi baik',
                        'Jalur evakuasi dan pintu darurat bebas dari halangan barang atau tumpukan stok',
                        'Kotak P3K lengkap dan obat-obatan tidak melewati tanggal kedaluwarsa',
                        'Instalasi kelistrikan dan kabel panel dalam kondisi rapi, aman, dan tidak terbuka',
                    ],
                },
                {
                    name: 'Standar Higienitas, Sanitasi & 5S',
                    sort_order: 1,
                    points: [
                        'Karyawan mengenakan atribut lengkap (hairnet, masker, apron, sepatu tertutup bersih)',
                        'Area kitchen, sink pencucian, dan tempat sampah tertutup serta bebas dari bau menyengat',
                        'Suhu chiller & freezer terpantau stabil sesuai batas toleransi SOP',
                        'Penyimpanan bahan baku menerapkan sistem FIFO (First In First Out) dengan label tanggal jelas',
                    ],
                },
                {
                    name: 'Operasional Kasir, POS & Layanan',
                    sort_order: 2,
                    points: [
                        'Mesin kasir POS, mesin EDC, dan printer struk berfungsi normal tanpa kendala',
                        'Uang modal kasir dan dokumen serah terima shift tercatat akurat dan terverifikasi',
                        'Pemasangan signage promosi dan daftar menu resmi terpajang rapi',
                        'Display etalase produk bersih, rapi, dan informasi harga tercantum jelas',
                    ],
                },
                {
                    name: 'Fasilitas & Pemeliharaan Outlet',
                    sort_order: 3,
                    points: [
                        'Kebersihan area meja makan, lantai, kaca depan, dan toilet pelanggan selalu terjaga',
                        'Peralatan operasional (blender, grinder, ice maker, oven) terawat dan dibersihkan rutin',
                        'Lampu penerangan dan pendingin ruangan (AC) berfungsi optimal',
                    ],
                },
            ];
            for (const cat of defaultData) {
                const createdCat = await this.prisma.auditCategory.create({
                    data: {
                        name: cat.name,
                        sort_order: cat.sort_order,
                    },
                });
                for (let j = 0; j < cat.points.length; j++) {
                    await this.prisma.auditChecklistPoint.create({
                        data: {
                            category_id: createdCat.id,
                            question: cat.points[j],
                            sort_order: j,
                        },
                    });
                }
            }
            categories = await this.prisma.auditCategory.findMany({
                include: {
                    checklists: {
                        orderBy: { sort_order: 'asc' },
                    },
                },
                orderBy: { sort_order: 'asc' },
            });
        }
        return categories;
    }
    async syncStructure(categories) {
        return this.prisma.$transaction(async (tx) => {
            const existingCategories = await tx.auditCategory.findMany({
                include: { checklists: true },
            });
            const incomingCategoryIds = categories.filter((c) => c.id).map((c) => c.id);
            for (const ec of existingCategories) {
                if (!incomingCategoryIds.includes(ec.id)) {
                    await tx.auditCategory.delete({ where: { id: ec.id } });
                }
            }
            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                let savedCategory;
                if (cat.id && typeof cat.id === 'string' && cat.id.length > 5) {
                    savedCategory = await tx.auditCategory.update({
                        where: { id: cat.id },
                        data: { name: cat.name, sort_order: i },
                    });
                }
                else {
                    savedCategory = await tx.auditCategory.create({
                        data: { name: cat.name, sort_order: i },
                    });
                }
                if (cat.checklists && Array.isArray(cat.checklists)) {
                    const incomingPointIds = cat.checklists.filter((p) => p.id).map((p) => p.id);
                    const existingPoints = await tx.auditChecklistPoint.findMany({
                        where: { category_id: savedCategory.id },
                    });
                    for (const ep of existingPoints) {
                        if (!incomingPointIds.includes(ep.id)) {
                            await tx.auditChecklistPoint.delete({ where: { id: ep.id } });
                        }
                    }
                    for (let j = 0; j < cat.checklists.length; j++) {
                        const point = cat.checklists[j];
                        if (point.id && typeof point.id === 'string' && point.id.length > 5) {
                            await tx.auditChecklistPoint.update({
                                where: { id: point.id },
                                data: {
                                    question: point.question,
                                    sort_order: j,
                                    category_id: savedCategory.id,
                                },
                            });
                        }
                        else {
                            await tx.auditChecklistPoint.create({
                                data: {
                                    question: point.question,
                                    sort_order: j,
                                    category_id: savedCategory.id,
                                },
                            });
                        }
                    }
                }
            }
            return this.getCategories();
        });
    }
    async getInspections() {
        return this.inspectionsStore;
    }
    async saveInspection(payload) {
        const newInspection = {
            id: `insp-${Date.now()}`,
            ...payload,
            inspection_date: payload.inspection_date || new Date().toISOString(),
        };
        this.inspectionsStore.unshift(newInspection);
        return newInspection;
    }
};
exports.ChecklistService = ChecklistService;
exports.ChecklistService = ChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ChecklistService);
//# sourceMappingURL=checklist.service.js.map