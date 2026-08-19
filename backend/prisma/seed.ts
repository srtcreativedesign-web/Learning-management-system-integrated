import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Ensuring RBAC roles and master records in database...');

  // 1. Divisions
  await prisma.divisionShadow.upsert({
    where: { hris_division_id: 'DIV-TND' },
    update: {},
    create: {
      hris_division_id: 'DIV-TND',
      name: 'Training & Development',
    },
  });

  await prisma.divisionShadow.upsert({
    where: { hris_division_id: 'DIV-OPS' },
    update: {},
    create: {
      hris_division_id: 'DIV-OPS',
      name: 'Operasional Gudang & Outlet',
    },
  });

  // 2. Users (RBAC)
  await prisma.userShadow.upsert({
    where: { email: 'admin@sobathr.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      hris_user_id: 'USR-ADMIN',
      full_name: 'Super Admin Pusat',
      email: 'admin@sobathr.com',
      role: 'SUPER_ADMIN',
      total_xp: 2500,
      current_rank: 'Pakar SobatHR',
    },
  });

  await prisma.userShadow.upsert({
    where: { email: 'manager.hrbp@sobathr.com' },
    update: { role: 'HRBP_MANAGER' },
    create: {
      hris_user_id: 'USR-HRBP',
      full_name: 'Rina Agustina (HRBP Manager)',
      email: 'manager.hrbp@sobathr.com',
      role: 'HRBP_MANAGER',
      total_xp: 1800,
      current_rank: 'Master Pengetahuan',
    },
  });

  await prisma.userShadow.upsert({
    where: { email: 'budi.trainer@sobathr.com' },
    update: { role: 'TRAINER' },
    create: {
      hris_user_id: 'USR-001',
      full_name: 'Budi Santoso (Trainer)',
      email: 'budi.trainer@sobathr.com',
      role: 'TRAINER',
      total_xp: 650,
      current_rank: 'Karyawan Terampil',
    },
  });

  await prisma.userShadow.upsert({
    where: { email: 'dian.auditor@sobathr.com' },
    update: { role: 'AUDITOR' },
    create: {
      hris_user_id: 'USR-003',
      full_name: 'Dian Pratama (Auditor)',
      email: 'dian.auditor@sobathr.com',
      role: 'AUDITOR',
      total_xp: 450,
      current_rank: 'Karyawan Terampil',
    },
  });

  console.log('Database ready with authentic user data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
