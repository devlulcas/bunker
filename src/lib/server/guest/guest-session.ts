import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { validateGuestLinkId } from './guest-link';
import { getGuestLink } from './guest-management';

export const GUEST_SESSION_COOKIE_NAME = 'guest-session';

export async function createGuestSession(guestLinkId: string) {
	await validateGuestLinkId(guestLinkId);
	const guestLink = await getGuestLink(guestLinkId);
	if (!guestLink) {
		return error(404, 'Guest link not found');
	}

	const expiresAt = new Date(
		guestLink.createdAt.getTime() + guestLink.durationHours * 60 * 60 * 1000
	);
	if (Date.now() >= expiresAt.getTime()) {
		return error(400, 'Guest link has expired');
	}

	const token = encodeBase64url(crypto.getRandomValues(new Uint8Array(18)));
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const guestSession: table.GuestSession = {
		id: sessionId,
		guestLinkId,
		token,
		expiresAt,
		createdAt: new Date()
	};

	await db.insert(table.guestSession).values(guestSession);
	return { guestSession, guestLink };
}

export async function validateGuestSessionToken(token: string) {
	const [result] = await db
		.select({
			guestSession: table.guestSession,
			guestLink: table.guestLink
		})
		.from(table.guestSession)
		.innerJoin(table.guestLink, eq(table.guestSession.guestLinkId, table.guestLink.id))
		.where(eq(table.guestSession.token, token));

	if (!result) {
		return { guestSession: null, guestLink: null };
	}

	const { guestSession, guestLink } = result;

	// Check if session is expired
	if (Date.now() >= guestSession.expiresAt.getTime()) {
		// Clean up expired session
		await db.delete(table.guestSession).where(eq(table.guestSession.id, guestSession.id));
		return { guestSession: null, guestLink: null };
	}

	return { guestSession, guestLink };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateGuestSessionToken>>;
