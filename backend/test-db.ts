import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.userShadow.findMany();
  console.log('USERS:', users);
  const attempts = await prisma.employeeQuizAttempt.findMany();
  console.log('ATTEMPTS:', attempts);
}
main().finally(() => prisma.$disconnect());
