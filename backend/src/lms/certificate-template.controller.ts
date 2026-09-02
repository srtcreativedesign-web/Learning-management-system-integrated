import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { CertificateTemplateService } from './certificate-template.service';
import { CertificatePdfService } from './certificate-pdf.service';

@Controller('certificate-templates')
export class CertificateTemplateController {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService,
    private readonly certificatePdfService: CertificatePdfService
  ) {}

  @Post('upload-bg')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/certificates';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, 'bg-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    })
  )
  async uploadBackground(@UploadedFile() file: any) {
    return {
      success: true,
      url: `/uploads/certificates/${file.filename}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  @Post('upload-signature')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/certificates/signatures';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, 'sig-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    })
  )
  async uploadSignature(@UploadedFile() file: any) {
    return {
      success: true,
      url: `/uploads/certificates/signatures/${file.filename}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  @Post()
  async createTemplate(@Body() data: any) {
    return this.certificateTemplateService.createTemplate(data);
  }

  @Post('seed')
  async seedTemplates() {
    await this.certificateTemplateService.seedDefaultTemplates();
    return { message: 'Template bawaan berhasil di-seed' };
  }

  @Get()
  async getAllTemplates() {
    return this.certificateTemplateService.getAllTemplates();
  }

  @Get('issued/all')
  async getIssuedCertificates() {
    return this.certificateTemplateService.getIssuedCertificates();
  }

  @Get('issued/:attemptId/pdf')
  async getCertificatePdf(@Param('attemptId') attemptId: string, @Res() res: any) {
    const pdfBuffer = await this.certificatePdfService.generate(attemptId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Sertifikat-${attemptId.substring(0, 8)}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('verify/:identifier')
  async verifyCertificate(@Param('identifier') identifier: string) {
    return this.certificateTemplateService.verifyCertificate(identifier);
  }

  @Get('user/:userId')
  async getUserCertificates(@Param('userId') userId: string) {
    return this.certificateTemplateService.getUserCertificates(userId);
  }

  @Get(':id')
  async getTemplate(@Param('id') id: string) {
    return this.certificateTemplateService.getTemplateById(id);
  }

  @Put(':id')
  async updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.certificateTemplateService.updateTemplate(id, data);
  }

  @Delete(':id')
  async deleteTemplate(@Param('id') id: string) {
    return this.certificateTemplateService.deleteTemplate(id);
  }
}
