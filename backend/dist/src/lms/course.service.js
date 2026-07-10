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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let CourseService = class CourseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.course.create({
            data: {
                title: dto.title,
                description: dto.description,
                thumbnail_url: dto.thumbnail_url,
                reward_points: dto.reward_points ? Number(dto.reward_points) : 0,
                due_date: dto.due_date ? new Date(dto.due_date) : null,
                Materials: dto.materials && dto.materials.length > 0 ? {
                    create: dto.materials.map(m => ({
                        type: m.type,
                        content_url: m.content_url,
                        min_read_time: m.min_read_time ? Number(m.min_read_time) : 0
                    }))
                } : undefined
            },
        });
    }
    async findAll() {
        return this.prisma.course.findMany({
            include: {
                Materials: {
                    include: {
                        Quiz: {
                            include: {
                                Questions: {
                                    include: {
                                        Options: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.course.findUnique({
            where: { id },
            include: {
                Materials: {
                    include: {
                        Quiz: {
                            include: {
                                Questions: {
                                    include: {
                                        Options: true
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });
    }
    async update(id, dto) {
        return this.prisma.course.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                thumbnail_url: dto.thumbnail_url,
                reward_points: dto.reward_points ? Number(dto.reward_points) : undefined,
                due_date: dto.due_date ? new Date(dto.due_date) : undefined,
            },
        });
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], CourseService);
//# sourceMappingURL=course.service.js.map