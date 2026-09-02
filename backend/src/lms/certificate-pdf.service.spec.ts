import { Test, TestingModule } from '@nestjs/testing';
import { CertificatePdfService } from './certificate-pdf.service';
import { CertificateTemplateService } from './certificate-template.service';
import { PrismaClient } from '@prisma/client';

describe('CertificatePdfService', () => {
  let service: CertificatePdfService;
  let templateService: CertificateTemplateService;

  beforeEach(async () => {
    const mockPrisma = {
      certificateTemplate: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'tmpl-1' }),
      },
      employeeQuizAttempt: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'attempt-12345678',
            user_id: 'usr-1',
            quiz_id: 'quiz-1',
            score: 95,
            is_passed: true,
            xp_awarded: 100,
            created_at: new Date('2026-07-08T10:00:00Z'),
            User: {
              full_name: 'Budi Santoso',
              email: 'budi@sobathr.com',
              role: 'TRAINER',
            },
            Quiz: {
              Template: {
                id: 'tmpl-1',
                name: 'Template Standar',
                name_pos_y: 45,
                name_font_size: 32,
                name_font_color: '#0F4F68',
              },
              Material: {
                Course: {
                  title: 'Pelatihan Barista Espresso',
                },
              },
            },
          },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatePdfService,
        CertificateTemplateService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CertificatePdfService>(CertificatePdfService);
    templateService = module.get<CertificateTemplateService>(CertificateTemplateService);
  });

  it('should generate a valid PDF buffer with %PDF- header', async () => {
    const buf = await service.generate('attempt-12345678');
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(buf.length).toBeGreaterThan(1000);
  });
});
