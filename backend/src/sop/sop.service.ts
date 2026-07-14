import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AiService } from '../lms/ai.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SopService {
  constructor(
    private prisma: PrismaClient,
    private aiService: AiService
  ) {}

  async getAllSops(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.sopDocument.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        Points: {
          orderBy: { order_num: 'asc' }
        },
        _count: {
          select: { Points: true }
        }
      }
    });
  }

  async getSopById(id: string) {
    return this.prisma.sopDocument.findUnique({
      where: { id },
      include: {
        Points: {
          orderBy: { order_num: 'asc' }
        }
      }
    });
  }

  async uploadAndProcessSop(file: any, title: string, category: string) {
    // 1. Save file locally (in a real app this might go to S3)
    const uploadsDir = path.join(process.cwd(), 'uploads', 'sops');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, file.buffer);
    const sourcePdfUrl = `/uploads/sops/${filename}`;

    // 2. Extract text from PDF
    const text = await this.aiService.extractTextFromPdf(filePath);

    // 3. Extract points using Groq AI
    const { points } = await this.aiService.extractSopPoints(text);

    // 4. Save to Database
    const sopDoc = await this.prisma.sopDocument.create({
      data: {
        title,
        category,
        source_pdf: sourcePdfUrl,
        Points: {
          create: points.map((p, index) => ({
            order_num: index + 1,
            title: p.title,
            description: p.description
          }))
        }
      },
      include: {
        Points: true
      }
    });

    return sopDoc;
  }
}
