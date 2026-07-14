import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';

@Injectable()
export class SyncService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly httpService: HttpService,
  ) {}

  async syncUser(dto: SyncUserDto) {
    return this.prisma.userShadow.upsert({
      where: { hris_user_id: dto.hris_user_id },
      update: {
        full_name: dto.full_name,
        email: dto.email,
        ...(dto.join_date && { join_date: new Date(dto.join_date) }),
      },
      create: {
        hris_user_id: dto.hris_user_id,
        full_name: dto.full_name,
        email: dto.email,
        join_date: dto.join_date ? new Date(dto.join_date) : null,
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

  async syncEmployeesFromHRIS() {
    const hrisUrl = (process.env.HRIS_BASE_URL || 'http://localhost:8000') + '/api/v1/lms/employees';
    
    try {
      const response = await firstValueFrom(this.httpService.get(hrisUrl));
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Invalid response format from HRIS');
      }

      const employees = response.data.data;
      let syncedCount = 0;

      for (const emp of employees) {
        await this.prisma.userShadow.upsert({
          where: { hris_user_id: String(emp.id) },
          update: {
            full_name: emp.name,
            email: emp.email,
            ...(emp.join_date && { join_date: new Date(emp.join_date) }),
          },
          create: {
            hris_user_id: String(emp.id),
            full_name: emp.name,
            email: emp.email,
            join_date: emp.join_date ? new Date(emp.join_date) : null,
          },
        });
        
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} employees from HRIS.` };
    } catch (error) {
      throw new Error('Sync failed: ' + error.message);
    }
  }

  async getEmployees() {
    return this.prisma.userShadow.findMany({
      orderBy: { full_name: 'asc' },
    });
  }
}
