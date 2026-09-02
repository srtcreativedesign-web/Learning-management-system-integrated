import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CertificateTemplateService } from './certificate-template.service';

@ApiTags('Certificates API (SobatHR Contract)')
@Controller('api/certificates')
export class CertificatesApiController {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService
  ) {}

  /**
   * Endpoint resmi integrasi SobatHR (HRIS & Mobile App):
   * GET /api/certificates/user/{hris_user_id}
   */
  @Get('user/:hris_user_id')
  @ApiOperation({
    summary: 'Daftar sertifikat kelulusan karyawan untuk aplikasi mobile SobatHR',
    description: 'Mengembalikan daftar sertifikat dengan field id, certificate_number, course_title, score, completed_at, dan file_url.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar sertifikat (bisa kosong jika belum ada)',
  })
  async getUserCertificates(@Param('hris_user_id') hrisUserId: string) {
    return this.certificateTemplateService.getUserCertificatesContract(hrisUserId);
  }
}
