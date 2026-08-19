import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OutletService {
  private readonly logger = new Logger(OutletService.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly httpService: HttpService,
  ) {}

  async findAll() {
    return this.prisma.outlet.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async syncFromHRIS() {
    const hrisUrl = (process.env.HRIS_BASE_URL || 'http://localhost:8000') + '/api/v1/lms/outlets';
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(hrisUrl, {
          timeout: 10000,
        })
      );
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Invalid response format from HRIS');
      }

      const items = response.data.data;
      let syncedCount = 0;

      for (const item of items) {
        // Support both direct outlet object and nested organization object
        const org = item.organization || item;
        if (!org || !org.id || !org.name) continue;

        const hrisId = Number(org.id);
        const name = String(org.name);
        const address = org.address ? String(org.address) : null;
        const latitude = org.latitude != null ? String(org.latitude) : null;
        const longitude = org.longitude != null ? String(org.longitude) : null;
        const deviceCode = item.device_code || org.code || null;
        const deviceName = item.device_name || (org.code ? `Outlet ${org.code}` : null);
        const deviceId = item.device_id || (item.id !== org.id ? item.id : null);
        const status = item.status || 'active';

        await this.prisma.outlet.upsert({
          where: { hris_id: hrisId },
          update: {
            name,
            address,
            latitude,
            longitude,
            device_id: deviceId ? Number(deviceId) : null,
            device_code: deviceCode,
            device_name: deviceName,
            status,
          },
          create: {
            hris_id: hrisId,
            name,
            address,
            latitude,
            longitude,
            device_id: deviceId ? Number(deviceId) : null,
            device_code: deviceCode,
            device_name: deviceName,
            status,
          },
        });

        syncedCount++;
      }

      this.logger.log(`Successfully synced ${syncedCount} outlets from HRIS.`);
      return { 
        success: true, 
        message: `Berhasil sinkronisasi ${syncedCount} outlet dari SobatHR.`,
        count: syncedCount 
      };
    } catch (error) {
      this.logger.error(`Failed to sync from HRIS: ${error.message}`);
      throw new Error('Sync failed: ' + error.message);
    }
  }
}
