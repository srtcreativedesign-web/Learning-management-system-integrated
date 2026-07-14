import { Module } from '@nestjs/common';
import { SopController } from './sop.controller';
import { SopService } from './sop.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LmsModule } from '../lms/lms.module';
import { AiService } from '../lms/ai.service';

@Module({
  imports: [PrismaModule, LmsModule],
  controllers: [SopController],
  providers: [SopService, AiService],
})
export class SopModule {}
