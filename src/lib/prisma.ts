import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Dit laat SQL queries zien in je terminal (handig!)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;