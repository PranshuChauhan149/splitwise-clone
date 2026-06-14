import { PrismaClient } from "@prisma/client";

let prisma;

export const initPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
};

export const getPrisma = () => {
  if (!prisma) {
    throw new Error("Prisma client not initialized. Call initPrisma() first.");
  }
  return prisma;
};
