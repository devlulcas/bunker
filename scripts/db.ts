import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/db/schema';
dotenv.config();
if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const developmentDatabaseURL = 'http://127.0.0.1:8080';
if (process.env.DATABASE_URL !== developmentDatabaseURL && !process.env.DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_AUTH_TOKEN is not set');
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN
});

export const dbForScripts = drizzle(client, { schema });
