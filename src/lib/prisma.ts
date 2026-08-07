import { PrismaClient } from "@prisma/client";

/**
 * A single PrismaClient per process. Next.js dev mode re-evaluates modules on
 * every hot reload, which would otherwise open a new pool each time until
 * SQLite/Postgres runs out of connections.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
