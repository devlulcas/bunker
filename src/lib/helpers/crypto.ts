import { encodeBase32LowerCase } from '@oslojs/encoding';

export function generateUserId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase32LowerCase(bytes);
}
