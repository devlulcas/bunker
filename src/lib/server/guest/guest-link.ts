import { JWT_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { SignJWT, errors as jwtErrors, jwtVerify } from 'jose';
import * as v from 'valibot';
import type { PublicUser } from '../user/types';
import type { CreateGuestLink } from './validation';

type JWTPayload = v.InferOutput<typeof JWTPayload>;
const JWTPayload = v.object({
	username: v.string(),
	createdBy: v.string()
});

const JWT_HEADER = {
	alg: 'HS256',
	typ: 'JWT',
	kid: 'guest-link',
	iss: 'guest-link',
	aud: 'guest-link',
	sub: 'guest-link'
};

export async function createGuestLinkId(
	data: Pick<CreateGuestLink, 'username' | 'durationHours'>,
	createdBy: PublicUser
): Promise<string> {
	const payload: JWTPayload = {
		username: data.username,
		createdBy: createdBy.id
	};

	const secret = new TextEncoder().encode(JWT_SECRET);

	const token = await new SignJWT(payload as unknown as Record<string, unknown>)
		.setProtectedHeader(JWT_HEADER)
		.setIssuer(JWT_HEADER.iss)
		.setAudience(JWT_HEADER.aud)
		.setSubject(JWT_HEADER.sub)
		.setJti(crypto.randomUUID())
		.setIssuedAt()
		.setNotBefore('0s')
		.setExpirationTime(`${data.durationHours}h`)
		.sign(secret);

	return token;
}

export async function validateGuestLinkId(guestLinkId: string): Promise<JWTPayload> {
	const secret = new TextEncoder().encode(JWT_SECRET);

	let payload: unknown;
	try {
		const result = await jwtVerify<JWTPayload>(guestLinkId, secret, {
			algorithms: [JWT_HEADER.alg],
			issuer: JWT_HEADER.iss,
			audience: JWT_HEADER.aud,
			subject: JWT_HEADER.sub
		});
		payload = result.payload;
	} catch (e) {
		if (e instanceof jwtErrors.JWTExpired) {
			return error(400, 'Link expirado');
		}
		return error(400, 'Link inválido');
	}

	const parsedPayload = v.safeParse(JWTPayload, payload);

	if (!parsedPayload.success) {
		return error(400, 'Link inválido');
	}

	return parsedPayload.output;
}
