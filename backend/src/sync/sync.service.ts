import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaClient) {}

  async syncUser(dto: SyncUserDto) {
    return this.prisma.userShadow.upsert({
      where: { hris_user_id: dto.hris_user_id },
      update: {
        full_name: dto.full_name,
        email: dto.email,
      },
      create: {
        hris_user_id: dto.hris_user_id,
        full_name: dto.full_name,
        email: dto.email,
      },
    });
  }

  async syncDivision(dto: SyncDivisionDto) {
    return this.prisma.divisionShadow.upsert({
      where: { hris_division_id: dto.hris_division_id },
      update: {
        name: dto.name,
      },
      create: {
        hris_division_id: dto.hris_division_id,
        name: dto.name,
      },
    });
  }
}
