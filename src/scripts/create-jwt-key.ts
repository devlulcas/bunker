import { encodeBase64url } from '@oslojs/encoding';
import fs from 'node:fs';
import path from 'node:path';

const envFile = path.join(process.cwd(), '.env');

function createKey() {
	const key = crypto.getRandomValues(new Uint8Array(32));
	return key;
}

function saveKey(key: Uint8Array) {
	const keyString = encodeBase64url(key);

	// Check if .env file exists and contains JWT_SECRET
	if (fs.existsSync(envFile)) {
		const envContent = fs.readFileSync(envFile, 'utf-8');
		const lines = envContent.split('\n');

		// Find and replace existing JWT_SECRET line
		const jwtSecretIndex = lines.findIndex((line) => line.startsWith('JWT_SECRET='));

		if (jwtSecretIndex !== -1) {
			// Replace existing line
			lines[jwtSecretIndex] = `JWT_SECRET=${keyString}`;
		} else {
			// Add new line
			lines.push(`JWT_SECRET=${keyString}`);
		}

		fs.writeFileSync(envFile, lines.join('\n'));
	} else {
		// Create new .env file
		fs.writeFileSync(envFile, `JWT_SECRET=${keyString}`);
	}
}

const key = createKey();
saveKey(key);

console.log('JWT secret created and saved to .env file');
