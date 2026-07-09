import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CertificateTemplateService {
  constructor(private readonly prisma: PrismaClient) {}

  async createTemplate(data: {
    name: string;
    bg_image_url: string;
    name_pos_x: number;
    name_pos_y: number;
    name_font_size?: number;
    name_font_color?: string;
  }) {
    return this.prisma.certificateTemplate.create({
      data,
    });
  }

  async getAllTemplates() {
    return this.prisma.certificateTemplate.findMany();
  }

  async getTemplateById(id: string) {
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }
}
