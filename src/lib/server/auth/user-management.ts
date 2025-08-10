import { db } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export type AuthResult =
	| {
			success: true;
			user: Pick<User, 'id' | 'username' | 'role'>;
	  }
	| {
			success: false;
			error: string;
	  };

export type ValidationResult<T> =
	| {
			value: T;
			valid: true;
	  }
	| {
			valid: false;
			error: string;
	  };

/**
 * Validates username format and length
 */
export function validateUsername(username: unknown): ValidationResult<string> {
	if (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	) {
		return { valid: true, value: username };
	}
	return {
		valid: false,
		error: 'Nome de usuário inválido (min 3, max 31 caracteres, alfanumérico apenas)'
	};
}

/**
 * Validates password format and length
 */
export function validatePassword(password: unknown): ValidationResult<string> {
	if (typeof password === 'string' && password.length >= 6 && password.length <= 255) {
		return { valid: true, value: password };
	}
	return {
		valid: false,
		error: 'Senha inválida (min 6, max 255 caracteres)'
	};
}

/**
 * Generates a unique user ID with 120 bits of entropy
 */
export function generateUserId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}

/**
 * Registers a new user
 * @param username - The username for the new user
 * @param password - The password for the new user
 * @returns AuthResult with success status and user info or error
 */
export async function registerUser(
	username: unknown,
	password: unknown,
	role: 'admin' | 'guest'
): Promise<AuthResult> {
	try {
		// Validate input
		const usernameValidation = validateUsername(username);
		if (!usernameValidation.valid) {
			return { success: false, error: usernameValidation.error };
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return { success: false, error: passwordValidation.error };
		}

		// Check if username already exists
		const existingUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, usernameValidation.value));

		if (existingUser.length > 0) {
			return { success: false, error: 'Nome de usuário já existe' };
		}

		// Generate user ID and hash password
		const userId = generateUserId();
		const passwordHash = await hash(passwordValidation.value, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Insert user into database
		await db
			.insert(table.user)
			.values({ id: userId, username: usernameValidation.value, passwordHash, role });

		return {
			success: true,
			user: { id: userId, username: usernameValidation.value, role }
		};
	} catch (error) {
		console.error('Error registering user:', error);
		return { success: false, error: 'Um erro ocorreu ao registrar o usuário' };
	}
}

export async function loginUser(username: unknown, password: unknown): Promise<AuthResult> {
	try {
		// Validate input
		const usernameValidation = validateUsername(username);
		if (!usernameValidation.valid) {
			return { success: false, error: usernameValidation.error };
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return { success: false, error: passwordValidation.error };
		}

		// Find user by username
		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, usernameValidation.value));

		const existingUser = results.at(0);
		if (!existingUser) {
			return { success: false, error: 'Nome de usuário ou senha incorretos' };
		}

		// Verify password
		const validPassword = await verify(existingUser.passwordHash, passwordValidation.value, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return { success: false, error: 'Nome de usuário ou senha incorretos' };
		}

		return {
			success: true,
			user: { id: existingUser.id, username: existingUser.username, role: existingUser.role }
		};
	} catch (error) {
		console.error('Error logging in user:', error);
		return { success: false, error: 'Um erro ocorreu ao fazer login' };
	}
}
