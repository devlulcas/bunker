import { env } from '$env/dynamic/public';
import { fail, ok } from '$lib/helpers/result';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PublicUser } from '../user/types';
import { createGuestLinkId } from './guest-link';
import type { CreateGuestLink } from './validation';

export async function createGuestLink(data: CreateGuestLink, createdBy: PublicUser) {
	const guestLinkId = await createGuestLinkId(data, createdBy);
	const guestLink: table.GuestLink = {
		id: guestLinkId,
		username: data.username,
		allowedPages: JSON.stringify(data.allowedPages),
		durationHours: data.durationHours,
		createdAt: new Date(),
		createdBy: createdBy.id
	};

	await db.insert(table.guestLink).values(guestLink);
	return guestLink;
}

export function generateGuestLinkUrl(guestLinkId: string) {
	const baseUrl = env.PUBLIC_APP_URL;
	return `${baseUrl}/guest/${guestLinkId}`;
}

export async function getGuestLink(guestLinkId: string) {
	const [result] = await db
		.select()
		.from(table.guestLink)
		.where(eq(table.guestLink.id, guestLinkId));

	return result || null;
}

export async function getAllGuestLinks() {
	return db
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
	return await db.transaction(async (tx) => {
		try {
			await tx.delete(table.guestSession).where(eq(table.guestSession.guestLinkId, guestLinkId));
			await tx.delete(table.guestLink).where(eq(table.guestLink.id, guestLinkId));
			return ok(true);
		} catch (error) {
			tx.rollback();
			console.error('Falha ao deletar link de convidado:', error);
			return fail('Falha ao deletar link de convidado');
		}
	});
}
