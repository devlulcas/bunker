import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { encodeBase64url } from '@oslojs/encoding';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export const guestSessionCookieName = 'guest-session';

export interface CreateGuestLinkData {
	username: string;
	allowedPages: string[];
	durationHours: number;
	createdBy: string;
}

export async function createGuestLink(data: CreateGuestLinkData) {
	const guestLinkId = randomUUID();
	const guestLink: table.GuestLink = {
		id: guestLinkId,
		username: data.username,
		allowedPages: JSON.stringify(data.allowedPages),
		durationHours: data.durationHours,
		createdAt: new Date(),
		createdBy: data.createdBy
	};

	await db.insert(table.guestLink).values(guestLink);
	return guestLink;
}

export function generateGuestLinkUrl(guestLinkId: string) {
	// In a real app, you might want to use your domain
	return `/guest/${guestLinkId}`;
}

export async function getGuestLink(guestLinkId: string) {
	const [result] = await db
		.select()
		.from(table.guestLink)
		.where(eq(table.guestLink.id, guestLinkId));

	return result || null;
}

export async function createGuestSession(guestLinkId: string) {
	const guestLink = await getGuestLink(guestLinkId);
	if (!guestLink) {
		throw new Error('Guest link not found');
	}

	// Check if link is expired (based on creation time + duration)
	const expiresAt = new Date(
		guestLink.createdAt.getTime() + guestLink.durationHours * 60 * 60 * 1000
	);
	if (Date.now() >= expiresAt.getTime()) {
		throw new Error('Guest link has expired');
	}

	const sessionId = randomUUID();
	const token = encodeBase64url(crypto.getRandomValues(new Uint8Array(18)));

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

export type GuestSessionValidationResult = Awaited<ReturnType<typeof validateGuestSessionToken>>;

export async function getAllGuestLinks() {
	return await db
		.select({
			id: table.guestLink.id,
			username: table.guestLink.username,
			allowedPages: table.guestLink.allowedPages,
			durationHours: table.guestLink.durationHours,
			createdAt: table.guestLink.createdAt,
			createdBy: table.guestLink.createdBy
		})
		.from(table.guestLink)
		.orderBy(table.guestLink.createdAt);
}

export async function deleteGuestLink(guestLinkId: string) {
	// First delete associated sessions
	await db.delete(table.guestSession).where(eq(table.guestSession.guestLinkId, guestLinkId));
	// Then delete the guest link
	await db.delete(table.guestLink).where(eq(table.guestLink.id, guestLinkId));
}
