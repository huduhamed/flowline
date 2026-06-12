import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pgPool: Pool | undefined;
};

// Provide a runtime-friendly fallback proxy so importing modules won't crash the server.
let _prisma: PrismaClient | undefined;

if (process.env.DATABASE_URL) {
	try {
		const pool = globalForPrisma.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });
		const adapter = new PrismaPg(pool);
		_prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ['query', 'error', 'warn'] });

		if (process.env.NODE_ENV !== 'production') {
			globalForPrisma.prisma = _prisma;
			globalForPrisma.pgPool = pool;
		}
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Prisma client initialization failed:', err);
		_prisma = undefined;
	}
} else {
	// eslint-disable-next-line no-console
	console.warn('DATABASE_URL not set — Prisma client will not be instantiated.');
}

const unavailableProxy = new Proxy(
	{},
	{
		get() {
			throw new Error('Prisma client is not available. Set DATABASE_URL to enable DB access.');
		},
	},
);

export const prisma = (_prisma ?? (unavailableProxy as unknown)) as PrismaClient;
