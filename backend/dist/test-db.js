"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.userShadow.findMany();
    console.log('USERS:', users);
    const attempts = await prisma.employeeQuizAttempt.findMany();
    console.log('ATTEMPTS:', attempts);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=test-db.js.map