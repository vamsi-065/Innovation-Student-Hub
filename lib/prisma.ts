import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use a Proxy to lazy-load the Prisma Client only when accessed.
// This prevents initialization errors during build-time module evaluation.
const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    // Skip if it's the Proxy itself being inspected
    if (prop === '$$typeof' || prop === 'constructor') return undefined;
    
    const client = globalThis.prisma ?? (globalThis.prisma = prismaClientSingleton());
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export default prisma;
