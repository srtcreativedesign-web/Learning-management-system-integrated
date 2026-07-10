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
    async getCategories() {
        return this.prisma.auditCategory.findMany({
            include: {
                checklists: {
                    orderBy: { sort_order: 'asc' },
                },
            },
            orderBy: { sort_order: 'asc' },
        });
    }
    async syncStructure(categories) {
        return this.prisma.$transaction(async (tx) => {
            const existingCategories = await tx.auditCategory.findMany({
                include: { checklists: true }
            });
            const incomingCategoryIds = categories.filter(c => c.id).map(c => c.id);
            for (const ec of existingCategories) {
                if (!incomingCategoryIds.includes(ec.id)) {
                    await tx.auditCategory.delete({ where: { id: ec.id } });
                }
            }
            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                let savedCategory;
                if (cat.id && cat.id > 0) {
                    savedCategory = await tx.auditCategory.update({
                        where: { id: cat.id },
                        data: { name: cat.name, sort_order: i }
                    });
                }
                else {
                    savedCategory = await tx.auditCategory.create({
                        data: { name: cat.name, sort_order: i }
                    });
                }
                if (cat.checklists && Array.isArray(cat.checklists)) {
                    const incomingPointIds = cat.checklists.filter((p) => p.id).map((p) => p.id);
                    const existingPoints = await tx.auditChecklistPoint.findMany({ where: { category_id: savedCategory.id } });
                    for (const ep of existingPoints) {
                        if (!incomingPointIds.includes(ep.id)) {
                            await tx.auditChecklistPoint.delete({ where: { id: ep.id } });
                        }
                    }
                    for (let j = 0; j < cat.checklists.length; j++) {
                        const point = cat.checklists[j];
                        if (point.id && point.id > 0) {
                            await tx.auditChecklistPoint.update({
                                where: { id: point.id },
                                data: { question: point.question, sort_order: j, category_id: savedCategory.id }
                            });
                        }
                        else {
                            await tx.auditChecklistPoint.create({
                                data: { question: point.question, sort_order: j, category_id: savedCategory.id }
                            });
                        }
                    }
                }
            }
            return this.getCategories();
        });
    }
};
exports.ChecklistService = ChecklistService;
exports.ChecklistService = ChecklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ChecklistService);
//# sourceMappingURL=checklist.service.js.map