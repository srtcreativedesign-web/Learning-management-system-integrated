import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        const client = new PrismaClient({ adapter, log: ['error'] });
        return client;
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
