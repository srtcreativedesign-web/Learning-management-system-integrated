import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaClient) {}

  async findAllForOfflineSync() {
    return this.prisma.auditTemplate.findMany({
      include: {
        Checklists: true,
      },
    });
  }
}
