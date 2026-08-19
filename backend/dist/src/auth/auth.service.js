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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async login(email, password) {
        if (!email || !email.trim()) {
            throw new common_1.UnauthorizedException('Alamat email wajib diisi');
        }
        const cleanEmail = email.trim().toLowerCase();
        let user = await this.prisma.userShadow.findUnique({
            where: { email: cleanEmail },
        });
        let defaultRole = 'AUDITOR';
        if (cleanEmail.includes('admin') || cleanEmail.includes('super')) {
            defaultRole = 'SUPER_ADMIN';
        }
        else if (cleanEmail.includes('manager') || cleanEmail.includes('hrbp')) {
            defaultRole = 'HRBP_MANAGER';
        }
        else if (cleanEmail.includes('trainer')) {
            defaultRole = 'TRAINER';
        }
        if (!user) {
            const derivedName = cleanEmail
                .split('@')[0]
                .replace(/[._]/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());
            user = await this.prisma.userShadow.create({
                data: {
                    hris_user_id: `USR-${Date.now().toString().slice(-6)}`,
                    full_name: derivedName || 'User TnD',
                    email: cleanEmail,
                    role: defaultRole,
                    current_rank: 'Pemula',
                    total_xp: 50,
                },
            });
        }
        const role = user.role || defaultRole;
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.full_name,
            role: role,
            hris_user_id: user.hris_user_id,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            success: true,
            message: 'Login berhasil',
            access_token: token,
            user: {
                id: user.id,
                hris_user_id: user.hris_user_id,
                name: user.full_name,
                email: user.email,
                role: role,
                total_xp: user.total_xp,
                current_rank: user.current_rank,
            },
        };
    }
    async getProfile(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.prisma.userShadow.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User tidak ditemukan');
            }
            return {
                success: true,
                user: {
                    id: user.id,
                    hris_user_id: user.hris_user_id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role || 'AUDITOR',
                    total_xp: user.total_xp,
                    current_rank: user.current_rank,
                },
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Token sesi tidak valid atau kedaluwarsa');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        client_1.PrismaClient])
], AuthService);
//# sourceMappingURL=auth.service.js.map