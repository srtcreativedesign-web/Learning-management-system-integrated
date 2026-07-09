import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async mockSsoLogin(email: string) {
    const user = await this.prisma.userShadow.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak terdaftar di HRIS');
    }

    const payload = { sub: user.id, email: user.email, name: user.full_name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    };
  }
}
