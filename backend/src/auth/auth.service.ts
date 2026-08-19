import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async login(email: string, password?: string) {
    if (!email || !email.trim()) {
      throw new UnauthorizedException('Alamat email wajib diisi');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists in UserShadow
    let user = await this.prisma.userShadow.findUnique({
      where: { email: cleanEmail },
    });

    // Determine default role based on email pattern if not yet in database
    let defaultRole = 'AUDITOR';
    if (cleanEmail.includes('admin') || cleanEmail.includes('super')) {
      defaultRole = 'SUPER_ADMIN';
    } else if (cleanEmail.includes('manager') || cleanEmail.includes('hrbp')) {
      defaultRole = 'HRBP_MANAGER';
    } else if (cleanEmail.includes('trainer')) {
      defaultRole = 'TRAINER';
    }

    // Auto-provision user if logging in for first time (HRIS SSO sync bridge)
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

  async getProfile(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.userShadow.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan');
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
    } catch {
      throw new UnauthorizedException('Token sesi tidak valid atau kedaluwarsa');
    }
  }
}

