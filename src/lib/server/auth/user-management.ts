import { generateUserId } from '$lib/helpers/crypto';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import type { PublicUser } from '../user/types';
import { CreateUser, LoginUser } from '../user/types';

export async function registerRootUser(username: unknown, password: unknown): Promise<PublicUser> {
	try {
		const parsed = v.safeParse(CreateUser, { username, password });

		if (!parsed.success) {
			const issues = v.flatten(parsed.issues);
			return error(400, JSON.stringify(issues));
		}

		const existingUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, parsed.output.username));

		if (existingUser.length > 0) {
			return error(400, 'Nome de usuário já existe');
		}

		const userId = generateUserId();
		const passwordHash = await hash(parsed.output.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const role = 'admin';

		await db.insert(table.user).values({
			id: userId,
			username: parsed.output.username,
			passwordHash,
			role
		});

		return { id: userId, username: parsed.output.username, role };
	} catch (err) {
		console.error('Um erro ocorreu ao registrar o usuário', err);
		return error(500, 'Um erro ocorreu ao registrar o usuário');
	}
}

export async function loginUser(username: unknown, password: unknown): Promise<PublicUser> {
	try {
		const parsed = v.safeParse(LoginUser, { username, password });
		if (!parsed.success) {
			const issues = v.flatten(parsed.issues);
			return error(400, JSON.stringify(issues));
		}

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, parsed.output.username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return error(400, 'Nome de usuário ou senha incorretos');
		}

		const validPassword = await verify(existingUser.passwordHash, parsed.output.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return error(400, 'Nome de usuário ou senha incorretos');
		}

		return {
			id: existingUser.id,
			username: existingUser.username,
			role: existingUser.role
		};
	} catch (err) {
		console.error('Um erro ocorreu ao fazer login', err);
		return error(500, 'Um erro ocorreu ao fazer login');
	}
}
