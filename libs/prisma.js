import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis;

// Add debug logging for Bun compatibility
const prisma = globalForPrisma.prisma || new PrismaClient({
  // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test database connection
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error);
});

export default prisma; 