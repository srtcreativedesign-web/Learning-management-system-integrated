import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create Divisions
  const divTrainer = await prisma.divisionShadow.upsert({
    where: { hris_division_id: 'DIV-TND' },
    update: {},
    create: {
      hris_division_id: 'DIV-TND',
      name: 'Training & Development',
    },
  });

  const divOps = await prisma.divisionShadow.upsert({
    where: { hris_division_id: 'DIV-OPS' },
    update: {},
    create: {
      hris_division_id: 'DIV-OPS',
      name: 'Operasional Gudang',
    },
  });

  // 2. Create Users
  const trainer = await prisma.userShadow.upsert({
    where: { email: 'budi.trainer@sobathr.com' },
    update: {},
    create: {
      hris_user_id: 'USR-001',
      full_name: 'Budi Santoso',
      email: 'budi.trainer@sobathr.com',
    },
  });

  const employee = await prisma.userShadow.upsert({
    where: { email: 'andi.karyawan@sobathr.com' },
    update: {},
    create: {
      hris_user_id: 'USR-002',
      full_name: 'Andi Wijaya',
      email: 'andi.karyawan@sobathr.com',
    },
  });

  console.log('Seeding completed!');
  console.log('Demo Users Created:');
  console.log(`- Trainer: ${trainer.email}`);
  console.log(`- Employee: ${employee.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
