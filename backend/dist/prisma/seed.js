"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
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
//# sourceMappingURL=seed.js.map