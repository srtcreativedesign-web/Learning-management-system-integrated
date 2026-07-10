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
      const response = await firstValueFrom(this.httpService.get(hrisUrl));
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Invalid response format from HRIS');
      }

      const devices = response.data.data;
      let syncedCount = 0;

      for (const device of devices) {
        if (!device.organization) continue;

        const org = device.organization;
        
        await this.prisma.outlet.upsert({
          where: { hris_id: org.id },
          update: {
            name: org.name,
            address: org.address,
            latitude: org.latitude?.toString(),
            longitude: org.longitude?.toString(),
            device_id: device.id,
            device_code: device.device_code,
            device_name: device.device_name,
            status: device.status,
          },
          create: {
            hris_id: org.id,
            name: org.name,
            address: org.address,
            latitude: org.latitude?.toString(),
            longitude: org.longitude?.toString(),
            device_id: device.id,
            device_code: device.device_code,
            device_name: device.device_name,
            status: device.status,
          },
        });
        
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} outlets from HRIS.` };
    } catch (error) {
      this.logger.error(`Failed to sync from HRIS: ${error.message}`);
      throw new Error('Sync failed: ' + error.message);
    }
  }
}
