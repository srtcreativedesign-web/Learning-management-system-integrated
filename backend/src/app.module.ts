import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LmsModule } from './lms/lms.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { SyncModule } from './sync/sync.module';
import { SopModule } from './sop/sop.module';
import { GamificationModule } from './gamification/gamification.module';
import { InHouseModule } from './in-house/in-house.module';

@Module({
  imports: [PrismaModule, LmsModule, AuditModule, AuthModule, SyncModule, SopModule, GamificationModule, InHouseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

