import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials:
		process.env.NODE_ENV === 'production'
			? { authToken: process.env.DATABASE_AUTH_TOKEN, url: process.env.DATABASE_URL }
			: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true
});
