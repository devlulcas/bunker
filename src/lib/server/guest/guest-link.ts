import { JWT_SECRET } from '$env/static/private';
import { isFail, wrap } from '$lib/helpers/result';
import { encodeJWT, parseJWT } from '@oslojs/jwt';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PublicUser } from '../user/types';
import type { CreateGuestLink } from './validation';

type JWTHeader = v.InferOutput<typeof JWTHeader>;
const JWTHeader = v.object({
	alg: v.literal('HS256'),
	typ: v.literal('JWT'),
	kid: v.string(),
	iss: v.string(),
	aud: v.string(),
	sub: v.string(),
	exp: v.number(),
	iat: v.number(),
	nbf: v.number(),
	jti: v.string()
});

type JWTPayload = v.InferOutput<typeof JWTPayload>;
const JWTPayload = v.object({
	username: v.string(),
	allowedPages: v.array(v.string()),
	durationHours: v.number(),
	createdBy: v.string()
});

export async function createGuestLinkId(
	data: CreateGuestLink,
	createdBy: PublicUser
): Promise<string> {
	const payload: JWTPayload = {
		username: data.username,
		allowedPages: data.allowedPages,
		durationHours: data.durationHours,
		createdBy: createdBy.id
	};

	const now = new Date();
	const expiresAt = new Date(now.getTime() + data.durationHours * 60 * 60 * 1000);
	const header: JWTHeader = {
		alg: 'HS256',
		typ: 'JWT',
		kid: 'guest-link',
		iss: 'me',
		aud: 'me',
		sub: 'me',
		exp: expiresAt.getTime(),
		iat: now.getTime(),
		nbf: now.getTime(),
		jti: crypto.randomUUID()
	};

	const key = await importKey();

	return encodeJWT(JSON.stringify(header), JSON.stringify(payload), key.uint8Array);
}

export async function validateGuestLinkId(guestLinkId: string): Promise<JWTPayload> {
	const parts = guestLinkId.split('.');

	if (parts.length !== 3) {
		return error(400, 'Link inválido');
	}

	const jwtParsingResult = wrap(() => parseJWT(guestLinkId));

	if (isFail(jwtParsingResult)) {
		return error(400, 'Link inválido');
	}

	const [header, payload, signature] = jwtParsingResult.value;

	const parsedHeader = v.safeParse(JWTHeader, header);

	if (!parsedHeader.success) {
		return error(400, 'Link inválido');
	}

	const now = new Date();
	const expiresAt = new Date(parsedHeader.output.exp);
	if (expiresAt < now) {
		return error(400, 'Link expirado');
	}

	const key = await importKey();

	const headerAndBodyBytes = new TextEncoder().encode(parts[0] + '.' + parts[1]);

	const validSignature = await crypto.subtle.verify(
		key.key.algorithm.name,
		key.key,
		signature,
		headerAndBodyBytes
	);

	if (!validSignature) {
		return error(400, 'Link inválido');
	}

	const parsedPayload = v.safeParse(JWTPayload, payload);

	if (!parsedPayload.success) {
		return error(400, 'Link inválido');
	}

	return parsedPayload.output;
}

async function importKey() {
	const uint8Array = new TextEncoder().encode(JWT_SECRET);

	const hmacCryptoKey = await crypto.subtle.importKey(
		'raw',
		uint8Array,
		{
			name: 'HMAC',
			hash: 'SHA-256'
		},
		false,
		['sign', 'verify']
	);

	return {
		key: hmacCryptoKey,
		uint8Array
	};
}
