#!/usr/bin/env node
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import readline from 'readline';
import * as v from 'valibot';
import { generateUserId } from '../src/lib/helpers/crypto';
import { isOk, wrapAsync } from '../src/lib/helpers/result';
import * as table from '../src/lib/server/db/schema';
import { CreateUser } from '../src/lib/server/user/types';
import { dbForScripts } from './db';

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Promise wrapper for readline
function question(prompt: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(prompt, resolve);
	});
}

export async function registerRootUser(username: unknown, password: unknown) {
	try {
		const parsed = v.safeParse(CreateUser, { username, password });

		if (!parsed.success) {
			const issues = v.flatten(parsed.issues);
			console.error('Failed to parse user data', issues);
			process.exit(1);
		}

		const existingUser = await dbForScripts
			.select()
			.from(table.user)
			.where(eq(table.user.username, parsed.output.username));

		if (existingUser.length > 0) {
			console.error('Username already exists');
			process.exit(1);
		}

		const userId = generateUserId();
		const passwordHash = await hash(parsed.output.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const role = 'admin';

		await dbForScripts.insert(table.user).values({
			id: userId,
			username: parsed.output.username,
			passwordHash,
			role
		});

		return { id: userId, username: parsed.output.username, role };
	} catch (err) {
		console.error('An error occurred while registering the user', err);
		process.exit(1);
	}
}

async function main() {
	try {
		console.log('=== User Registration CLI ===\n');

		// Get username
		const username = await question('Enter username: ');
		if (!username.trim()) {
			console.error('Username cannot be empty');
			process.exit(1);
		}

		// Get password
		const password = await question('Enter password: ');
		if (!password.trim()) {
			console.error('Password cannot be empty');
			process.exit(1);
		}

		// Confirm password
		const confirmPassword = await question('Confirm password: ');
		if (password !== confirmPassword) {
			console.error('Passwords do not match');
			process.exit(1);
		}

		console.log('\nCreating user...');

		// Register the user
		const result = await wrapAsync(registerRootUser(username.trim(), password));

		if (isOk(result)) {
			console.log('✅ User created successfully!');
			console.log(`User ID: ${result.value.id}`);
			console.log(`Username: ${result.value.username}`);
		} else {
			console.error('❌ Failed to create user:');
			console.error(result.fail);
			process.exit(1);
		}
	} catch (error) {
		console.error('❌ An error occurred:', error);
		process.exit(1);
	} finally {
		rl.close();
	}
}

// Handle process termination
process.on('SIGINT', () => {
	console.log('\n\nOperation cancelled by user');
	rl.close();
	process.exit(0);
});

// Run the CLI
main().catch((error) => {
	console.error('❌ Unexpected error:', error);
	process.exit(1);
});
