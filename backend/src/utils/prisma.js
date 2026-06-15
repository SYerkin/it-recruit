import '../config.js';
import { PrismaClient } from '@prisma/client';
import { config } from '../config.js';

// Singleton pattern for Prisma Client
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

