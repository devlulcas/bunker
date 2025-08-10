#!/usr/bin/env node

import readline from 'readline';
import { registerUser } from '../lib/server/auth/user-management';

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
		const result = await registerUser(username.trim(), password, 'admin');

		if (result.success) {
			console.log('✅ User created successfully!');
			console.log(`User ID: ${result.user?.id}`);
			console.log(`Username: ${result.user?.username}`);
		} else {
			console.error('❌ Failed to create user:');
			console.error(result.error);
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
